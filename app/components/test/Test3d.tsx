'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// بارگذاری پلاگین ScrollTo
gsap.registerPlugin(ScrollToPlugin);

const GLTFModel = ({ position, rotationX, rotationY,modelPath }:any) => {
    // @ts-ignore
    const { scene } = useGLTF(modelPath); // مسیر مدل
    if (!scene) return null; // اگر مدل هنوز بارگذاری نشده باشد، هیچ‌چیز نمایش نمی‌دهیم

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // انیمیشن چرخش مدل بر اساس مقادیر rotationX و rotationY
        gsap.to(scene.rotation, {
            x: -rotationY/500,
            y: -rotationX/500,
            duration: 1,
            ease: 'power2.out'
        });
    }, [rotationX, rotationY, scene]);

    return (<>
        <primitive ref={scene} object={scene} position={position} scale={[2, 2, 2]} />
    </>);
};

const Scene = ({ scrollY, mouseY, mouseX ,modelPath}:any) => {
    const { camera } = useThree(); // دسترسی به دوربین
    const ref = useRef(); // ایجاد ref برای مدل

    // انیمیشن چرخش مدل و حرکت دوربین
    useFrame(() => {
        if (ref.current) {
            // چرخش مدل حول محور Y و X بر اساس موقعیت موس
            // @ts-ignore
            ref.current.rotation.y = mouseY * 0.005; // کاهش سرعت چرخش حول محور Y
            // @ts-ignore
            ref.current.rotation.x = mouseX * 0.005; // چرخش حول محور X
        }

        if (camera) {
            camera.position.z =15 - scrollY * 0.01; // زوم بر اساس اسکرول
            camera.lookAt(1, -1, 0); // نگه داشتن فوکوس روی مدل
        }
    });

    return (
        <>
            {/* نورپردازی */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 10]} />
            {/* مدل سه‌بعدی */}
            <GLTFModel position={[0, 0, 1]} rotationX={mouseX} rotationY={mouseY} modelPath={modelPath} />
        </>
    );
};

const Model3D = ({modelPath}:any) => {
    const [scrollY, setScrollY] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [mouseX, setMouseX] = useState(0);

    // گرفتن مقدار اسکرول
    const handleScroll = () => setScrollY(window.scrollY);

    // گرفتن موقعیت موس
    const handleMouseMove = (event:any) => {
        setMouseY(event.clientY); // موقعیت موس در محور Y
        setMouseX(event.clientX); // موقعیت موس در محور X
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove); // اضافه کردن لیسنر موس

        // انیمیشن اولیه مدل
        gsap.fromTo(
            '.model',
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
        );

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove); // حذف لیسنر موس
        };
    }, []);

    return (
        <div style={{ height:'110vh', overflow: 'hidden' }}  className='sticky top-0' > {/* ارتفاع زیاد برای اسکرول */}
            <Canvas>
                <Scene scrollY={scrollY} mouseY={mouseY} mouseX={mouseX} modelPath={modelPath}/>
            </Canvas>
        </div>
    );
};

export default Model3D;
