"use client";

import { useState } from "react";
import { ParticipantTile, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

type ParticipantStripProps = {
    /** Số người tối đa hiển thị trên thanh (default = 6) */
    maxVisible?: number;
    /** Tiêu đề nhỏ phía trên (nếu muốn) */
    title?: string;
};

export default function ParticipantStrip({
    maxVisible = 6,
    title = "Người tham gia",
}: ParticipantStripProps) {
    // Lấy track camera (có placeholder nếu chưa bật cam)
    const tracks = useTracks(
        [{ source: Track.Source.Camera, withPlaceholder: true }],
        { onlySubscribed: false },
    );

    const trackList = [...tracks];
    const total = trackList.length;

    // Pagination đơn giản: mỗi "trang" = maxVisible người
    const [page, setPage] = useState(0);
    const pageCount = Math.max(1, Math.ceil(total / maxVisible));
    const clampedPage = Math.min(page, pageCount - 1);

    const startIndex = clampedPage * maxVisible;
    const visibleTracks = trackList.slice(startIndex, startIndex + maxVisible);

    const canPrev = clampedPage > 0;
    const canNext = clampedPage < pageCount - 1;

    const goPrev = () => {
        if (canPrev) setPage((p) => p - 1);
    };

    const goNext = () => {
        if (canNext) setPage((p) => p + 1);
    };

    return (
        <div className="flex w-full flex-col gap-2">
            {/* Header nhỏ cho thanh danh sách */}
            <div className="flex items-center justify-between px-1 text-xs text-zinc-300">
                <span>{title}</span>
                {total > 0 && (
                    <span className="text-[11px] text-zinc-500">
                        {startIndex + 1}-{startIndex + visibleTracks.length} / {total}
                    </span>
                )}
            </div>

            {/* Thanh trượt */}
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-2 py-2">
                {/* Nút prev */}
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    ‹
                </button>

                {/* Dải thumbnail */}
                <div className="flex flex-1 justify-center gap-2">
                    {total === 0 ? (
                        <div className="flex h-16 flex-1 items-center justify-center text-xs text-zinc-500">
                            Chưa có người tham gia nào.
                        </div>
                    ) : (
                        visibleTracks.map((trackRef, idx) => (
                            <div
                                key={`${trackRef.participant?.sid ??
                                    trackRef.participant?.identity ??
                                    idx
                                    }-${trackRef.source}`}
                                className="aspect-video w-24 overflow-hidden rounded-lg border border-zinc-700 bg-black"
                            >
                                <ParticipantTile trackRef={trackRef} />
                            </div>
                        ))
                    )}
                </div>

                {/* Nút next */}
                <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    ›
                </button>
            </div>
        </div>
    );
}
