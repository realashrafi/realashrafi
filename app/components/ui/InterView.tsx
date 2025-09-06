'use client'
import React from 'react';
import {TypeAnimation} from "react-type-animation";

function InterView() {
    return (
        <div
            className={' w-full h-20 !z-10 flex justify-center top-64 lg:top-64 sticky bg-gradient-to-br from-slate-200 to-slate-400 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl '}>
            <TypeAnimation
                sequence={[
                    'ALI ASHRAFI',
                    500,
                    'Creative', // Types 'One'
                    350, // Waits 1s
                    'And Accurate', // Deletes 'One' and types 'Two'
                    700, // Waits 2s
                    'And Energetic',
                    1050,
                    'And Proficient',
                    1400,
                    ' I Am A Web Developer',
                    1750
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{fontSize: '1em', display: 'inline-block'}}
            />
        </div>
    );
}

export default InterView;