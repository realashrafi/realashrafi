'use client'
import {GoogleGeminiEffectDemo} from '@/app/components/ui/TestGoogleGeminiEffect'
import {TracingBeamDemo} from '@/app/components/ui/TestTracingBeam'
import {LampDemo} from '@/app/components/ui/TestLamp'
import VideoScroller from "@/app/components/VideoScroller";
import React from "react";
import {TypeAnimation} from "react-type-animation";
import InterView from "@/app/components/ui/InterView";
import Model3D from "@/app/components/test/Test3d";

const Page = () => {

    return (
        <div>
            <InterView/>
            <Model3D modelPath={'/model/space/scene.gltf'}/>
            {/*<Model3D modelPath={'/model/logo/scene.gltf'}/>*/}
            <VideoScroller videoSrc={'/07.mp4'} fps={120} speed={4}/>
            <GoogleGeminiEffectDemo/>
            <TracingBeamDemo/>
            <LampDemo/>
        </div>
    );
};

export default Page;