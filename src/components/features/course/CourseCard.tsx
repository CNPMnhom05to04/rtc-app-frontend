
type Props = {
    thumbnail: string;
    category: string;
    duration: string;
    title: string;
    description?: string;
    instructorName: string;
    instructorAvatar: string;
    price?: number | string;
    salePrice?: number | string;
    onClick?: () => void;
};

export default function CourseCard({
    thumbnail,
    category,
    duration,
    title,
    description = "",
    instructorName,
    instructorAvatar,
    price,
    salePrice,
    onClick,
}: Props) {
    return (
        <article
            onClick={onClick}
            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
        >
            {/* Thumbnail */}
            <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={thumbnail}
                    alt={title}
                    className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
            </div>

            {/* Meta row */}
            <div className="mt-3 flex items-center gap-3 text-[13px] text-gray-500">
                <div className="inline-flex items-center gap-1.5">
                    <span className="i-lucide-grid w-3.5 h-3.5 inline-block" />
                    <span className="font-medium">{category}</span>
                </div>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <div className="inline-flex items-center gap-1.5">
                    <span className="i-lucide-clock w-3.5 h-3.5 inline-block" />
                    <span className="font-medium">{duration}</span>
                </div>
            </div>

            {/* Title */}
            <h3 className="mt-2 line-clamp-2 text-[18px] font-semibold leading-snug text-gray-900">
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-gray-500">
                    {description}
                </p>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={instructorAvatar}
                        alt={instructorName}
                        className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold text-gray-800">{instructorName}</span>
                </div>

                <div className="flex items-baseline gap-2">
                    {price != null && (
                        <span className="text-sm text-gray-400 line-through">
                            {typeof price === "number" ? `$${price}` : price}
                        </span>
                    )}
                    {salePrice != null && (
                        <span className="text-base font-extrabold text-teal-500">
                            {typeof salePrice === "number" ? `$${salePrice}` : salePrice}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
