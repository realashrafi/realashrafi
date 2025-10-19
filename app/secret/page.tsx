'use client'
import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useMemo } from 'react';

// لینک‌های مدل‌های GLTF
const models = {
    step1: 'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/models/couple_sitting_on_a_bench_under_a_street_lamp.glb',
    step2: 'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/models/love_never_dies.glb',
    step3: 'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/models/human_heart_3d_model__anatomy__medical_project.glb',
    step4: 'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/models/heart.glb'
};

// لینک فایل صوتی (جایگزین با لینک واقعی فایل صوتی)
const audioSrc = 'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/Heydoo-Hedayati-Ghatare-Khaali-320.mp3';

// لیست پیام‌های اصراری برای "نه"
const noMessages: string[] = [
    "نمی‌تونی نه بگی، چون خاطراتمون هنوز زنده‌ست!",
    "یه لحظه فکر کن، قلبم منتظرته!",
    "نه گفتن فایده نداره، بله بزن!",
    "من هنوز امیدوارم، یه شانس دیگه بده!",
    "بله یعنی شروع دوباره، امتحان کن!",
    "فکر کردی به اون همه لحظه‌های قشنگ باهم؟",
    "قلبم بدون تو نمی‌تپه، بله رو انتخاب کن!",
    "یه بار دیگه به من نگاه کن، نه نگو!",
    "ما برای هم ساخته شدیم، بله بزن!",
    "خاطراتمون ارزش یه شانس دیگه رو داره!",
    "نمی‌ذارم به این راحتی نه بگی، دوباره فکر کن!",
    "با بله گفتن، می‌تونیم آینده رو قشنگ‌تر کنیم!"
];

// کامپوننت پارتیکل‌ها
const Particles = () => {
    const ref = useRef<THREE.Points>(null);
    const particleCount = 500;

    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.05;
            ref.current.rotation.x += delta * 0.03;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={true}>
            <PointMaterial
                transparent
                color="#F67242"
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    );
};

// اینترفیس برای props HOC
interface PersistentProps {
    onYes: () => void;
    onNo: () => void;
    message: string;
}

// HOC برای اصرار بر "بله"
const withPersistentYes = (WrappedComponent: React.FC<PersistentProps>) => {
    return function PersistentYes(props: Omit<PersistentProps, 'onYes' | 'onNo' | 'message'>) {
        const [noCount, setNoCount] = useState<number>(0);
        const [message, setMessage] = useState<string>('');

        const handleNo = () => {
            const index = noCount % noMessages.length;
            setMessage(noMessages[index]);
            setNoCount(noCount + 1);
        };

        const handleYes = () => {
            alert('عالیه! حالا بیا حرف بزنیم و آینده رو بسازیم! 😍');
            window.location.href = 'tel:+989201001450';
        };

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                <WrappedComponent onYes={handleYes} onNo={handleNo} message={message} />
            </motion.div>
        );
    };
};

// کامپوننت برای لود مدل GLTF
const Model: React.FC<{ url: string; scale?: number; position?: [number, number, number]; rotation?: [number, number, number] }> = ({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={scale} position={position} rotation={rotation} />;
};

// کامپوننت سوال نهایی
const FinalQuestion: React.FC<PersistentProps> = ({ onYes, onNo, message }) => (
    <div className="relative flex flex-col items-center justify-center min-h-screen h-screen p-4 touch-none max-w-screen-sm mx-auto">
        <Suspense fallback={<div className="absolute text-lg sm:text-xl z-10">در حال لود قلب... 💖</div>}>
            <Canvas
                className="absolute top-0 left-0 w-full h-screen"
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={3} />
                <directionalLight position={[5, 5, 0]} intensity={10} />
                <pointLight position={[-3, 3, 3]} intensity={10} />
                <spotLight position={[0, 5, 5]} angle={10} penumbra={1} intensity={1} castShadow />
                <Particles />
                <Model url={models.step4} scale={0.1} rotation={[0, -0.8, 0]} position={[0, -0.2, 0]} />
                <OrbitControls enableZoom={false} enablePan={false} />
                <Preload all />
            </Canvas>
        </Suspense>
        <div className="relative z-10 -translate-y-40 flex flex-col items-center justify-center w-full">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-center my-4 text-white drop-shadow-lg">آیا می‌خوای باهم آینده رو بسازیم؟</h1>
            <AnimatePresence>
                {message && (
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="text-lg sm:text-xl text-yellow-200 mb-4 font-semibold px-4"
                    >
                        {message}
                    </motion.p>
                )}
            </AnimatePresence>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-md">
                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0,255,0,0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } }}
                    onClick={onYes}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg sm:text-xl font-bold shadow-lg"
                >
                    بله
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,0,0,0.6)' }}
                    whileTap={{ scale: 0.95, rotate: [0, -5, 5, -5, 5, 0] }}
                    onClick={onNo}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg sm:text-xl font-bold shadow-lg"
                >
                    نه
                </motion.button>
            </div>
        </div>
    </div>
);

// Wrap کردن با HOC
const PersistentFinalQuestion = withPersistentYes(FinalQuestion);

// کامپوننت اصلی با گام‌ها و پخش صوت
const Page: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const audioRef = useRef<HTMLAudioElement>(null);

    // پخش خودکار صوت به محض رندر شدن کامپوننت
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error('خطا در پخش خودکار صوت:', error);
                // می‌تونی اینجا یه پیام یا دکمه برای پخش دستی اضافه کنی
            });
        }
    }, []);

    const nextStep = () => setStep(step + 1);

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative flex flex-col items-center justify-center min-h-screen h-screen p-4 touch-none max-w-screen-sm mx-auto"
                    >
                        <Suspense fallback={<div className="absolute text-lg sm:text-xl z-10">در حال لود خاطره... 🌳</div>}>
                            <Canvas
                                className="absolute top-0 left-0 w-full h-screen"
                                camera={{ position: [0, 0, 5], fov: 45 }}
                                gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
                                dpr={[1, 1.5]}
                            >
                                <ambientLight intensity={0.6} />
                                <directionalLight position={[5, 5, 5]} intensity={2} />
                                <pointLight position={[-3, 3, 3]} intensity={0.8} />
                                <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
                                <Particles />
                                <Model url={models.step1} scale={0.01} rotation={[0, -1, 0]} position={[0, -0.5, 0]} />
                                <OrbitControls enableZoom={false} enablePan={false} />
                                <Preload all />
                            </Canvas>
                        </Suspense>
                        <div className="relative z-10 -translate-y-20 flex flex-col items-center justify-center w-full">
                            <h2 className="text-2xl sm:text-4xl font-bold text-center my-4 text-white drop-shadow-lg">یادت می‌آد اون شب چشمام چشماتو دید؟</h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } }}
                                onClick={nextStep}
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-lg sm:text-xl font-semibold shadow-lg"
                            >
                                بله، ادامه بدیم
                            </motion.button>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative flex flex-col items-center justify-center min-h-screen p-4 touch-none max-w-screen-sm mx-auto"
                    >
                        <Suspense fallback={<div className="absolute text-lg sm:text-xl z-10">در حال لود عشق... 💞</div>}>
                            <Canvas
                                className="absolute top-0 left-0 w-full h-screen"
                                camera={{ position: [0, 0, 5], fov: 45 }}
                                gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
                                dpr={[1, 1.5]}
                            >
                                <ambientLight intensity={2} />
                                <directionalLight position={[5, 5, 5]} intensity={2} />
                                <pointLight position={[-3, 3, 3]} intensity={0.8} />
                                <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
                                <Particles />
                                <Model url={models.step2} scale={0.35} rotation={[0.5, 6, 0]} position={[0, -0.5, 0]} />
                                <OrbitControls enableZoom={false} enablePan={false} />
                                <Preload all />
                            </Canvas>
                        </Suspense>
                        <div className="relative z-10 flex -translate-y-80 flex-col items-center justify-center w-full">
                            <h2 className="text-2xl sm:text-4xl font-bold text-center my-4 text-white drop-shadow-lg">عشقمون هیچ‌وقت نمی‌میره...</h2>
                            <ul className="list-disc text-lg sm:text-xl mb-4 space-y-2 text-white px-4">
                                <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.5 } }}>جرقه ای که سنگ و شیشه کرد تا نورشو ببینم</motion.li>
                                <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 1 } }}>همه چیزایی که درونت بود ارزوهای من بودن و تو داشتیشون</motion.li>
                                <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 1.5 } }}>حتی سختی‌ها با تو قشنگ بود</motion.li>
                                <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 2 } }}>باهام صحبت که میکنی اصلا مهم نیست زمان رو ثانیه چند توقف کرده</motion.li>
                                <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 2.5 } }}>فقط دلم میخواد گوش کنم نگات کنم سیر نمیشم ازت</motion.li>
                            </ul>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } }}
                                onClick={nextStep}
                                className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full text-lg sm:text-xl font-semibold shadow-lg"
                            >
                                بله، حق داری
                            </motion.button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ y: '-100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative flex flex-col items-center justify-center min-h-screen p-4 touch-none max-w-screen-sm mx-auto"
                    >
                        <Suspense fallback={<div className="absolute text-lg sm:text-xl z-10">در حال لود آینده... 🌟</div>}>
                            <Canvas
                                className="absolute top-0 left-0 w-full h-screen"
                                camera={{ position: [0, 0, 5], fov: 45 }}
                                gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
                                dpr={[1, 1.5]}
                            >
                                <ambientLight intensity={3} />
                                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                                <pointLight position={[-3, 3, 3]} intensity={0.8} />
                                <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
                                <Particles />
                                <Model url={models.step3} scale={0.25} position={[-1.13, -0.7, 0]} rotation={[0, Math.PI / 4, 0]} />
                                <OrbitControls enableZoom={false} enablePan={false} />
                                <Preload all />
                            </Canvas>
                        </Suspense>
                        <div className="relative z-10 flex flex-col -translate-y-40 items-center justify-center w-full">
                            <h2 className="text-2xl sm:text-4xl font-bold text-center my-4 text-white drop-shadow-lg">قلبمون برای آینده می‌تپه...</h2>
                            <p className="text-lg sm:text-xl text-center mb-4 text-white max-w-lg px-4">تصور کن سفرهای جدید، خنده‌های بیشتر و یه آینده رویایی باهم!</p>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } }}
                                onClick={nextStep}
                                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-lg sm:text-xl font-semibold shadow-lg"
                            >
                                بله، می‌خوام ببینم
                            </motion.button>
                        </div>
                    </motion.div>
                );
            case 4:
                return <PersistentFinalQuestion />;
            default:
                return <div className="text-center text-2xl sm:text-3xl p-4 text-white">پایان! حالا بیا حرف بزنیم! 😍</div>;
        }
    };

    return (
        <div className="overflow-hidden" dir={'rtl'}>
            {/* اضافه کردن تگ audio برای پخش خودکار */}
            <audio
                ref={audioRef}
                src={audioSrc}
                autoPlay
                loop // اختیاری: برای تکرار صوت
                muted={false} // اگر true باشه، شانس پخش خودکار بیشتره
            />
            {renderStep()}
        </div>
    );
};

export default Page;