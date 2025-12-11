"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
    fps?: number;
};

export default function DetectionOverlay({ fps = 1 }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayRef = useRef<HTMLCanvasElement | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const [wsState, setWsState] = useState<{
        status: string;
        lastRespMs?: number;
        lastFrameId?: number;
        lastDetCount?: number;
    }>({ status: "idle" });

    useEffect(() => {
        let stopped = false;
        let sendInterval: number | undefined;

        async function start() {
            try {
                // Lấy camera
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (stopped) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }

                // Video ẩn để đọc frame
                const video = document.createElement("video");
                video.autoplay = true;
                video.playsInline = true;
                video.muted = true;
                video.srcObject = stream;
                await video.play();
                videoRef.current = video;

                // Canvas offscreen để chụp ảnh
                const cap = document.createElement("canvas");
                captureCanvasRef.current = cap;

                // Canvas overlay trên UI
                const overlay = overlayRef.current;
                if (overlay) {
                    overlay.width = video.videoWidth || 640;
                    overlay.height = video.videoHeight || 480;
                }

                // Kết nối WebSocket backend
                const scheme = location.protocol === "https:" ? "wss" : "ws";
                const host = location.hostname;
                const wsUrl = `${scheme}://${host}:8000/ws/detection`;

                console.log("DetectionOverlay: connecting to WS", wsUrl);
                const ws = new WebSocket(wsUrl);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log("DetectionOverlay: WS opened");
                    setWsState({ status: "open" });

                    const intervalMs = Math.max(200, Math.round(1000 / fps));

                    // Gửi frame định kỳ
                    sendInterval = window.setInterval(async () => {
                        try {
                            if (!videoRef.current || ws.readyState !== WebSocket.OPEN) return;

                            const v = videoRef.current;
                            const c = captureCanvasRef.current!;
                            c.width = v.videoWidth || 640;
                            c.height = v.videoHeight || 480;

                            const ctx = c.getContext("2d");
                            if (!ctx) return;

                            ctx.drawImage(v, 0, 0, c.width, c.height);

                            c.toBlob(
                                async (blob) => {
                                    if (!blob) return;
                                    const arrayBuffer = await blob.arrayBuffer();

                                    let binary = "";
                                    const bytes = new Uint8Array(arrayBuffer);
                                    const chunkSize = 0x8000;

                                    for (let i = 0; i < bytes.length; i += chunkSize) {
                                        binary += String.fromCharCode.apply(
                                            null,
                                            Array.from(bytes.subarray(i, i + chunkSize)),
                                        ); // eslint-disable-line
                                    }

                                    const b64 = btoa(binary);
                                    try {
                                        console.log("DetectionOverlay: sending frame", {
                                            bytes: bytes.length,
                                        });
                                        ws.send(JSON.stringify({ image: b64 }));
                                    } catch (err) {
                                        console.error("DetectionOverlay: failed to send frame", err);
                                    }
                                },
                                "image/jpeg",
                                0.7,
                            );
                        } catch {
                            // ignore per-frame errors
                        }
                    }, intervalMs) as unknown as number;
                };

                ws.onmessage = (ev) => {
                    try {
                        console.log("DetectionOverlay: ws message", ev.data);
                        const data = JSON.parse(ev.data);
                        const detections = data?.detections || [];

                        setWsState({
                            status: "open",
                            lastRespMs: data?._process_ms,
                            lastFrameId: data?._frame_id,
                            lastDetCount: Array.isArray(detections)
                                ? detections.length
                                : 0,
                        });

                        drawDetections(detections);
                    } catch (e) {
                        console.warn(
                            "DetectionOverlay: failed to parse ws message",
                            e,
                        );
                    }
                };

                ws.onerror = (ev) => {
                    console.error("DetectionOverlay: ws error", ev);
                    setWsState((prev) => ({ ...prev, status: "error" }));
                };

                ws.onclose = (ev) => {
                    console.log("DetectionOverlay: ws closed", ev.code, ev.reason);
                    setWsState((prev) => ({ ...prev, status: "closed" }));
                };
            } catch (e) {
                console.error("DetectionOverlay error:", e);
            }
        }

        start();

        return () => {
            stopped = true;

            if (sendInterval) window.clearInterval(sendInterval);

            if (wsRef.current) {
                try {
                    wsRef.current.close();
                } catch {
                    // ignore
                }
            }

            if (videoRef.current && videoRef.current.srcObject) {
                const s = videoRef.current.srcObject as MediaStream;
                s.getTracks().forEach((t) => t.stop());
            }
        };
    }, [fps]);

    function drawDetections(detections: any[]) {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const ctx = overlay.getContext("2d");
        if (!ctx) return;

        const cap = captureCanvasRef.current;
        if (cap) {
            // để kích thước overlay khớp với kích thước frame gốc
            overlay.width = cap.width;
            overlay.height = cap.height;
        }

        // XÓA sạch, KHÔNG vẽ background frame nữa → hết ảnh mờ đằng sau
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 2;
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#00FF00";

        for (const d of detections) {
            const bbox = d?.bbox || [0, 0, 0, 0];
            const x = bbox[0];
            const y = bbox[1];
            const w = bbox[2];
            const h = bbox[3];

            ctx.strokeRect(x, y, w, h);

            const label = `${d?.label ?? ""} ${(
                (d?.confidence ?? 0) * 100
            ).toFixed(0)}%`;
            ctx.fillText(label, x + 4, Math.max(12, y - 6));
        }
    }

    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
            }}
        >
            <canvas
                ref={overlayRef}
                style={{ width: "100%", height: "100%", display: "block" }}
            />
            <div
                style={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    padding: "6px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    pointerEvents: "auto",
                }}
            >
                <div>
                    <strong>WS:</strong> {wsState.status}
                </div>
                <div style={{ opacity: 0.9 }}>
                    Frame: {wsState.lastFrameId ?? "-"}
                </div>
                <div style={{ opacity: 0.9 }}>
                    Det: {wsState.lastDetCount ?? "-"}
                </div>
                <div style={{ opacity: 0.9 }}>
                    Proc ms: {wsState.lastRespMs ?? "-"}
                </div>
            </div>
        </div>
    );
}
