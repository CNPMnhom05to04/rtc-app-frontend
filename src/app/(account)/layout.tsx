"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

const PRIMARY = "#1F2A7A";
const SOFT_BG = "#EEF0FF";
const SOFT_TEXT = "#1F2A7A";

const NAV_INFO = [
    { href: "/change-profile", label: "Thông tin cá nhân" },
    { href: "/change-password", label: "Thay đổi mật khẩu" },
];
const NAV_COURSE = [
    { href: "/created-course", label: "Khoá học đã tạo" },
    { href: "/purchase-course", label: "Khoá học đã mua" },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isActive = (href: string) => pathname?.startsWith(href);

    return (
        <div
            className="
        fixed inset-0 grid overflow-hidden
        grid-rows-[1fr_auto]
        md:grid-cols-[320px_minmax(0,1fr)]  /* rộng hơn */
        xl:grid-cols-[340px_minmax(0,1fr)]
        grid-cols-1
        bg-[#0F1115]
      "
        >
            {/* Sidebar */}
            <aside className="relative hidden md:block border-r border-black/10 bg-white">
                <div className="absolute inset-0 overflow-y-auto">
                    <div className="flex min-h-full flex-col">

                        <div className="px-5 pt-5">
                            <Link
                                href="/"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md"
                                style={{ backgroundColor: PRIMARY }}
                                aria-label="Quay lại"
                                title="Quay lại"
                            >
                                <ArrowLeft size={18} color="white" />
                            </Link>
                        </div>

                        <div className="px-5 py-6 space-y-6">
                            <section>
                                <h3 className="text-[17px] font-semibold text-gray-900">Thông tin</h3>
                                <div className="mt-3 space-y-3">
                                    {NAV_INFO.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={[
                                                "block rounded-xl px-4 py-3 text-sm font-medium transition",
                                                isActive(item.href) ? "text-white" : "text-gray-800",
                                            ].join(" ")}
                                            style={{
                                                backgroundColor: isActive(item.href) ? PRIMARY : SOFT_BG,
                                                color: isActive(item.href) ? "#fff" : SOFT_TEXT,
                                            }}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[17px] font-semibold text-gray-900">Khóa học</h3>
                                <div className="mt-3 space-y-3">
                                    {NAV_COURSE.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={[
                                                "block rounded-xl px-4 py-3 text-sm font-medium transition",
                                                isActive(item.href) ? "text-white" : "text-gray-800",
                                            ].join(" ")}
                                            style={{
                                                backgroundColor: isActive(item.href) ? PRIMARY : SOFT_BG,
                                                color: isActive(item.href) ? "#fff" : SOFT_TEXT,
                                            }}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="flex-1" />

                        <div className="px-5 pb-6">
                            <button
                                type="button"
                                className="w-full rounded-lg py-3 text-sm font-semibold text-white"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="min-h-0 max-h-[100svh] overflow-y-auto overscroll-contain md:-ml-px bg-white">

                <div className="w-full px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="col-span-1 md:col-span-2 border-t border-black/10 bg-white/90 backdrop-blur">
                <div className="mx-auto w-full max-w-5xl px-6 py-3 text-xs sm:text-sm text-gray-600 flex items-center justify-between">
                    <span>© {new Date().getFullYear()} Eduva</span>
                    <nav className="flex gap-4">
                        <Link href="/terms" className="hover:underline">Điều khoản</Link>
                        <Link href="/privacy" className="hover:underline">Quyền riêng tư</Link>
                        <Link href="/support" className="hover:underline">Hỗ trợ</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
