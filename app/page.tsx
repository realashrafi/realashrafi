import React from 'react';
import {GoogleGeminiEffectDemo} from '@/app/components/ui/TestGoogleGeminiEffect'
import {TracingBeamDemo} from '@/app/components/ui/TestTracingBeam'
import {LampDemo} from '@/app/components/ui/TestLamp'
import {BackgroundBoxesDemo} from '@/app/components/ui/TestBackgroundBoxes'

const Page = () => {
    return (
        <div>
            <GoogleGeminiEffectDemo/>
            <LampDemo/>
            <TracingBeamDemo/>
            <BackgroundBoxesDemo/>
        </div>
    );
};

export default Page;