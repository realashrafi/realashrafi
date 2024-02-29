"use client";
import React from "react";
import {Boxes} from "../ui/background-boxes";
import {cn} from "../../utils/cn";
import {FollowerPointerCard} from '@/app/components/ui/following-pointer'

export function BackgroundBoxesDemo() {
    return (
        <div className="h-96 cursor-none relative w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center ">
            {/*<FollowerPointerCard title={*/}
            {/*    <TitleComponent*/}
            {/*        title={blogContent.author}*/}
            {/*        avatar={blogContent.authorAvatar}*/}
            {/*    />*/}
            {/*}>*/}
                {/*<div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />*/}

                <Boxes/>
                <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
                    Tailwind is Awesome
                </h1>
                <p className="text-center mt-2 text-neutral-300 relative z-20">
                    Framer motion is the best animation library ngl
                </p>
            {/*</FollowerPointerCard>*/}
        </div>
    );
}

const blogContent = {
    slug: "amazing-tailwindcss-grid-layouts",
    author: "Manu Arora",
    date: "28th March, 2023",
    title: "Amazing Tailwindcss Grid Layout Examples",
    description:
        "Grids are cool, but Tailwindcss grids are cooler. In this article, we will learn how to create amazing Grid layouts with Tailwindcs grid and React.",
    image: "/demo/thumbnail.png",
    authorAvatar: "/manu.png",
};

const TitleComponent = ({
                            title,
                            avatar,
                        }: {
    title: string;
    avatar: string;
}) => (
    <div className="flex space-x-2 items-center">

        <p>{title}</p>
    </div>
);