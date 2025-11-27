// src/app/room/[roomId]/RoomClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { fetchLivekitToken } from "@/lib/livekit";

type RoomClientProps = {
    roomName: string;
    displayName: string;
};

export default function RoomClient({ roomName, displayName }: RoomClientProps) {
    const router = useRouter();
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

        return () => {
            cancelled = true;
        };
    }, [roomName, displayName]);

    // UI trạng thái
    if (loading) return <div className="p-6">Đang lấy token…</div>;
    if (error) return <div className="p-6 text-red-600">Lỗi: {error}</div>;
    if (!token) return <div className="p-6 text-red-600">Không có token.</div>;

    const onDisconnected = () => router.push("/rtc");

    return (
        <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            connect
            video
            audio
            onDisconnected={onDisconnected}
            style={{ height: "100dvh" }}
        >
            <VideoConference />
        </LiveKitRoom>
    );
}
