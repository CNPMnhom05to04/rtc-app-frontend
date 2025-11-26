"use client";

import { useEffect, useRef } from "react";

type CameraFrame = {
    imageData: ImageData;   // dữ liệu pixel RGBA
    width: number;
    height: number;
    timestamp: number;      // Date.now() tại thời điểm lấy frame
};

type UseCameraImageProcessorOptions = {
    /** Tần suất lấy frame (ms). Mặc định: 500ms = ~2fps */
    intervalMs?: number;
    /**
     * Callback cho mỗi frame -> đây chính là "stream" frame cho AI.
     * Bạn có thể convert imageData -> tensor, gửi WS, v.v.
     */
    onFrame?: (frame: CameraFrame) => void;
};

/**
 * Nhận MediaStream từ camera, vẽ lên canvas, sau đó
 * stream từng frame ra ngoài qua onFrame (ImageData, width, height, timestamp).
 *
 * Không dùng Blob nữa.
 */
export function useCameraImageProcessor(
    stream: MediaStream | null,
    options: UseCameraImageProcessorOptions = {}
) {
    const { intervalMs = 500, onFrame } = options;

    // Canvas nội bộ để render frame (bạn có thể gắn ra UI nếu muốn)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!stream || !canvasRef.current || !onFrame) return;

        const [videoTrack] = stream.getVideoTracks();
        if (!videoTrack) return;

        // Video ẩn đọc frame từ track
        const tempVideo = document.createElement("video");
        tempVideo.srcObject = new MediaStream([videoTrack]);
        tempVideo.muted = true;
        tempVideo.playsInline = true;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let intervalId: number;

        tempVideo.onloadedmetadata = () => {
            tempVideo.play();

            intervalId = window.setInterval(() => {
                const vw = tempVideo.videoWidth || 640;
                const vh = tempVideo.videoHeight || 480;

                canvas.width = vw;
                canvas.height = vh;

                // Vẽ frame hiện tại lên canvas
                ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);

                // Lấy dữ liệu pixel
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Đây chính là 1 "frame" trong stream
                const frame: CameraFrame = {
                    imageData,
                    width: canvas.width,
                    height: canvas.height,
                    timestamp: Date.now(),
                };

                // ⬇️ Stream frame ra ngoài cho AI
                onFrame(frame);
            }, intervalMs);
        };

        return () => {
            window.clearInterval(intervalId);
            tempVideo.pause();
            tempVideo.srcObject = null;
        };
    }, [stream, intervalMs, onFrame]);

    return { canvasRef };
}
