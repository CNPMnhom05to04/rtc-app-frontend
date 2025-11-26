// src/app/rtc/page.tsx
import CreateRoomForm from "@/components/features/rtc/CreateRoomForm";

export default function RtcHome() {
    return (
        <div className="min-h-[100svh] w-full bg-white text-black">
            <main className="mx-auto flex min-h-[100svh] w-full max-w-3xl items-center justify-center p-6">
                <CreateRoomForm />
            </main>
        </div>
    );
}
