import {GoogleGeminiEffectDemo} from '@/app/components/ui/TestGoogleGeminiEffect'
import {TracingBeamDemo} from '@/app/components/ui/TestTracingBeam'
import {LampDemo} from '@/app/components/ui/TestLamp'
import VideoScroller from "@/app/components/VideoScroller";
import React from "react";

const Page = () => {
    
    return (
        <div>
            <VideoScroller videoSrc={'/7565822-hd_2048_1080_25fps.mp4'} fps={120}/>
            <GoogleGeminiEffectDemo/>
            <TracingBeamDemo/>
            <LampDemo/>
        </div>
    );
};

export default Page;