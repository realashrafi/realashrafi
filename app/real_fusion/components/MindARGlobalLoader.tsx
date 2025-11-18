// app/components/MindARGlobalLoader.tsx
'use client';

import Script from "next/script";
import { useEffect } from "react";

export default function MindARGlobalLoader() {
    useEffect(() => {
        // برای دیباگ — ببین اصلاً اسکریپت لود میشه یا نه
        const timer = setInterval(() => {
            if ((window as any).MINDAR) {
                console.log("MindAR با موفقیت لود شد!");
                clearInterval(timer);
            }
        }, 500);
    }, []);

    return (
        <Script
            id="mindar-script"
            src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js"
            strategy="beforeInteractive"
            onLoad={() => {
                console.log("MindAR اسکریپت با onLoad فراخوانی شد!");
            }}
            onError={(err) => {
                console.error("خطای لود اسکریپت MindAR:", err);
            }}
        />
    );
}