"use client";
import React from "react";

import Image from "next/image";
import {StickyScroll} from "@/app/components/ui/sticky-scroll-reveal";

const content = [

    {
        title: "Cowork Makeen",
        description:
            "Developed a website for Cowork Makeen using React.js and\n" +
            "Next.js. Implemented responsive design with Tailwind CSS.",
        link: "https://makeen.ir/",
        source: "https://github.com/realashrafi/Co-Work-Makeen",
        content: (
            <div
                className="h-full w-full bg-center bg-[url(https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/realashrafi-media/Screenshot%202025-09-06%20101836.png)] bg-cover ">
            </div>
        ),
    },

    {
        title: "ZBOOM",
        description:
            'Designed & Built management\n' +
            'hub,map-driven,e-commerce with\n' +
            'clean, responsive precision with\n' +
            'React.js and Next.js'
        ,
        link: "https://my.zboom.ir",
        source: "",
        content: (
            <div
                className="h-full w-full bg-center bg-[url(https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/realashrafi-media/Screenshot%202025-09-06%20085151.png)] bg-cover ">
            </div>
        ),
    },
    {
        title: "NEXT PEYK",
        description:
            'Sculpted a Next.js site with Framer\n' +
            'Motion’s slick animations and\n' +
            'Tailwind’s sharp elegance in motion.\n',
        link: "https://nextpeyk.ir",
        source: "",
        content: (
            <div
                className="h-full w-full bg-center bg-[url(https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/realashrafi-media/Screenshot%202025-09-06%20085240.png)] bg-cover ">
            </div>
        ),
    },
    {
        title: "Personal Portfolio",
        description:
            "Designed and developed a personal portfolio website to\n" +
            "showcase projects and skills. Built with React.js and Next.js, with custom\n" +
            "styling using Sass.",
        link: "https://realashrafi.ir/",
        source: "https://github.com/realashrafi/realashrafi",
        content: (
            <div
                className="h-full w-full bg-center bg-[url(https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/realashrafi-media/Screenshot%202025-09-06%20101612.png)] bg-cover ">
            </div>
        ),
    },
    {
        title: "ISIRAN",
        description:
            'Engineered a React-powered\n' +
            'ecosystem—blending modular code\n' +
            'with JSON wizardry to conjure\n' +
            'dynamic, fluid interfaces.\n',
        link: "",
        source: "",
        content: (
            <div
                className="h-full w-full bg-center bg-[url(https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/realashrafi-media/Screenshot%202025-09-06%20101952.png)] bg-cover ">
            </div>
        ),
    },
    ,
    {
        title: "Samexxon Holding",
        description:
            "Contributed to the development of Samexxon Holding website. Utilized\n" +
            "React.js and Next.js for front-end development and integrated MaterialUI components.",
        link: "https://samexxonholding.ir",
        source: "",
        content: (
            <div
                className="h-full w-full bg-center bg-[url(https://img2.wallspic.com/previews/8/2/4/6/2/126428/126428-black_cat-silhouette-cat-art-violet-x750.jpg)] bg-cover ">
            </div>
        ),
    },
];

export function StickyScrollRevealDemo() {
    return (
        <div className="mt-3">
            <div
                className="h-full w-full flex items-center justify-center  text-neutral-300 text-xl lg:text-4xl font-bold  my-8">
                {'PROJECT REVIEW'}
            </div>
            <StickyScroll
                //@ts-ignore
                content={content}/>
        </div>
    );
}
