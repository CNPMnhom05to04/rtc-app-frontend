// src/app/room/[roomId]/RoomClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { fetchLivekitToken } from "@/lib/livekit";
import { defaultLiveKitOptions } from "@/lib/livekitOptions";

type RoomClientProps = {
    roomName: string;
    displayName: string;
};

type Status = "loading" | "ready" | "error";

export default function RoomClient({ roomName, displayName }: RoomClientProps) {
    const router = useRouter();
    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    const [token, setToken] = useState<string | null>(null);
    const [status, setStatus] = useState<Status>("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {

        if (!serverUrl) {
            setStatus("error");
            setErrorMessage("Thiếu cấu hình NEXT_PUBLIC_LIVEKIT_URL.");
            return;
        }

        let cancelled = false;

        async function loadToken() {
            try {
                setStatus("loading");

                const t = await fetchLivekitToken(roomName, displayName);
                if (cancelled) return;

                setToken(t);
                setStatus("ready");
            } catch (err: any) {
                if (cancelled) return;

                setErrorMessage(err?.message ?? "Không lấy được token LiveKit.");
                setStatus("error");
            }
        }

        loadToken();

        // cleanup: nếu component bị unmount giữa chừng thì không setState nữa
        return () => {
            cancelled = true;
        };
    }, [roomName, displayName, serverUrl]);

    const handleDisconnected = () => {
        router.push("/rtc");
    };

    // UI trạng thái
    if (status === "loading") {
        return <div className="p-6">Đang kết nối phòng…</div>;
    }

    if (status === "error" || !token) {
        return (
            <div className="p-6 text-red-600">
                Không thể vào phòng.
                {errorMessage && (
                    <div className="mt-1 text-sm">
                        Chi tiết: {errorMessage}
                    </div>
                )}
            </div>
        );
    }

    // Đến đây chắc chắn đã có token + serverUrl
    return (
        <LiveKitRoom
            token={token}
            serverUrl={serverUrl!}
            connect
            video
            audio
            options={defaultLiveKitOptions} // ✅ bật simulcast + adaptive + dynacast
            onDisconnected={handleDisconnected}
            style={{ height: "100dvh" }}
        >
            <VideoConference />
        </LiveKitRoom>
    );
}
