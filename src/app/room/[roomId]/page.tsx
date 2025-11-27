// src/app/room/[roomId]/page.tsx
import RoomClient from "./RoomClient";

type RoomPageProps = {
    params: { roomId: string };
    searchParams: { name?: string };
};

export default function RoomPage({ params, searchParams }: RoomPageProps) {
    // roomId lấy từ URL /room/[roomId]
    const roomName = decodeURIComponent(params.roomId);

    // ?name=... lấy từ query
    const rawName = searchParams.name;
    const displayName =
        typeof rawName === "string" && rawName.trim().length > 0
            ? rawName.trim()
            : "Guest";

    return (
        <RoomClient
            roomName={roomName}
            displayName={displayName}
        />
    );
}
