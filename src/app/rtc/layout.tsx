// src/app/rtc/layout.tsx
"use client";

import Image from "next/image";
import type { ReactNode } from "react";

const pageBg = "#0F1115";

export default function RtcLayout({ children }: { children: ReactNode }) {
    return (
        <div
            className="fixed inset-0 grid overflow-hidden grid-cols-1 lg:grid-cols-2"
            style={{ backgroundColor: pageBg }}
        >

            <section className="relative hidden md:block">
                <Image
                    src="/login-bg.png"
                    alt="Eduva"
                    fill
                    className="object-cover z-0"
                    priority
                />
                <div className="absolute inset-0 bg-[#2F327D] opacity-30 z-10" />
            </section>


            <section className="w-full md:w-full p-8 bg-white relative z-20 overflow-y-auto overscroll-contain">
                <div className="max-w-md mx-auto">{children}</div>
            </section>
        </div>
    );
}
