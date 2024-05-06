'use client'
import React from 'react';
import {WavyBackground} from "@/app/components/ui/wavy-background";
import {TypeAnimation} from "react-type-animation";
import TabsDemo from "@/app/components/ui/TabsAbout";
import {StickyScrollRevealDemo} from "@/app/about/components/StickyScroll";

const Page = () => {
    return (
        <div>
            <WavyBackground className="w-full  mx-auto ">
                <div
                    className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
                    <TypeAnimation
                        sequence={[
                            'ALI ASHRAFI',
                            500,
                            'Front-end Developer',
                            350,
                            'React.js',
                            700,
                            '&',
                            1050,
                            'Next.js',
                            1400,
                        ]}
                        wrapper="span"
                        cursor={true}
                        repeat={Infinity}
                        style={{fontSize: '1em', display: 'inline-block'}}
                    />
                </div>
                <div
                    className="text-base md:text-lg mt-4  font-normal inter-var  bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center tracking-tight text-transparent ">
                    Experienced front-end developer with a strong command of <span
                    className={'font-bold'}>React.js</span> and <span className={'font-bold'}>Next.js</span> frameworks.
                </div>
            </WavyBackground>
            <TabsDemo/>
            <StickyScrollRevealDemo/>
        </div>
    );
};

export default Page;