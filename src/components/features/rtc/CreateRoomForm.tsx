"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRoomForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const n = name.trim();
        const r = roomId.trim();
        if (!n || !r) return;
        // Join = auto-create room nếu chưa tồn tại
        router.push(`/room/${encodeURIComponent(r)}?name=${encodeURIComponent(n)}`);
    }

    return (
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4 rounded-xl border p-6">
            <h1 className="text-xl font-semibold">Tham gia phòng</h1>

            <div className="space-y-1">
                <label className="text-sm font-medium">Tên hiển thị</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Tùng"
                    className="w-full rounded-md border px-3 py-2 outline-none"
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium">Mã phòng</label>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="VD: room-001"
                    className="w-full rounded-md border px-3 py-2 outline-none"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
                disabled={!name.trim() || !roomId.trim()}
            >
                Vào phòng
            </button>

        </form>
    );
}
