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
        link: "https://coworkmakeen.liara.run/",
        source: "https://github.com/realashrafi/Co-Work-Makeen",
        content: (
            <div
                className="h-full w-full bg-center bg-[url(/coworkmakeen.png)] bg-cover ">
            </div>
        ),
    },
    {
        title: "Samexxon Holding",
        description:
            "Contributed to the development of Samexxon Holding website. Utilized\n" +
            "React.js and Next.js for front-end development and integrated MaterialUI components.",
        link: "https://samexxonholding.ir",
        source: "",
        content: (
            <div className="h-full w-full bg-center bg-[url(/samexxonmaya.png)] bg-cover ">
            </div>
        ),
    },
    {
        title: "Personal Portfolio",
        description:
            "Designed and developed a personal portfolio website to\n" +
            "showcase projects and skills. Built with React.js and Next.js, with custom\n" +
            "styling using Sass.",
        link: "https://realashrafi.liara.run/",
        source: "https://github.com/realashrafi/realashrafi",
        content: (
            <div
                className="h-full w-full bg-center bg-[url(/personalportfolio.png)] bg-cover ">
            </div>
        ),
    }
];

export function StickyScrollRevealDemo() {
    return (
        <div className="">
            <div className="h-full w-full flex items-center justify-center  text-neutral-300 text-xl lg:text-4xl font-bold my-8">
                PROJECT REVIEW
            </div>
            <StickyScroll content={content}/>
        </div>
    );
}
