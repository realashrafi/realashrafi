"use client";
import React from "react";
import Image from "next/image";
import {twMerge} from "tailwind-merge";
import {TracingBeam} from "../ui/tracing-beam";
import GlitchButton from "@/app/components/button/GlitchButton";
import {CardBody, CardContainer, CardItem} from "@/app/components/ui/3d-card";

export function TracingBeamDemo() {
    return (
        <TracingBeam className="px-6">
            <div className=" max-w-2xl mx-auto antialiased pt-4 relative">
                {dummyContent.map((item, index) => (
                    <div key={`content-${index}`} className="mb-10">
                        <GlitchButton id={index} data={item.badge}/>
                        <p className={twMerge("text-xl text-slate-200 mb-4")}>
                            {item.title}
                        </p>

                        <div className="text-sm text-slate-200  prose prose-sm dark:prose-invert">
                            {item?.image && (
                                <img
                                    src={item.image}
                                    alt="blog thumbnail"
                                    height="1000"
                                    width="1000"
                                    className="rounded-lg mb-10 object-cover"
                                />
                            )}
                            {item.description}
                        </div>
                    </div>
                ))}
            </div>
        </TracingBeam>
    );
}

const dummyContent = [
    {
        title: "As an accomplished front-end developer,",
        description: (
            <>
                <p>
                    my proficiency extends to React.js and Next.js frameworks, where my focus lies in crafting flawless
                    user experiences and implementing innovative solutions. With a wealth of experience, I am adept at
                    translating design concepts into interactive web applications, ensuring both functionality and
                    aesthetic appeal. My approach emphasizes clean, maintainable code and efficient development
                    practices to deliver high-quality solutions that exceed client expectations. I thrive in
                    collaborative environments, where I contribute my expertise to cross-functional teams, fostering
                    creativity and problem-solving.
                </p>
            </>
        ),
        badge: "Summary",
        image:
            "https://img2.wallspic.com/previews/4/3/9/5/7/175934/175934-abstract_art-illustration-colored-art-colorfulness-x750.jpg",
    },
    {
        title: "My objective is",
        description: (
            <>
                <p>
                    to leverage my expertise in front-end development to contribute meaningfully to cutting-edge
                    projects while continuously expanding my skills and knowledge in the field. I am passionate about
                    staying at the forefront of technological advancements and pushing the boundaries of what is
                    possible in web development. By immersing myself in challenging projects, I aim to refine my
                    abilities and explore new avenues for innovation. I am committed to lifelong learning, actively
                    seeking out opportunities to deepen my understanding of emerging technologies and best practices.
                    Furthermore, I strive to cultivate a growth mindset, embracing challenges as opportunities for
                    growth and remaining adaptable in the face of change. Through dedication and perseverance, I aspire
                    to make meaningful contributions to the ever-evolving landscape of front-end development.
                </p>
            </>
        ),
        badge: "Objective",
        image:
            "https://img2.wallspic.com/previews/4/3/9/5/7/175934/175934-abstract_art-illustration-colored-art-colorfulness-x750.jpg",
    },
];
