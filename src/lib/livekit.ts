// src/lib/livekit.ts
export async function fetchLivekitToken(roomName: string, participantName: string) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const res = await fetch(`${base}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, participantName }),
    });
    if (!res.ok) throw new Error(`Token API error ${res.status}`);
    const data = (await res.json()) as { token: string };
    if (!data?.token) throw new Error("No token in response");
    return data.token;
}


export async function createRoomViaApi(
    roomName: string,
    options?: { maxParticipants?: number; metadata?: string }
) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const res = await fetch(`${base}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, ...options }),
    });
    if (!res.ok) throw new Error(`Create room error ${res.status}`);

    return true;
}
