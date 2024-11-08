'use client'
import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ObjectDetectionComponent: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [isBackCamera, setIsBackCamera] = useState(true);

    useEffect(() => {
        // بارگذاری مدل تشخیص اشیاء
        const loadModel = async () => {
            const loadedModel = await cocoSsd.load();
            setModel(loadedModel);
        };
        loadModel();
    }, []);

    const startVideo = () => {
        if (navigator?.mediaDevices?.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: isBackCamera ? 'environment' : 'user', // دوربین جلو یا پشت
                },
            })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(console.error);
        }
    };

    useEffect(() => {
        startVideo();
    }, [isBackCamera]);

    const detectObjects = async () => {
        if (model && videoRef.current && canvasRef.current) {
            const predictions = await model.detect(videoRef.current);
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                predictions.forEach(prediction => {
                    const [x, y, width, height] = prediction.bbox;
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, width, height);
                    ctx.fillStyle = 'red';
                    ctx.font = '16px Arial';
                    ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);
                });
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            detectObjects();
        }, 100);
        return () => clearInterval(interval);
    }, [model]);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' ,marginTop:20 }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    transform: isBackCamera ? 'scaleX(1)' : 'scaleX(-1)', // آینه کردن تصویر برای دوربین جلو
                }}
            />
            <canvas
                ref={canvasRef}
                width="640"
                height="480"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            />
            <button
                onClick={() => setIsBackCamera(!isBackCamera)}
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                switch
            </button>
        </div>
    );
};

export default ObjectDetectionComponent;
