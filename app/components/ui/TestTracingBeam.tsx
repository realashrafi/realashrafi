"use client";
import React from "react";
import {twMerge} from "tailwind-merge";
import {TracingBeam} from "../ui/tracing-beam";
import GlitchButton from "@/app/components/button/GlitchButton";
import {TypeAnimation} from "react-type-animation";
import Link from "next/link";
import VideoScroller from "@/app/components/VideoScroller";

export function TracingBeamDemo() {
    // @ts-ignore
    return (
        <TracingBeam className="px-6 ">
            <div className=" max-w-2xl  mx-auto antialiased pt-12 relative">
                <div className={'w-[100%] h-[99vh] pb-12'}>
                    <iframe className={'w-[100%] h-[100%] rounded-2xl '}
                            src="https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%202/resume/Professional%20CV%20Resume%20%281%29.pdf"/>
                </div>
                <div
                    className="w-full pb-6   flex items-center justify-center bg-red-transparent ">
                    <Link href={'/about'}
                          className="group relative w-28 h-12 text-neutral-50 bg-transparent p-2 overflow-hidden rounded-md border-cyan-600 border">
                        <p className="absolute  font-bold text-lg z-10  duration-500"> About Me</p>
                        <div className="">
                            <div
                                className="absolute duration-500 bg-cyan-600 w-4 h-16  bottom-12 group-hover:-bottom-1 delay-500 right-0"></div>
                            <div
                                className="absolute duration-500 bg-cyan-600 w-4 h-16  -bottom-16 group-hover:-bottom-1 right-4"></div>
                            <div
                                className="absolute duration-500 bg-cyan-600 w-4 h-16  bottom-12 group-hover:-bottom-1 delay-500 right-8"></div>
                            <div
                                className="absolute duration-500 bg-cyan-600 w-4 h-16  -bottom-16 group-hover:-bottom-1 right-12"></div>
                            <div
                                className="absolute duration-500 bg-cyan-600 w-4 h-16  bottom-12 group-hover:-bottom-1 delay-500 right-16"></div>
                            <div
                                className="absolute duration-500 bg-cyan-600 w-4 h-16  -bottom-16 group-hover:-bottom-1 right-20"></div>
                            <div
                                className="absolute duration-500 bg-cyan-600 w-4 h-16  bottom-12 group-hover:-bottom-1 delay-500 right-24"></div>
                        </div>
                    </Link>
                </div>
                {/*{dummyContent.map((item, index) => (*/}
                {/*    <div key={`content-${index}`} className="mb-10">*/}
                {/*        <GlitchButton id={index} data={item.badge}/>*/}
                {/*        <p className={twMerge("text-xl text-slate-200 md:max-h-10 max-h-16")}>*/}
                {/*            <TypeAnimation*/}
                {/*                splitter={(str) => str.split(/(?= )/)} // 'Lorem ipsum dolor' -> ['Lorem', ' ipsum', ' dolor']*/}
                {/*                sequence={[*/}
                {/*                    item.title,*/}
                {/*                    3000,*/}
                {/*                ]}*/}
                {/*                speed={{ type: 'keyStrokeDelayInMs', value: 30 }}*/}
                {/*                omitDeletionAnimation={true}*/}
                {/*                style={{ fontSize: '1em', display: 'block', minHeight: '200px' }}*/}
                {/*            />*/}
                {/*        </p>*/}
                {/*        <div className="text-sm text-slate-200  prose prose-sm dark:prose-invert">*/}
                {/*            {item?.image && (*/}
                {/*                <img*/}
                {/*                    src={item.image}*/}
                {/*                    alt="blog thumbnail"*/}
                {/*                    height="1000"*/}
                {/*                    width="1000"*/}
                {/*                    className="rounded-lg mb-10 object-cover"*/}
                {/*                />*/}
                {/*            )}*/}
                {/*            <TypeAnimation*/}
                {/*                splitter={(str) => str.split(/(?= )/)} // 'Lorem ipsum dolor' -> ['Lorem', ' ipsum', ' dolor']*/}
                {/*                sequence={[*/}
                {/*                    //@ts-ignore*/}
                {/*                    item.description,*/}
                {/*                    3000,*/}
                {/*                ]}*/}
                {/*                speed={{ type: 'keyStrokeDelayInMs', value: 30 }}*/}
                {/*                omitDeletionAnimation={true}*/}
                {/*                style={{ fontSize: '1em', display: 'block', minHeight: '200px' }}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*))}*/}
            </div>
        </TracingBeam>
    );
}

const dummyContent = [
    {
        title: "As an accomplished front-end developer,",
        description: "my proficiency extends to React.js and Next.js frameworks, where my focus lies in crafting flawless\n" +
            "                    user experiences and implementing innovative solutions. With a wealth of experience, I am adept at\n" +
            "                    translating design concepts into interactive web applications, ensuring both functionality and\n" +
            "                    aesthetic appeal. My approach emphasizes clean, maintainable code and efficient development\n" +
            "                    practices to deliver high-quality solutions that exceed client expectations. I thrive in\n" +
            "                    collaborative environments, where I contribute my expertise to cross-functional teams, fostering\n" +
            "                    creativity and problem-solving.",
        badge: "Summary",
        image:
            "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/Add%20a%20pop%20of%20color%20to%20your%20life%20%281%29.gif",
    },
    {
        title: "My objective is",
        description: "to leverage my expertise in front-end development to contribute meaningfully to cutting-edge\n" +
            "                    projects while continuously expanding my skills and knowledge in the field. I am passionate about\n" +
            "                    staying at the forefront of technological advancements and pushing the boundaries of what is\n" +
            "                    possible in web development. By immersing myself in challenging projects, I aim to refine my\n" +
            "                    abilities and explore new avenues for innovation. I am committed to lifelong learning, actively\n" +
            "                    seeking out opportunities to deepen my understanding of emerging technologies and best practices.\n" +
            "                    Furthermore, I strive to cultivate a growth mindset, embracing challenges as opportunities for\n" +
            "                    growth and remaining adaptable in the face of change. Through dedication and perseverance, I aspire\n" +
            "                    to make meaningful contributions to the ever-evolving landscape of front-end development.",
        badge: "Objective",
        image:
            "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/175604-hexagon-shape-space-rectangle-flooring-3840x2160.jpg",
    },
];
