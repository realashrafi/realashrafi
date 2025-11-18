'use client'
import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import jsQR from "jsqr";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {motion, AnimatePresence} from "framer-motion";
import {createPortal} from "react-dom";

// فقط این خط اضافه شد
interface BackendContent {
    modelUrl: string;
    videoUrl: string;
    title: string;
    description: string;
    link: string; // ← فقط این اضافه شد
}

interface ARComponentProps {
    anchorImage: string;
    testMode?: boolean;
}

/* ---------------- Real Fusion QR Portal ---------------- */
const QRScanner: React.FC<{ onScanned: (qr?: string) => void; testMode?: boolean }> = ({onScanned, testMode}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        let scanning = true;
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {facingMode: "environment", width: {ideal: 1280}, height: {ideal: 720}},
                    audio: false,
                });
                streamRef.current = stream;
                if (!videoRef.current) return;
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", "true");
                await videoRef.current.play();

                const scan = () => {
                    if (!scanning || !videoRef.current || !canvasRef.current) return;
                    const v = videoRef.current;
                    const c = canvasRef.current;
                    if (v.readyState < v.HAVE_ENOUGH_DATA) {
                        requestAnimationFrame(scan);
                        return;
                    }
                    c.width = v.videoWidth;
                    c.height = v.videoHeight;
                    const ctx = c.getContext("2d")!;
                    ctx.drawImage(v, 0, 0, c.width, c.height);
                    const code = jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
                    if (code) {
                        scanning = false;
                        streamRef.current?.getTracks().forEach(t => t.stop());
                        onScanned(code.data);
                    } else requestAnimationFrame(scan);
                };
                requestAnimationFrame(scan);
            } catch (e) {
                console.error("Camera error:", e);
            }
        })();

        return () => {
            scanning = false;
            streamRef.current?.getTracks().forEach(t => t.stop());
        };
    }, [onScanned]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a2e] via-[#16213e] to-[#0f1b3b] overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#00ccff11_1px,transparent_1px),linear-gradient(to_bottom,#00ccff11_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"/>
            </div>

            <video ref={videoRef} className="hidden"/>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover"/>

            <motion.div
                initial={{scale: 0.85, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                className="absolute inset-4 rounded-3xl border-1 border-[#00ccff] shadow-[0_0_100px_rgba(0,204,255,0.6)] overflow-hidden"
            >
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {/* گرادیان چرخان خیلی نرم */}
                    <motion.div
                        animate={{rotate: 360}}
                        transition={{duration: 30, repeat: Infinity, ease: "linear"}}
                        className="absolute inset-0 opacity-50"
                        style={{
                            background: "conic-gradient(from potassium90deg, #0066ff, #00ccff, #0066ff)",
                            filter: "blur(40px)",
                        }}
                    />

                    {/* پالس مرکزی با شدت بالا */}
                    <motion.div
                        animate={{
                            scale: [1, 1.6, 1],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
                        className="absolute inset-12 rounded-full"
                        style={{
                            background: "radial-gradient(circle, #00ccff 20%, transparent 70%)",
                            boxShadow: "0 0 150px #00ccff, inset 0 0 80px #0066ff",
                        }}
                    />

                    {/* خطوط اسکن عمودی */}
                    <motion.div
                        animate={{backgroundPositionY: ["0%", "100%"]}}
                        transition={{duration: 6, repeat: Infinity, ease: "linear"}}
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: `
                linear-gradient(transparent 40%, #00ccff22 50%, transparent 60%),
                linear-gradient(90deg, transparent 40%, #00ccff22 50%, transparent 60%)
            `,
                            backgroundSize: "100% 300%, 300% 100%",
                        }}
                    />
                </div>
            </motion.div>

            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center">
                <motion.h1
                    initial={{y: 40, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.5}}
                    className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ccff] via-[#0066ff] to-[#00ccff] tracking-wider mb-6"
                >
                    REAL FUSION
                </motion.h1>
                <motion.p
                    animate={{opacity: [0.7, 1, 0.7]}}
                    transition={{duration: 2.5, repeat: Infinity}}
                    className="text-2xl text-[#00ccff] font-bold tracking-widest"
                >
                    SCAN TO ENTER THE FUTURE
                </motion.p>
            </div>

            {testMode && (
                <motion.div
                    initial={{y: -50, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3 px-4"
                >
                    {["default", "helmet", "fox", "cesium", "avocado", "boombox", "lantern", "suzanne"].map((k) => (
                        <motion.button
                            key={k}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.95}}
                            onClick={() => onScanned(k)}
                            className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white font-bold text-sm shadow-2xl"
                        >
                            {k === "default" ? "اردک" : k === "cesium" ? "سزاریوم" : k === "suzanne" ? "سوزان" : k.toUpperCase()}
                        </motion.button>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

/* ---------------- Real Fusion MR Scene — دقیقاً همون کد اصلیت ---------------- */
const MRScene: React.FC<{ content: BackendContent; anchorImage: string }> = ({content, anchorImage}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoElRef = useRef<HTMLVideoElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const [targetFound, setTargetFound] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);

    useEffect(() => {
        // اگه MindAR هنوز لود نشده، صبر کن تا آماده بشه
        if (!(window as any).MINDAR?.IMAGE?.MindARThree) {
            console.log("MindAR در حال لود شدن است... منتظر می‌مونیم");
            const checkInterval = setInterval(() => {
                if ((window as any).MINDAR?.IMAGE?.MindARThree) {
                    clearInterval(checkInterval);
                    console.log("MindAR آماده شد! شروع AR");
                    startAR(); // حالا شروع کن
                }
            }, 150);

            // اگه تا ۱۰ ثانیه لود نشد، خطا بده
            const timeout = setTimeout(() => {
                clearInterval(checkInterval);
                console.error("MindAR در زمان مشخص لود نشد. اینترنت یا CDN رو چک کن.");
            }, 10000);

            return () => {
                clearInterval(checkInterval);
                clearTimeout(timeout);
            };
        } else {
            // اگه از قبل لود شده بود، مستقیم شروع کن
            startAR();
        }

        // تابع اصلی راه‌اندازی AR
        function startAR() {
            const MindARThree = (window as any).MINDAR.IMAGE.MindARThree;
            let mindar: any;
            let playButton: HTMLDivElement | null = null;
            let animationId: number | null = null;

            (async () => {
                try {
                    mindar = new MindARThree({
                        container: containerRef.current!,
                        imageTargetSrc: anchorImage,
                        filterMinCF: 0.001,
                        filterBeta: 0.06,
                        maxTrack: 1,
                        uiLoading: "no",
                        uiScanning: "no",
                        uiError: "yes",
                    });

                    const { renderer, scene, camera } = mindar;

                    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                    renderer.setClearColor(0x000000, 0);
                    scene.add(new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1.8));

                    const anchor = mindar.addAnchor(0);

                    anchor.onTargetFound = () => {
                        setTargetFound(true);
                        videoElRef.current?.play().catch(() => setVideoPlaying(false));
                    };
                    anchor.onTargetLost = () => setTargetFound(false);

                    // ——— مدل سه بعدی ———
                    new GLTFLoader().load(
                        content.modelUrl,
                        (gltf) => {
                            const model = gltf.scene;
                            model.scale.set(0.22, 0.22, 0.22);
                            model.position.set(0, 0.18, 0);
                            model.rotation.set(0, Math.PI, 0);
                            anchor.group.add(model);
                        },
                        undefined,
                        (err) => console.error("خطا در لود مدل:", err)
                    );

                    // ——— ویدیو روی صفحه ———
                    const videoEl = document.createElement("video");
                    videoEl.src = content.videoUrl;
                    videoEl.crossOrigin = "anonymous";
                    videoEl.loop = true;
                    videoEl.muted = true;
                    videoEl.playsInline = true;
                    videoEl.preload = "auto";
                    videoElRef.current = videoEl;

                    const videoTexture = new THREE.VideoTexture(videoEl);
                    videoTexture.colorSpace = THREE.SRGBColorSpace;

                    const videoPlane = new THREE.Mesh(
                        new THREE.PlaneGeometry(1.2, 0.68),
                        new THREE.MeshBasicMaterial({ map: videoTexture })
                    );
                    videoPlane.position.set(0, -0.48, 0);
                    anchor.group.add(videoPlane);

                    // ——— دکمه پلی ———
                    playButton = document.createElement("div");
                    playButton.innerHTML = `
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button class="w-28 h-28 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 pointer-events-auto">
              <svg class="w-16 h-16 text-white drop-shadow-2xl ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7L8 5z"/>
              </svg>
            </button>
          </div>
        `;
                    playButton.style.cssText = `
          position: absolute;
          top: 50%; left: 50%;
          width: 120%; height: 68%;
          transform: translate(-50%, -140%);
          z-index: 20;
          transition: opacity 0.5s;
        `;

                    const btn = playButton.querySelector("button")!;
                    btn.addEventListener("click", () => {
                        videoEl.play();
                        setVideoPlaying(true);
                        playButton!.style.opacity = "0";
                        setTimeout(() => playButton!.style.pointerEvents = "none", 500);
                    });

                    containerRef.current!.appendChild(playButton);

                    // ——— شروع AR ———
                    await mindar.start();

                    // رندر لوپ
                    const render = () => {
                        videoTexture.needsUpdate = true;
                        renderer.render(scene, camera);
                        animationId = requestAnimationFrame(render);
                    };
                    render();

                } catch (err) {
                    console.error("خطا در راه‌اندازی AR:", err);
                }
            })();

            // cleanup
            return () => {
                if (animationId) cancelAnimationFrame(animationId);
                if (playButton) playButton.remove();
                videoElRef.current?.pause();
                mindar?.stop?.();
            };
        }
    }, [content, anchorImage]);

    return (
        <>
            <div
                ref={containerRef}
                className="fixed inset-0"
                style={{touchAction: "none", transform: "translateZ(0)"}}
            />

            {overlayRef.current &&
                createPortal(
                    <motion.div
                        className="w-full h-full flex items-center justify-center"
                        initial={{opacity: 1, scale: 1}}
                        animate={{
                            opacity: videoPlaying || !targetFound ? 0 : 1,
                            scale: videoPlaying || !targetFound ? 0.8 : 1,
                        }}
                        transition={{duration: 0.5, ease: "easeOut"}}
                        style={{pointerEvents: videoPlaying || !targetFound ? "none" : "auto"}}
                    >
                        <motion.button
                            whileHover={{scale: 1.2}}
                            whileTap={{scale: 0.9}}
                            onClick={() => {
                                videoElRef.current?.play();
                                setVideoPlaying(true);
                            }}
                            className="w-28 h-28 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50"
                        >
                            <svg className="w-16 h-16 text-white drop-shadow-2xl ml-2" fill="currentColor"
                                 viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7L8 5z"/>
                            </svg>
                        </motion.button>
                    </motion.div>,
                    overlayRef.current
                )}

            {/* فقط این دکمه تغییر کرد */}
            <motion.div
                animate={{
                    y: targetFound ? 0 : 200,
                    opacity: targetFound ? 1 : 0,
                }}
                initial={{y: 200, opacity: 0}}
                transition={{
                    y: {type: "spring", stiffness: 110, damping: 22},
                    opacity: {duration: 0.8},
                }}
                className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
            >
                <div className="pb-10 px-6">
                    <div className="max-w-md mx-auto">
                        <div
                            className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl p-4 shadow-2xl"
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,102,255,0.08) 100%)",
                                boxShadow: "0 30px 80px rgba(0,0,0,0.9), 0 0 100px rgba(0,204,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                            }}
                        >
                            <h3 className="text-4xl font-black text-white text-center mb-3 tracking-tight">
                                {content.title}
                            </h3>
                            <p className="text-white/85 text-center text-sm leading-relaxed mb-10">
                                {content.description}
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={() => window.open(content.link, "_blank", "noopener,noreferrer")}
                                    className="w-full py-5 bg-gradient-to-r from-[#0066ff] via-[#00ccff] to-[#0066ff] rounded-2xl font-black text-white text-xl shadow-2xl hover:shadow-[#00ccff]/70 transform hover:scale-105 active:scale-95 transition-all duration-200"
                                    style={{backgroundSize: "200% auto", animation: "gradient 4s ease infinite"}}
                                >
                                    شروع تجربه کامل
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-40 bg-gradient-to-t from-[#0a0a2e] to-transparent"/>
            </motion.div>

            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </>
    );
};

/* ---------------- Final Orchestrator — فقط contents آپدیت شد ---------------- */
const RealFusion: React.FC<ARComponentProps> = ({anchorImage, testMode = true}) => {
    const [phase, setPhase] = useState<"qr" | "loading" | "ar">("qr");
    const [content, setContent] = useState<BackendContent | null>(null);

    const contents: Record<string, BackendContent> = {
        default: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/prisma_3d_default_human_model.glb",
            videoUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/Recording%202025-11-10%20155748.mp4",
            title: "خطا",
            description: "پورتال Real Fusion فعال شد",
            link: "https://sortertechlab.studionona.ir/login" // ← عوض کن
        },
        motor: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/low_poly_racing_bike%20%281%29.glb",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            title: "موتور",
            description: "ابعاد 40×30×30 cm",
            link: "https://sortertechlab.studionona.ir/login?username=motor&password=Motor123"
        },
        car: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/cyberpunk_car.glb",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            title: "ماشین",
            description: "80×50×40 cm ابعاد",
            link: "https://sortertechlab.studionona.ir/login?username=car&password=Car123"
        },
        pickup: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/low_poly_car_-_chevrolet_c10_pickup_1963.glb",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            title: "وانت",
            description: "160×110×50 cm ابعاد",
            link: "https://sortertechlab.studionona.ir/login?username=pickup&password=Pickup123"
        },
        truck: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/truck.glb",
            videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
            title: "کامیون",
            description: "420×200×200 cm ابعاد",
            link: "https://sortertechlab.studionona.ir/login?username=truck&password=Truck123"
        },
        plane: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/c17_plane_game-ready.glb",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            title: "هواپیما",
            description: "153×156×163 cm ابعاد",
            link: "https://sortertechlab.studionona.ir/login?username=Airplane&password=Plane123"
        },
        train: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/cd810_motor_train.glb",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            title: "قطار",
            description: "589×235×239 cm ابعاد",
            link: "https://sortertechlab.studionona.ir/login?username=Train&password=Train123"
        },
        ship: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/cargo_ship.glb",
            videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-video.mp4",
            title: "کشتی",
            description: "1200×235×239 cm ابعاد",
            link: "https://sortertechlab.studionona.ir/login?username=Ship&password=Ship123"
        },
        mini_truck: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/truck.glb",
            videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-video.mp4",
            title: "کامیونت",
            description: " 250×150×150 cm ابعاد",
            link: "https://sortertechlab.studionona.ir/login?username=mini-truck&password=MiniTruck123"
        },
        trailer: {
            modelUrl: "https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/local-share/share/truck.glb",
            videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-video.mp4",
            title: "تریلی",
            description: "1360×245×260 cm ابعاد",
            link: "https://sortertechlab.studionona.ir/login?username=trailer&password=Trailer123"
        },
    };

    const handleScanned = async (qr?: string) => {
        setPhase("loading");
        await new Promise(r => setTimeout(r, 1800));

        const qrKey = qr?.trim().toLowerCase();
        const key = qrKey && qrKey in contents ? qrKey : "default";

        setContent(contents[key]);
        setPhase("ar");
    };

    return (
        <div className="fixed inset-0 bg-[#0a0a2e] overflow-hidden">
            <AnimatePresence mode="wait">
                {phase === "qr" && <QRScanner onScanned={handleScanned} testMode={testMode}/>}
                {phase === "loading" && (
                    <motion.div key="loading"
                                className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a2e] to-[#16213e]"
                                exit={{opacity: 0}}>
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-96 h-96 border-4 rounded-full border-[#00ccff]/40"
                                initial={{scale: 0, opacity: 1}}
                                animate={{scale: 4, opacity: 0}}
                                transition={{duration: 2.5, delay: i * 0.25, repeat: Infinity}}
                                style={{boxShadow: "0 0 120px #00ccff"}}
                            />
                        ))}
                        <div className="z-10 text-center">
                            <motion.h1
                                initial={{scale: 0.8}}
                                animate={{scale: 1}}
                                transition={{yoyo: Infinity, duration: 2}}
                                className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ccff] to-[#0066ff] mb-6"
                            >
                                REAL FUSION
                            </motion.h1>
                            <p className="text-2xl text-white/90 font-light tracking-widest">connecting...</p>
                        </div>
                    </motion.div>
                )}
                {phase === "ar" && content && <MRScene content={content} anchorImage={anchorImage}/>}
            </AnimatePresence>
        </div>
    );
};

export default RealFusion;