// src/api/detection.ts

export const DETECTION_WS_URL =
    process.env.NEXT_PUBLIC_DETECTION_WS_URL ?? "ws://localhost:8000/ws/detection";

export type DetectionResult = {
    detections?: any[];
    facemesh?: any;
    logic?: {
        cheating: boolean;
        reason?: string;
    };
    [key: string]: any;
};

export type DetectionSocketOptions = {
    onOpen?: () => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onMessage?: (data: DetectionResult) => void;
};


export function createDetectionSocket(
    options: DetectionSocketOptions = {},
): WebSocket {
    const ws = new WebSocket(DETECTION_WS_URL);

    ws.onopen = () => {
        console.log("[detection] socket opened");
        options.onOpen?.();
    };

    ws.onerror = (event) => {
        console.error("[detection] socket error", event);
        options.onError?.(event);
    };

    ws.onclose = (event) => {
        console.log("[detection] socket closed", event);
        options.onClose?.(event);
    };

    ws.onmessage = (evt) => {
        try {
            const data = JSON.parse(evt.data) as DetectionResult;
            console.log("[detection] message", data);
            options.onMessage?.(data);
        } catch (err) {
            console.error("[detection] parse error", err, evt.data);
        }
    };

    return ws;
}


export function sendDetectionFrame(ws: WebSocket, base64Image: string) {
    if (ws.readyState !== WebSocket.OPEN) {
        console.warn("[detection] socket not open, skip send");
        return;
    }

    ws.send(
        JSON.stringify({
            image: base64Image,
        }),
    );
}
