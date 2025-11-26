// src/components/rtc/MockConference.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCameraImageProcessor } from "@/hooks/useCameraImageProcessor";

type MockConferenceProps = {
    roomId: string;
    name: string;
    // Nếu bên ngoài vẫn muốn lấy stream camera thì dùng callback này
    onCameraStream?: (stream: MediaStream | null) => void;
};

export default function MockConference({
    roomId,
    name,
    onCameraStream,
}: MockConferenceProps) {
    const router = useRouter();

    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    // Share màn hình
    const screenVideoRef = useRef<HTMLVideoElement | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const isSharing = !!screenStream;

    // Stream từ camera (video + audio) để đưa vào hook
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

    // Hook xử lý hình ảnh: stream frame cho AI và vẽ lên canvas
    const { canvasRef } = useCameraImageProcessor(camOn ? cameraStream : null, {
        intervalMs: 200, // ~5fps
        onFrame: (frame) => {
            // frame.imageData.data -> Uint8ClampedArray RGBA
            // frame.width, frame.height, frame.timestamp
            // TODO: đưa frame này cho AI (TF.js, ONNX, WebSocket...)
        },
    });

    // Lấy stream camera (getUserMedia) khi mic/cam thay đổi
    useEffect(() => {
        let activeStream: MediaStream | null = null;

        async function setup() {
            // Nếu tắt cả mic và cam -> dừng stream cũ, clear
            if (!micOn && !camOn) {
                setCameraStream((old) => {
                    old?.getTracks().forEach((t) => t.stop());
                    return null;
                });
                onCameraStream?.(null);
                return;
            }

            try {
                activeStream = await navigator.mediaDevices.getUserMedia({
                    video: camOn,
                    audio: micOn,
                });

                // Dừng stream cũ (nếu có) rồi set stream mới
                setCameraStream((old) => {
                    old?.getTracks().forEach((t) => t.stop());
                    return activeStream!;
                });

                onCameraStream?.(activeStream);
            } catch (err) {
                console.error("getUserMedia error", err);
                setCameraStream((old) => {
                    old?.getTracks().forEach((t) => t.stop());
                    return null;
                });
                onCameraStream?.(null);
            }
        }

        setup();

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach((t) => t.stop());
            }
        };
    }, [micOn, camOn, onCameraStream]);

    // Gắn stream share màn hình vào video
    useEffect(() => {
        if (screenVideoRef.current && screenStream) {
            screenVideoRef.current.srcObject = screenStream;
        }
    }, [screenStream]);

    // Dọn share màn hình khi unmount
    useEffect(() => {
        return () => {
            if (screenStream) {
                screenStream.getTracks().forEach((t) => t.stop());
            }
        };
    }, [screenStream]);

    async function toggleScreenShare() {
        if (screenStream) {
            screenStream.getTracks().forEach((t) => t.stop());
            setScreenStream(null);
            return;
        }

        try {
            const stream = await (navigator.mediaDevices as any).getDisplayMedia({
                video: true,
            });
            setScreenStream(stream);
        } catch (err) {
            console.error("screen share error", err);
        }
    }

    function handleLeaveRoom() {
        router.push("/rtc");
    }

    // Danh sách người tham gia (mock: hiện tại chỉ có bạn)
    const participants = [{ id: "self", name: name || "Bạn" }];

    const maxVisibleParticipants = 6;
    const visibleParticipants = participants.slice(0, maxVisibleParticipants);
    const hiddenCount = participants.length - visibleParticipants.length;

    return (
        <div className="flex h-[100dvh] flex-col bg-black text-white">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 bg-zinc-900">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-base font-semibold">Phòng: {roomId}</h2>
                    <span className="text-xs text-gray-400">(mock / offline)</span>
                </div>
                <div className="text-sm text-gray-200">
                    Bạn: <b>{name}</b>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-3 p-4">
                {/* Khu chính: camera + (optional) share màn hình */}
                {/* ✔ Luôn 2 cột trên desktop để khung không đổi size */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Ô camera – hiển thị từ hook (canvas) */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-black/80">
                        <canvas
                            ref={canvasRef}
                            className="h-full w-full"
                        />
                        {(!camOn || !cameraStream) && (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                                Camera đang tắt hoặc không khả dụng
                            </div>
                        )}
                        <div className="absolute left-2 top-2 rounded bg-white/80 px-2 py-1 text-xs text-black">
                            Camera của bạn (qua hook)
                        </div>
                    </div>

                    {/* Cột thứ 2: share màn hình nếu có, nếu không vẫn giữ 1 ô trống để layout ổn định */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-black/40">
                        {isSharing ? (
                            <>
                                <video
                                    ref={screenVideoRef}
                                    autoPlay
                                    playsInline
                                    className="h-full w-full object-contain"
                                />
                                <div className="absolute left-2 top-2 rounded bg-white/80 px-2 py-1 text-xs text-black">
                                    Đang chia sẻ màn hình
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                                Chưa chia sẻ màn hình
                            </div>
                        )}
                    </div>
                </div>

                {/* Dãy người tham gia */}
                <section className="mt-2 border-t border-zinc-800 pt-3">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-400">
                        <span>Người tham gia</span>
                        <span className="text-[11px] text-gray-500">
                            {participants.length} người
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {visibleParticipants.map((p) => (
                            <div
                                key={p.id}
                                className="flex h-16 min-w-[80px] items-center justify-center rounded-lg bg-gray-900 px-2 text-[11px] text-white"
                            >
                                {p.name}
                            </div>
                        ))}

                        {hiddenCount > 0 && (
                            <div className="flex h-16 min-w-[80px] items-center justify-center rounded-lg bg-gray-700 px-2 text-[11px] text-white">
                                +{hiddenCount} người khác
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Control bar */}
            <footer className="flex flex-wrap items-center justify-center gap-3 border-t border-zinc-800 bg-zinc-900 p-3">
                <button
                    onClick={() => setMicOn((prev) => !prev)}
                    className="rounded-md border border-zinc-700 px-3 py-2 text-sm"
                >
                    {micOn ? "Tắt Mic" : "Bật Mic"}
                </button>

                <button
                    onClick={() => setCamOn((prev) => !prev)}
                    className="rounded-md border border-zinc-700 px-3 py-2 text-sm"
                >
                    {camOn ? "Tắt Cam" : "Bật Cam"}
                </button>

                <button
                    onClick={toggleScreenShare}
                    className="rounded-md border border-zinc-700 px-3 py-2 text-sm"
                >
                    {isSharing ? "Dừng chia sẻ màn hình" : "Chia sẻ màn hình"}
                </button>

                <button className="rounded-md border border-zinc-700 px-3 py-2 text-sm">
                    Chat
                </button>

                <button
                    onClick={handleLeaveRoom}
                    className="rounded-md border border-red-500 px-3 py-2 text-sm text-red-400"
                >
                    Rời phòng
                </button>
            </footer>
        </div>
    );
}
