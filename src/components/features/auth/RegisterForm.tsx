// components/features/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { register as registerApi } from "@/api/auth";

const PRIMARY = "#1F2A7A";
const PRIMARY_HOVER = "#1a246a";

// Quy tắc theo backend
const PASS_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const USER_RULE = /^[a-zA-Z0-9._-]{5,}$/;

export default function RegisterForm({ className = "" }: { className?: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agree, setAgree] = useState(false);

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMsg(null);

        if (!USER_RULE.test(username.trim()))
            return setMsg({ type: "error", text: "Tên đăng nhập ≥ 5 ký tự, chỉ gồm chữ, số, '.', '_' hoặc '-'." });
        if (!/^\S+@\S+\.\S+$/.test(email.trim()))
            return setMsg({ type: "error", text: "Email không hợp lệ." });
        if (!PASS_RULE.test(password))
            return setMsg({ type: "error", text: "Mật khẩu ≥ 8 ký tự và có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số." });
        if (password !== confirm)
            return setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
        if (!agree)
            return setMsg({ type: "error", text: "Bạn cần đồng ý Điều khoản & Chính sách." });

        try {
            setLoading(true);
            await registerApi({ username, email, password });
            setMsg({ type: "success", text: "Tạo tài khoản thành công! Bạn có thể đăng nhập ngay." });
            setPassword(""); setConfirm("");
        } catch (err: any) {
            const text = err?.response?.data?.message || err?.message || "Đăng ký thất bại. Vui lòng thử lại.";
            setMsg({ type: "error", text });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={`mt-8 space-y-5 ${className}`} onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Tên đăng nhập</span>
                <input
                    type="text"
                    placeholder="admin_01"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-full bg-white px-5 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none
                     border-0 ring-1 ring-gray-300 focus:ring-2 focus:ring-[rgba(31,42,122,0.4)]"
                    required
                    autoComplete="username"
                />
            </label>

            {/* Email */}
            <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Email</span>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full bg-white px-5 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none
                     border-0 ring-1 ring-gray-300 focus:ring-2 focus:ring-[rgba(31,42,122,0.4)]"
                    required
                    autoComplete="email"
                />
            </label>

            {/* Password */}
            <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Mật khẩu</span>
                <div className="relative rounded-full bg-white ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-[rgba(31,42,122,0.4)]">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Ít nhất 8 ký tự, có hoa + thường + số"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-full bg-transparent px-5 py-3 pr-16 text-sm text-gray-900 placeholder-gray-400 outline-none border-0"
                        required
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800"
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                </div>
            </label>

            {/* Confirm password */}
            <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Xác nhận mật khẩu</span>
                <div className="relative rounded-full bg-white ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-[rgba(31,42,122,0.4)]">
                    <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full rounded-full bg-transparent px-5 py-3 pr-16 text-sm text-gray-900 placeholder-gray-400 outline-none border-0"
                        required
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-800"
                        aria-label={showConfirm ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                    >
                        {showConfirm ? "Ẩn" : "Hiện"}
                    </button>
                </div>
            </label>

            {/* Terms */}
            <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 text-xs text-gray-700">
                <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    aria-label="Đồng ý điều khoản"
                />
                <p className="leading-snug">
                    Tôi đồng ý với <a href="/terms" className="text-blue-600 hover:underline">Điều khoản</a> và{" "}
                    <a href="/privacy" className="text-blue-600 hover:underline">Chính sách quyền riêng tư</a>.
                </p>
            </div>

            {/* Message */}
            {msg && (
                <div
                    className={`text-sm ${msg.type === "error" ? "text-red-600" : "text-green-600"}`}
                    role={msg.type === "error" ? "alert" : "status"}
                >
                    {msg.text}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(31,42,122,0.25)]"
                style={{ backgroundColor: PRIMARY }}
                onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = PRIMARY_HOVER)}
                onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = PRIMARY)}
            >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
        </form>
    );
}
