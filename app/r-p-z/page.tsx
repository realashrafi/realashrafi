'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as mpHands from '@mediapipe/hands';
import * as drawingUtils from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import { loseMessages } from '@/app/r-p-z/components/message';
import { BackgroundLines } from '../components/ui/background-lines';

const gestures = ['rock', 'paper', 'scissors'] as const;
type Gesture = typeof gestures[number];

const beatPlayer = (player: Gesture): Gesture => {
    const counter: Record<Gesture, Gesture> = {
        rock: 'paper',
        paper: 'scissors',
        scissors: 'rock',
    };
    return counter[player];
};

const getGesture = (landmarks: mpHands.NormalizedLandmarkList): Gesture => {
    const fingerTips = [8, 12, 16, 20]; // index, middle, ring, pinky
    const fingerBases = [6, 10, 14, 18];

    let openFingers = 0;

    for (let i = 0; i < 4; i++) {
        if (landmarks[fingerTips[i]].y < landmarks[fingerBases[i]].y) {
            openFingers++;
        }
    }

    const thumbTip = landmarks[4];
    const thumbBase = landmarks[2];

    const isThumbOpen = thumbTip.x > thumbBase.x;

    // تشخیص ژست
    if (openFingers === 0 && !isThumbOpen) return 'rock';
    if (openFingers === 2) return 'scissors';
    if (openFingers === 4 || (openFingers === 4 && isThumbOpen)) return 'paper';

    return 'rock'; // پیش‌فرض
};



export default function Page() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [lastPlayerMove, setLastPlayerMove] = useState<Gesture | null>(null);
    const lastPlayerMoveRef = useRef<Gesture | null>(null);
    const [result, setResult] = useState<any>({
        playerMove: '',
        computerMove: '',
        message: '',
    });

    // تنظیم عرض و ارتفاع canvas بر اساس اندازه ویوپورت
    const updateCanvasSize = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const maxWidth = window.innerWidth * 0.9; // حداکثر 90% عرض صفحه
            const aspectRatio = 4 / 3; // نسبت تصویر 4:3
            canvas.width = Math.min(maxWidth, 640); // حداکثر عرض 640
            canvas.height = canvas.width / aspectRatio; // تنظیم ارتفاع
        }
    };

    useEffect(() => {
        // به‌روزرسانی اندازه canvas هنگام لود و تغییر اندازه صفحه
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        const hands = new mpHands.Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        hands.onResults((results: mpHands.Results) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (!ctx || !canvas) return;

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //@ts-ignore
            ctx.drawImage(results.image as HTMLVideoElement, 0, 0, canvas.width, canvas.height);

            if (results.multiHandLandmarks?.length) {
                const landmarks = results.multiHandLandmarks[0];
                drawingUtils.drawConnectors(ctx, landmarks, mpHands.HAND_CONNECTIONS, {
                    color: '#00FF00',
                    lineWidth: 3,
                });
                drawingUtils.drawLandmarks(ctx, landmarks, {
                    color: '#FF0000',
                    lineWidth: 2,
                });

                const playerMove = getGesture(landmarks);

                if (playerMove !== lastPlayerMoveRef.current) {
                    const computerMove = beatPlayer(playerMove);
                    const message = loseMessages[Math.floor(Math.random() * loseMessages.length)];

                    setResult({
                        playerMove,
                        computerMove,
                        message,
                    });

                    lastPlayerMoveRef.current = playerMove;
                }
            }
            ctx.restore();
        });

        if (webcamRef.current?.video) {
            const camera = new Camera(webcamRef.current.video!, {
                onFrame: async () => {
                    await hands.send({ image: webcamRef.current!.video! });
                },
                width: 640, // عرض پیش‌فرض برای webcam
                height: 480, // ارتفاع پیش‌فرض برای webcam
            });
            camera.start();
        }

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []);

    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <div className="relative w-full max-w-[90vw] lg:mt-0 mt-[400px] sm:max-w-[640px] mx-auto">
                <Webcam
                    className="rounded-md absolute inset-0 w-full h-full object-cover"
                    ref={webcamRef}
                    style={{ display: 'none' }}
                />
                <canvas
                    className="rounded-md w-full h-auto"
                    ref={canvasRef}
                    style={{ aspectRatio: '4/3' }}
                />
            </div>
            {result.message !== '' && (
                <div className="flex items-center flex-col justify-center w-full mt-4">
                    <div className="text-white text-xl font-bold">You: {result.playerMove}</div>
                    <div className="text-white text-xl font-bold">Computer: {result.computerMove}</div>
                    <div className="text-white text-xl font-bold">Result: {result.message}</div>
                </div>
            )}
        </BackgroundLines>
    );
}