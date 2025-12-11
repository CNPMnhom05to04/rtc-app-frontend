"use client";

import {
    ControlBar,
    ParticipantTile,
    useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import ParticipantStrip from "@/components/features/rtc/ParticipantStrip";

type Props = {
    roomId: string;
    displayName: string;
};

const MAX_PER_ROW = 3;   // tối đa 3 tile / hàng
const MAX_TILES = 12;    // tối đa 12 ô xuất hiện trên màn (kể cả ô +N)

export default function ConferenceLayout({ roomId, displayName }: Props) {
    // Lấy toàn bộ track camera + screen share
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        {
            onlySubscribed: false,
        }
    );

    const trackList = [...tracks];
    const totalParticipants = trackList.length;

    // Giới hạn số ô hiển thị và tính số người dư
    let visibleTracks = trackList;
    let extraCount = 0;

    if (trackList.length > MAX_TILES) {
        // hiển thị tối đa MAX_TILES - 1 người + 1 ô +N
        extraCount = trackList.length - (MAX_TILES - 1);
        visibleTracks = trackList.slice(0, MAX_TILES - 1);
    }

    // Chia thành từng hàng, mỗi hàng tối đa MAX_PER_ROW ô
    const rows: any[][] = [];
    for (let i = 0; i < visibleTracks.length; i += MAX_PER_ROW) {
        rows.push(visibleTracks.slice(i, i + MAX_PER_ROW));
    }

    // Thêm 1 ô đen chứa số người dư (nếu có)
    if (extraCount > 0) {
        const extraTile = { __extra: true, count: extraCount };
        const lastRow = rows[rows.length - 1];

        if (!lastRow || lastRow.length >= MAX_PER_ROW) {
            // hàng cuối đã đầy -> tạo hàng mới chỉ có ô +N
            rows.push([extraTile]);
        } else {
            // còn chỗ thì nhét ô +N vào hàng cuối
            lastRow.push(extraTile);
        }
    }

    const hasMultipleRows = rows.length > 1;
    const singleRowCount = !hasMultipleRows && rows[0] ? rows[0].length : 0;

    return (
        <div className="flex h-full flex-col bg-black text-white">
            {/* Header nhỏ phía trên */}
            <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
                <div className="text-sm">
                    Phòng <span className="font-semibold">{roomId}</span>
                </div>
                <div className="text-xs text-zinc-300">
                    Bạn đang tham gia với tên{" "}
                    <span className="font-semibold">{displayName}</span>
                </div>
            </header>

            {/* KHUNG CỐ ĐỊNH cho video */}
            <main className="flex-1 min-h-0 px-3 py-3">
                <div className="h-full w-full overflow-y-auto rounded-xl bg-zinc-900 p-3">
                    {rows.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                            Chưa có người tham gia nào trong phòng.
                        </div>
                    ) : (
                        <div className="flex h-full flex-col justify-center gap-4">
                            {rows.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="flex justify-center gap-4"
                                >
                                    {row.map((item, idx) => {
                                        const isExtra = (item as any).__extra === true;

                                        // Tính kích cỡ ô:
                                        let sizeClass = "";
                                        if (!hasMultipleRows) {
                                            // Chỉ 1 hàng -> tile lớn hơn
                                            if (singleRowCount === 1) {
                                                sizeClass = "w-full max-w-[960px]";
                                            } else if (singleRowCount === 2) {
                                                sizeClass = "w-1/2 max-w-[720px]";
                                            } else {
                                                // 3 ô trong 1 hàng
                                                sizeClass = "w-1/3 max-w-[640px]";
                                            }
                                        } else {
                                            // Nhiều hàng -> tile nhỏ, đồng đều
                                            sizeClass = "flex-1 max-w-[420px]";
                                        }

                                        if (isExtra) {
                                            const count = (item as any).count as number;
                                            return (
                                                <div
                                                    key={`extra-${rowIndex}-${idx}`}
                                                    className={`${sizeClass} aspect-video overflow-hidden rounded-xl border border-zinc-700 bg-black flex items-center justify-center`}
                                                >
                                                    <span className="text-2xl font-semibold text-zinc-200">
                                                        +{count}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        const trackRef = item;

                                        return (
                                            <div
                                                key={`${trackRef.participant?.sid ??
                                                    trackRef.participant?.identity ??
                                                    idx
                                                    }-${trackRef.source}`}
                                                className={`${sizeClass} aspect-video overflow-hidden rounded-xl border border-zinc-700 bg-black`}
                                            >
                                                <ParticipantTile trackRef={trackRef} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Control bar LiveKit mặc định: mic, cam, share, leave */}
            {/* Thanh danh sách người tham gia nhỏ bên dưới */}
            <div className="mt-2 px-3">
                <ParticipantStrip maxVisible={6} />
            </div>
            <footer className="border-t border-zinc-800 bg-zinc-900/90 px-3 py-2">
                <ControlBar variation="minimal" />
            </footer>
        </div>
    );
}
