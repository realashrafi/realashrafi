import React from 'react';
import {GoogleGeminiEffectDemo} from '@/app/components/ui/TestGoogleGeminiEffect'
import {TracingBeamDemo} from '@/app/components/ui/TestTracingBeam'
import {LampDemo} from '@/app/components/ui/TestLamp'

const Page = () => {
    return (
        <div>
            <GoogleGeminiEffectDemo/>
            <TracingBeamDemo/>
            <LampDemo/>
        </div>
    );
};

export default Page;