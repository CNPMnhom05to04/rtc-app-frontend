"use client";

import PageHeader from "@/components/ui/PageHeader";
import { useState } from "react";

const PRIMARY = "#1F2A7A";
const PASS_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

type Props = { onSuccess?: () => void };

export default function ChangePassword({ onSuccess }: Props) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState({ cur: false, next: false, cf: false });

    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    const apiBase =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8080";

    const canSubmit =
        currentPassword.length > 0 &&
        PASS_RULE.test(newPassword) &&
        newPassword === confirm &&
        newPassword !== currentPassword &&
        !submitting;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        setErrorMsg(null);
        setOkMsg(null);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");

            const res = await fetch(`${apiBase}/api/users/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || data?.error || `Đổi mật khẩu thất bại (mã ${res.status}).`);
            }

            setOkMsg("Đổi mật khẩu thành công!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirm("");
            onSuccess?.();
        } catch (err: any) {
            setErrorMsg(err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>

            <PageHeader
                title="Đổi mật khẩu"
                subtitle="Bảo vệ tài khoản của bạn"
                collapseTop
                className="-mx-8"
            />

            <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Mật khẩu hiện tại */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Mật khẩu hiện tại</label>
                        <div className="relative">
                            <input
                                type={show.cur ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 font-semibold placeholder:text-gray-600 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => ({ ...s, cur: !s.cur }))}
                                className="absolute inset-y-0 right-2 my-auto text-sm font-semibold text-gray-700 hover:text-gray-900"
                            >
                                {show.cur ? "Ẩn" : "Hiện"}
                            </button>
                        </div>
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Mật khẩu mới</label>
                        <div className="relative">
                            <input
                                type={show.next ? "text" : "password"}
                                placeholder="Nhập mật khẩu mới"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 font-semibold placeholder:text-gray-600 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                                className="absolute inset-y-0 right-2 my-auto text-sm font-semibold text-gray-700 hover:text-gray-900"
                            >
                                {show.next ? "Ẩn" : "Hiện"}
                            </button>
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                            Tối thiểu 8 ký tự, gồm chữ thường, chữ hoa và số.
                        </p>
                    </div>

                    {/* Nhập lại mật khẩu */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Nhập lại mật khẩu</label>
                        <div className="relative">
                            <input
                                type={show.cf ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu mới"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 font-semibold placeholder:text-gray-600 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => ({ ...s, cf: !s.cf }))}
                                className="absolute inset-y-0 right-2 my-auto text-sm font-semibold text-gray-700 hover:text-gray-900"
                            >
                                {show.cf ? "Ẩn" : "Hiện"}
                            </button>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="rounded-md border border-red-500/50 bg-red-50 px-3 py-2 text-red-700 font-semibold">
                            {errorMsg}
                        </div>
                    )}
                    {okMsg && (
                        <div className="rounded-md border border-green-500/50 bg-green-50 px-3 py-2 text-green-700 font-semibold">
                            {okMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="inline-flex items-center justify-center rounded-md bg-[#1F2A7A] px-5 py-2.5 font-bold text-white disabled:opacity-50 hover:brightness-110 transition"
                    >
                        {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </form>
            </div>
        </div>
    );
}
