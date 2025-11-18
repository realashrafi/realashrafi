import React from 'react';
import RealFusion from "@/app/real_fusion/components/RealFusion";

function Page() {
    return (
        <div>
            <RealFusion anchorImage={'/techlab.mind'} testMode={true}/>
        </div>
    );
}

export default Page;