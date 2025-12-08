// src/components/features/rtc/CreateRoomForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CreateRoomForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const n = name.trim();
        const r = roomId.trim();

        if (!n || !r) {
            setErrorMsg("Vui lòng nhập đầy đủ Tên hiển thị và Mã phòng.");
            return;
        }

        setErrorMsg(null);
        setLoading(true);

        try {
            // Join phòng (tự tạo nếu chưa tồn tại)
            router.push(
                `/room/${encodeURIComponent(r)}?name=${encodeURIComponent(n)}`
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg">
            {/* TIÊU ĐỀ + MÔ TẢ: giống LoginForm */}
            <h2 className="text-xl font-medium text-center text-black">
                Tham gia phòng học
            </h2>

            <p className="text-sm text-black text-center">
                Nhập tên hiển thị và mã phòng để tham gia buổi học trực tuyến
                trên hệ thống.
            </p>

            <form className="space-y-4" onSubmit={onSubmit}>
                <div>
                    <label className="block mb-1 text-sm font-medium text-black">
                        Tên hiển thị
                    </label>
                    <Input
                        placeholder="VD: Tùng"
                        className="text-[#ACACAC]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-black">
                        Mã phòng
                    </label>
                    <Input
                        placeholder="VD: room-001"
                        className="text-[#ACACAC]"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                </div>

                {errorMsg && (
                    <div className="text-red-600 text-sm">{errorMsg}</div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-[#2F327D] text-white hover:opacity-90 disabled:opacity-60"
                    disabled={loading || !name.trim() || !roomId.trim()}
                >
                    {loading ? "Đang vào phòng..." : "Vào phòng"}
                </Button>
            </form>
        </div>
    );
}
