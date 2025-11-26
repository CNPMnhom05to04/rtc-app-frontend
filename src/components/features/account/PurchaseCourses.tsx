// components/features/account/PurchaseCourses.tsx
"use client";

import PageHeader from "@/components/ui/PageHeader";
import CourseCard from "@/components/features/course/CourseCard";
import Page from "@/app/(account)/change-password/page";

const PRIMARY = "#1F2A7A";

export default function PurchaseCourses() {

    const courses = [
        {
            id: 1,
            thumbnail: "/course-placeholder.png",
            category: "Design",
            duration: "3 Month",
            title: "React + Next.js từ cơ bản đến nâng cao",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
            instructorName: "Nguyễn A",
            instructorAvatar: "/avatar-lina.jpg",
            price: 100,
            salePrice: 80,
        },
    ];

    return (
        <>

            <PageHeader title="Khóa học đã mua" subtitle="Quản lý các khóa học bạn đã mua"
                collapseTop />

            {courses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <p className="text-gray-700 font-semibold">Bạn chưa mua khóa học nào.</p>
                    <p className="mt-1 text-sm text-gray-600">
                        Khám phá và bắt đầu học ngay hôm nay!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((c) => (
                        <CourseCard
                            key={c.id}
                            // truyền các field rời đúng với props của CourseCard
                            thumbnail={c.thumbnail}
                            category={c.category}
                            duration={c.duration}
                            title={c.title}
                            description={c.description}
                            instructorName={c.instructorName}
                            instructorAvatar={c.instructorAvatar}
                            price={c.price}
                            salePrice={c.salePrice}
                            onClick={() => console.log("open course detail", c.id)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
