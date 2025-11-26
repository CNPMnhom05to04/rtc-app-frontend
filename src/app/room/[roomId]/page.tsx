"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { fetchLivekitToken } from "@/lib/livekit";

export default function RoomPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const search = useSearchParams();
    const router = useRouter();

    const roomName = decodeURIComponent(roomId);
    const displayName = search.get("name") || "Guest";
    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const t = await fetchLivekitToken(roomName, displayName);
                if (!cancelled) setToken(t);
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Failed to fetch token");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [roomName, displayName]);

    // UI đơn giản cho trạng thái
    if (loading) return <div className="p-6">Đang lấy token…</div>;
    if (error) return <div className="p-6 text-red-600">Lỗi: {error}</div>;
    if (!token) return <div className="p-6 text-red-600">Không có token.</div>;

    // Khi rời phòng, quay về trang tạo phòng
    const onDisconnected = () => router.push("/rtc");

    return (
        <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            connect
            video
            audio
            onDisconnected={onDisconnected}
            // adaptiveStream, dynacast… có thể bật thêm:
            // options={{ adaptiveStream: true, dynacast: true }}
            style={{ height: "100dvh" }}
        >
            {/* UI mặc định: có mic/cam/screen/participants/leave sẵn */}
            <VideoConference />
        </LiveKitRoom>
    );
}
