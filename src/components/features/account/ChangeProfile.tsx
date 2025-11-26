// components/features/account/ChangeProfile.tsx
"use client";

import { useRef, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";

const PRIMARY = "#1F2A7A";

export default function ChangeProfile() {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [facebook, setFacebook] = useState("");
    const [youtube, setYoutube] = useState("");
    const [instagram, setInstagram] = useState("");
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const bioRef = useRef<HTMLTextAreaElement | null>(null);

    function openPicker() {
        fileInputRef.current?.click();
    }
    function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setAvatarUrl(url);
    }


    function surroundBio(tagOpen: string, tagClose = tagOpen) {
        const el = bioRef.current;
        if (!el) return;
        const start = el.selectionStart ?? 0;
        const end = el.selectionEnd ?? 0;
        const before = bio.slice(0, start);
        const selected = bio.slice(start, end);
        const after = bio.slice(end);
        const next = before + tagOpen + selected + tagClose + after;
        setBio(next);
        requestAnimationFrame(() => {
            const pos = start + tagOpen.length + selected.length + tagClose.length;
            el.selectionStart = el.selectionEnd = pos;
            el.focus();
        });
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            // TODO: gọi API cập nhật hồ sơ
            await new Promise((r) => setTimeout(r, 600));
            alert("Đã lưu thay đổi (mock).");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">

            <PageHeader
                title="Chỉnh sửa hồ sơ"
                subtitle="Cập nhật thông tin cá nhân của bạn"
                collapseTop
            />

            <section className="space-y-6">
                <div className="grid grid-cols-1 gap-6 items-start sm:grid-cols-[160px_1fr_220px]">

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-900">
                            Thay đổi ảnh đại diện
                        </label>
                        <div
                            className="h-[140px] w-[140px] rounded-xl border border-gray-300 bg-white flex items-center justify-center cursor-pointer select-none hover:border-gray-400 transition"
                            onClick={openPicker}
                            title="Chọn ảnh"
                        >
                            {avatarUrl ? (

                                <img
                                    src={avatarUrl}
                                    alt="avatar preview"
                                    className="h-full w-full rounded-xl object-cover"
                                />
                            ) : (
                                <div className="text-gray-500 text-sm text-center leading-tight">
                                    <span className="block text-2xl mb-1">⬆️</span>
                                    Tải ảnh
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onPickAvatar}
                        />
                    </div>

                    {/* Tên đại diện */}
                    <div className="sm:col-span-1">
                        <label className="block mb-2 text-sm font-semibold text-gray-900">
                            Tên đại diện
                        </label>
                        <input
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Nhập tên đại diện"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                        />
                    </div>

                    {/* Ngày sinh */}
                    <div className="sm:col-span-1">
                        <label className="block mb-2 text-sm font-semibold text-gray-900">
                            Ngày sinh
                        </label>
                        <input
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder="dd/mm/yyyy"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                        />
                    </div>
                </div>

                {/* Gmail */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                        Gmail
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập địa chỉ gmail"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                    />
                </div>

                {/* Mô tả + toolbar */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                        Mô tả
                    </label>

                    <div className="flex items-center gap-2 mb-2">
                        <button
                            type="button"
                            onClick={() => surroundBio("**")}
                            className="rounded-md border border-gray-300 px-2 py-1 text-sm font-bold hover:bg-gray-50"
                            title="Đậm"
                        >
                            B
                        </button>
                        <button
                            type="button"
                            onClick={() => surroundBio("_")}
                            className="rounded-md border border-gray-300 px-2 py-1 text-sm italic hover:bg-gray-50"
                            title="Nghiêng"
                        >
                            I
                        </button>
                        <button
                            type="button"
                            onClick={() => surroundBio("- ", "")}
                            className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
                            title="Danh sách"
                        >
                            ≡
                        </button>
                    </div>

                    <textarea
                        ref={bioRef}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Thông tin công khai cho giảng viên"
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                    />
                </div>

                {/* Socials */}
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-900">
                            Facebook
                        </label>
                        <input
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            placeholder="https://www.facebook.com"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-900">
                            Youtube
                        </label>
                        <input
                            value={youtube}
                            onChange={(e) => setYoutube(e.target.value)}
                            placeholder="https://www.youtube.com"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-900">
                            Instagram
                        </label>
                        <input
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            placeholder="https://www.instagram.com"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#1F2A7A] focus:ring-2 focus:ring-[#1F2A7A]/20"
                        />
                    </div>
                </div>
            </section>

            {/* Nút lưu */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg px-6 py-3 text-sm font-bold text-white disabled:opacity-60 hover:brightness-110 transition"
                    style={{ backgroundColor: PRIMARY }}
                >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </form>
    );
}
