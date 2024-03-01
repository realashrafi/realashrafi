"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";
import {TypeAnimation} from "react-type-animation";

export function LampDemo() {
    return (
        <LampContainer>
            <motion.h1
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
            >
                <TypeAnimation
                    sequence={[
                        'Create captivating websites with a dynamic framework that astonish your customers!', // Types 'One'
                        1000, // Waits 1s
                        'Craft delightful websites with my web design expertise.', // Deletes 'One' and types 'Two'
                        2000, // Waits 2s
                        'Build appealing websites through collaboration with me and using advanced tools.',
                        3000,
                    ]}
                    wrapper="span"
                    cursor={true}
                    repeat={Infinity}
                    style={{ fontSize: '1em', display: 'inline-block' }}
                />
            </motion.h1>
        </LampContainer>
    );
}
