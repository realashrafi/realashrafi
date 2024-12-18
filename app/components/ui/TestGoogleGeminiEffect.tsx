    "use client";
import { useScroll, useTransform } from "framer-motion";
import React from "react";
import {GoogleGeminiEffect} from "@/app/components/ui/Google-gemini-effect";
import {BackgroundBeams} from "@/app/components/ui/background-beams";
import {SparklesCore} from "@/app/components/ui/sparkles";
import Image from "next/image";
import gif from "@/public/Animation.gif";

export function GoogleGeminiEffectDemo() {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
    const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
    const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
    const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
    const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
console.log("pathLengthFirst", pathLengthFirst, pathLengthSecond, pathLengthThird);
    return (
        <div
            className="h-[200vh] bg-gradient-to-t from-slate-950 via-slate-950 to-transparent w-full  relative pt-40 overflow-clip"
            ref={ref}
        >

            <GoogleGeminiEffect
                pathLengths={[
                    pathLengthFirst,
                    pathLengthSecond,
                    pathLengthThird,
                    pathLengthFourth,
                    pathLengthFifth,
                ]}
            />
            {/*<div className={' fixed  inset-[40vh] lg:inset-[90vh] flex justify-center items-center scale-50'}>*/}
            {/*    <Image src={gif} alt={''}/>*/}
            {/*</div>*/}
        </div>
    );
}