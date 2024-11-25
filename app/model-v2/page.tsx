'use client';
import React, { useRef, useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ObjectDetectionComponent: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [isBackCamera, setIsBackCamera] = useState(true);
    const [plates, setPlates] = useState<Array<{ plate: string, time: string }>>([]);

    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await cocoSsd.load();
            setModel(loadedModel);
        };
        loadModel();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: isBackCamera ? 'environment' : 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
            },
        })
            .then((stream) => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch(console.error);
    };

    useEffect(() => {
        startVideo();
    }, [isBackCamera]);

    const preprocessImage = (imageData: ImageData): ImageData => {
        const canvas = document.createElement('canvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.putImageData(imageData, 0, 0);
            const imageDataBW = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < imageDataBW.data.length; i += 4) {
                const avg = (imageDataBW.data[i] + imageDataBW.data[i + 1] + imageDataBW.data[i + 2]) / 3;
                const binaryColor = avg > 127 ? 255 : 0;
                imageDataBW.data[i] = imageDataBW.data[i + 1] = imageDataBW.data[i + 2] = binaryColor;
            }
            ctx.putImageData(imageDataBW, 0, 0);
        }
        return ctx!.getImageData(0, 0, canvas.width, canvas.height);
    };

    const detectObjects = async () => {
        if (model && videoRef.current && canvasRef.current) {
            const predictions = await model.detect(videoRef.current);
            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                predictions.forEach(async (prediction) => {
                    const [x, y, width, height] = prediction.bbox;
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, width, height);

                    const image = ctx.getImageData(x, y, width, height);
                    const preprocessedImage = preprocessImage(image);
                    const plateText = await extractPlateText(preprocessedImage);

                    if (plateText && isValidPlate(plateText)) {
                        const formattedPlate = convertPersianNumbers(plateText);
                        updateSessionPlates({ plate: formattedPlate, time: new Date().toISOString() });
                    }

                    ctx.fillStyle = 'red';
                    ctx.font = '16px Arial';
                    ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);
                });
            }
        }
    };

    const extractPlateText = async (imageData: ImageData): Promise<string | null> => {
        try {
            const { data: { text } } = await Tesseract.recognize(
                imageData,
                'ara',
                { langPath: '/tessdata', cacheMethod: 'none' }
            );
            console.log('Extracted Plate Text:', text.trim());
            return text.trim();
        } catch (error) {
            console.error('Error reading plate text:', error);
            return null;
        }
    };

    const convertPersianNumbers = (text: string): string => {
        const persianNumbers: { [key: string]: string } = {
            '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
            '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
        };
        return text.replace(/[۰-۹]/g, (match) => persianNumbers[match] || match);
    };

    const isValidPlate = (text: string): boolean => {
        const plateRegex = /^[آ-ی]{1,3}\s?\d{1,3}\s?[آ-ی]{1,2}\s?\d{2}$/;
        return plateRegex.test(text);
    };

    const updateSessionPlates = (newPlate: { plate: string, time: string }) => {
        const currentPlates = JSON.parse(sessionStorage.getItem('plates') || '[]');
        if (!currentPlates.some((plate: any) => plate.plate === newPlate.plate)) {
            const updatedPlates = [...currentPlates, newPlate];
            sessionStorage.setItem('plates', JSON.stringify(updatedPlates));
            setPlates(updatedPlates);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            detectObjects();
        }, 500);
        return () => clearInterval(interval);
    }, [model]);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto', marginTop: 20 }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    transform: isBackCamera ? 'scaleX(1)' : 'scaleX(-1)',
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
                Switch Camera
            </button>
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <h3 className='text-white'>Detected Plates:</h3>
                <ul className='text-white'>
                    {plates.map((plate, index) => (
                        <li key={index}>{plate.plate} - {new Date(plate.time).toLocaleTimeString()}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ObjectDetectionComponent;
