'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as mpHands from '@mediapipe/hands';
import * as mpFaceDetection from '@mediapipe/face_detection';
import * as drawingUtils from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import { BackgroundLines } from '@/app/components/ui/background-lines';

interface GameObject {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
}

interface FacePosition {
    x: number;
    y: number;
}

const DefendYourFace: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cameraRef = useRef<Camera | null>(null);
    const [score, setScore] = useState<number>(0);
    const [level, setLevel] = useState<number>(1);
    const [lives, setLives] = useState<number>(3);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [webcamError, setWebcamError] = useState<string | null>(null);
    const objectsRef = useRef<GameObject[]>([]);
    const nosePosRef = useRef<FacePosition>({ x: 320, y: 240 });

    // تنظیم اندازه canvas
    const updateCanvasSize = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const maxWidth = window.innerWidth * 0.9;
            const aspectRatio = 4 / 3;
            canvas.width = Math.min(maxWidth, 640);
            canvas.height = canvas.width / aspectRatio;
        }
    };

    // تعریف ژست آتش با انگشت اشاره
    const getGesture = (landmarks: mpHands.NormalizedLandmarkList): string | null => {
        const fingerTips = [8, 12, 16, 20]; // اشاره، وسط، انگشتری، کوچک
        const fingerBases = [6, 10, 14, 18];
        let openFingers = 0;

        // چک کردن انگشت اشاره (باز) و بقیه انگشت‌ها (بسته)
        const isIndexOpen = landmarks[8].y < landmarks[6].y; // انگشت اشاره باز
        const isMiddleClosed = landmarks[12].y >= landmarks[10].y; // انگشت وسط بسته
        const isRingClosed = landmarks[16].y >= landmarks[14].y; // انگشت انگشتری بسته
        const isPinkyClosed = landmarks[20].y >= landmarks[18].y; // انگشت کوچک بسته

        const thumbTip = landmarks[4];
        const thumbBase = landmarks[2];
        const isThumbOpen = thumbTip.x > thumbBase.x;

        if (isIndexOpen && isMiddleClosed && isRingClosed && isPinkyClosed && isThumbOpen) {
            return 'fire';
        }
        return null;
    };

    // تولید شیء تصادفی
    const spawnObject = (): GameObject => {
        const canvas = canvasRef.current!;
        const edges = ['top', 'bottom', 'left', 'right'];
        const edge = edges[Math.floor(Math.random() * 4)];
        let x: number, y: number, dx: number, dy: number;

        if (edge === 'top') {
            x = Math.random() * canvas.width;
            y = 0;
        } else if (edge === 'bottom') {
            x = Math.random() * canvas.width;
            y = canvas.height;
        } else if (edge === 'left') {
            x = 0;
            y = Math.random() * canvas.height;
        } else {
            x = canvas.width;
            y = Math.random() * canvas.height;
        }

        const angle = Math.atan2(nosePosRef.current.y - y, nosePosRef.current.x - x);
        const speed = 1 + level * 0.02;
        dx = Math.cos(angle) * speed;
        dy = Math.sin(angle) * speed;

        return { x, y, dx, dy, radius: 10 };
    };

    // به‌روزرسانی بازی
    const updateGame = () => {
        if (!gameStarted) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        // فلیپ کردن canvas
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(webcamRef.current?.video!, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // رسم نقطه سبز روی دماغ
        ctx.beginPath();
        ctx.arc(nosePosRef.current.x, nosePosRef.current.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'lime';
        ctx.fill();

        // رسم اجسام
        objectsRef.current.forEach((obj, index) => {
            obj.x += obj.dx;
            obj.y += obj.dy;

            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.fill();

            // چک کردن برخورد با دماغ
            const distToNose = Math.hypot(obj.x - nosePosRef.current.x, obj.y - nosePosRef.current.y);
            if (distToNose < 20) {
                objectsRef.current.splice(index, 1);
                setLives((prev) => {
                    const newLives = Math.max(0, prev - 1);
                    if (newLives === 0) {
                        alert(`بازی تموم شد! امتیاز: ${score}`);
                        setScore(0);
                        setLevel(1);
                        setLives(3);
                        setGameStarted(false);
                        objectsRef.current = [];
                    }
                    return newLives;
                });
            }
        });

        // تولید شیء جدید
        if (Math.random() < 0.02) {
            objectsRef.current.push(spawnObject());
        }

        requestAnimationFrame(updateGame);
    };

    // شروع بازی
    const startGame = () => {
        if (webcamError) {
            alert('وب‌کم در دسترس نیست. لطفاً دسترسی‌ها را بررسی کنید.');
            return;
        }
        setGameStarted(true);
        setScore(0);
        setLevel(1);
        setLives(3);
        objectsRef.current = [];
    };

    // مدیریت خطای وب‌کم
    const handleWebcamError = (error: string | DOMException) => {
        setWebcamError(error.toString());
        console.error('Webcam error:', error);
    };

    useEffect(() => {
        // تنظیم اندازه canvas
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        const hands = new mpHands.Hands({
            locateFile: (file: string) => {
                console.log('Loading MediaPipe Hands file:', file);
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.8, // افزایش برای کاهش لرزش
        });

        const faceDetection = new mpFaceDetection.FaceDetection({
            locateFile: (file: string) => {
                console.log('Loading MediaPipe Face Detection file:', file);
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
            },
        });

        faceDetection.setOptions({
            minDetectionConfidence: 0.7,
        });

        hands.onResults((results: mpHands.Results) => {
            if (!gameStarted) return;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx || !canvas) return;

            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);

            if (results.multiHandLandmarks?.length) {
                results.multiHandLandmarks.forEach((landmarks) => {
                    drawingUtils.drawConnectors(ctx, landmarks, mpHands.HAND_CONNECTIONS, {
                        color: '#00FF00',
                        lineWidth: 2, // خطوط نازک‌تر برای رندر روان
                    });
                    drawingUtils.drawLandmarks(ctx, landmarks, {
                        color: '#FF0000',
                        lineWidth: 1,
                    });

                    const gesture = getGesture(landmarks);
                    if (gesture === 'fire') {
                        const handX = landmarks[8].x * canvas.width; // نوک انگشت اشاره
                        const handY = landmarks[8].y * canvas.height;

                        // چک کردن برخورد آتش
                        objectsRef.current.forEach((obj, index) => {
                            const dist = Math.hypot(obj.x - (canvas.width - handX), obj.y - handY);
                            if (dist < 30) {
                                objectsRef.current.splice(index, 1);
                                setScore((prev) => {
                                    const newScore = prev + 10;
                                    if (newScore >= level * 100) {
                                        setLevel((prevLevel) => prevLevel + 1);
                                    }
                                    return newScore;
                                });
                            }
                        });

                        // رسم افکت آتش (لیزر)
                        ctx.beginPath();
                        ctx.arc(canvas.width - handX, handY, 10, 0, Math.PI * 2);
                        ctx.fillStyle = 'orange';
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(canvas.width - handX, handY);
                        ctx.lineTo(canvas.width - handX + 20, handY); // خط لیزری کوتاه
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                });
            }
            ctx.restore();
        });

        faceDetection.onResults((results: mpFaceDetection.Results) => {
            if (!gameStarted) return;

            try {
                if (results.detections.length > 0) {
                    const detection = results.detections[0];
                    //@ts-ignore
                    const keypoints = detection.keypoints;
                    const nose = keypoints?.find((kp: any) => kp.name === 'nose_tip');
                    if (nose) {
                        nosePosRef.current = {
                            x: ((webcamRef.current?.video?.videoWidth || 640) - nose.x) * (canvasRef.current?.width || 640) / (webcamRef.current?.video?.videoWidth || 640),
                            y: (nose.y / (webcamRef.current?.video?.videoHeight || 480)) * (canvasRef.current?.height || 480),
                        };
                    } else {
                        //@ts-ignore
                        nosePosRef.current = { x: canvasRef.current?.width / 2 || 320, y: canvasRef.current?.height / 2 || 240 };
                    }
                } else {
                    //@ts-ignore
                    nosePosRef.current = { x: canvasRef.current?.width / 2 || 320, y: canvasRef.current?.height / 2 || 240 };
                }
            } catch (error) {
                console.warn('Face Detection failed:', error);
                //@ts-ignore
                nosePosRef.current = { x: canvasRef.current?.width / 2 || 320, y: canvasRef.current?.height / 2 || 240 };
            }
        });

        if (webcamRef.current?.video) {
            cameraRef.current = new Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current?.video && gameStarted) {
                        try {
                            await hands.send({ image: webcamRef.current.video });
                            await faceDetection.send({ image: webcamRef.current.video });
                        } catch (error) {
                            console.error('Error sending frame:', error);
                        }
                    }
                },
                width: 640,
                height: 480,
            });
            cameraRef.current.start().catch((error) => {
                setWebcamError('دوربین شروع نشد: ' + error.message);
            });
        }

        // شروع حلقه بازی
        if (gameStarted) {
            requestAnimationFrame(updateGame);
        }

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            hands.close();
            faceDetection.close();
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
        };
    }, [gameStarted, level, lives, score]);

    return (
        <div className="flex items-center justify-center w-full flex-col px-4 min-h-screen">
            {webcamError && (
                <div className="text-red-500 text-xl font-bold mb-4">خطا: {webcamError}</div>
            )}
            {!gameStarted ? (
                <button
                    onClick={startGame}
                    className="px-6 py-3 bg-blue-600 text-white text-xl font-bold rounded-md hover:bg-blue-700 transition"
                    disabled={!!webcamError}
                >
                    شروع بازی
                </button>
            ) : (
                <>
                    <div className="relative w-full max-w-[90vw] sm:max-w-[640px] mx-auto">
                        <Webcam
                            ref={webcamRef}
                            className="rounded-md absolute inset-0 w-full h-full object-cover"
                            style={{ transform: 'scaleX(-1)' }}
                            onUserMediaError={handleWebcamError}
                            videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
                        />
                        <canvas
                            ref={canvasRef}
                            className="rounded-md w-full h-auto absolute inset-0"
                            style={{ aspectRatio: '4/3' }}
                        />
                    </div>
                    <div className="flex items-center flex-col justify-center w-full mt-4">
                        <div className="text-white text-xl font-bold">امتیاز: {score}</div>
                        <div className="text-white text-xl font-bold">سطح: {level}</div>
                        <div className="text-white text-xl font-bold">
                            جان‌ها: {lives > 0 ? '❤️'.repeat(lives) : '😵'}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DefendYourFace;