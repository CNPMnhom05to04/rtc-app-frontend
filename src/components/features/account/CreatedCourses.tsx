// components/features/account/CreatedCourses.tsx
"use client";

import { useSearchParams } from "next/navigation";
import CourseCard from "@/components/features/course/CourseCard";
import Page from "@/app/(account)/change-password/page";
import PageHeader from "@/components/ui/PageHeader";

const PRIMARY = "#1F2A7A";

type CreatedCourse = {
    id: number | string;
    title: string;
    thumbnail?: string;
    status: "draft" | "published" | "hidden";
    students?: number;
    rating?: number;
    updatedAt?: string;
    price?: number;
};

const STATUS_TEXT: Record<CreatedCourse["status"], string> = {
    draft: "Nháp",
    published: "Phát hành",
    hidden: "Ẩn",
};

export default function CreatedCourses() {
    const searchParams = useSearchParams();
    const demo = searchParams.get("demo");
    //demo
    const mockCourses: CreatedCourse[] = [
        {
            id: 101,
            title: "Next.js 15 & App Router thực chiến",
            thumbnail: "/course-placeholder.png",
            status: "draft",
            students: 0,
            rating: 0,
            updatedAt: "12/10/2025",
            price: 499000,
        },
        {
            id: 102,
            title: "Spring Boot 3 + MySQL + JWT cho LMS",
            thumbnail: "/course-placeholder.png",
            status: "published",
            students: 245,
            rating: 4.8,
            updatedAt: "02/10/2025",
            price: 799000,
        },
        {
            id: 103,
            title: "UI/UX cơ bản cho dev: màu sắc, layout, typography",
            thumbnail: "/course-placeholder.png",
            status: "hidden",
            students: 36,
            rating: 4.6,
            updatedAt: "28/09/2025",
            price: 399000,
        },
    ];

    const created: CreatedCourse[] = demo === "have" ? mockCourses : [];

    return (
        <main>
            <PageHeader title="Khóa học đã tạo" subtitle="Quản lý các khóa học bạn đã tạo"
                collapseTop />
            {/* Danh sách */}
            {created.length === 0 ? (

                <div className="flex items-start gap-6 p-6">

                    <div className="w-48 sm:w-56 md:w-64">

                        <img
                            src="/lost.jpg"
                            alt="Không tìm thấy khóa học"
                            className="w-full h-auto object-contain select-none"
                        />
                    </div>


                    <div className="pt-2">
                        <h2 className="text-sm md:text-base font-extrabold uppercase tracking-wide text-gray-900">
                            KHÔNG TÌM THẤY KHÓA HỌC
                        </h2>
                        <p className="mt-2 text-[13px] leading-5 text-gray-600">
                            Bạn chưa tạo khóa học nào cả.<br />
                            Hãy nhấn nút bên dưới để bắt đầu tạo khóa học mới.
                        </p>

                        <a
                            href="/course/create"
                            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#1F2A7A] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
                        >
                            + Tạo khóa học mới
                        </a>
                    </div>
                </div>
            ) : (
                // ===== CÓ DỮ LIỆU =====
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {created.map((c) => (
                        <CourseCard
                            key={c.id}
                            // map dữ liệu CreatedCourse -> props CourseCard (dùng chung với Purchase)
                            thumbnail={c.thumbnail ?? "/course-placeholder.png"}
                            category={STATUS_TEXT[c.status]} // hiện trạng thái ở vị trí "Design"
                            duration={c.updatedAt ? `Cập nhật ${c.updatedAt}` : `${c.students ?? 0} HV`}
                            title={c.title}
                            description={`${(c.students ?? 0).toLocaleString()} học viên${c.rating != null ? ` · ⭐ ${c.rating.toFixed(1)}/5` : ""
                                }`}
                            instructorName="Bạn"
                            instructorAvatar="https://i.pravatar.cc/40?img=3"
                            salePrice={c.price ? `${c.price.toLocaleString()}đ` : undefined}
                            onClick={() => {
                                // TODO: điều hướng tới trang quản lý/sửa
                                console.log("manage course:", c.id);
                            }}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}
