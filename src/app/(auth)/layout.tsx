"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const pageBg = "#0F1115";

export default function AuthLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isRegister = pathname?.includes("/register");
    const leftVisibility = isRegister ? "hidden lg:block" : "hidden md:block";

    return (
        <div
            className={`fixed inset-0 grid overflow-hidden grid-cols-1 lg:grid-cols-2`}
            style={{ backgroundColor: pageBg }}
        >

            <section className={`relative ${leftVisibility}`}>
                {isRegister ? (
                    <>

                        <img
                            src="/login-bg.jpg"
                            alt="Eduva"
                            className="absolute inset-0 h-full w-full object-cover opacity-80 pointer-events-none z-0"
                        />
                    </>
                ) : (
                    <>

                        <Image
                            src="/login-bg.png"
                            alt="Eduva"
                            fill
                            className="object-cover z-0"
                            priority
                        />
                        <div className="absolute inset-0 bg-[#2F327D] opacity-30 z-10" />
                    </>
                )}
            </section>


            {isRegister ? (

                <section className="min-h-0 max-h-[100svh] overflow-y-auto overscroll-contain lg:-ml-px">
                    {children}
                </section>
            ) : (

                <section className="w-full md:w-full p-8 bg-white relative z-20 overflow-y-auto overscroll-contain">
                    <div className="max-w-md mx-auto">{children}</div>
                </section>
            )}
        </div>
    );
}
