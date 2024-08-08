// @ts-nocheck
'use client'
import React, {
    useState,
    useEffect,
    useRef,
    useCallback
} from 'react';

const MovingCube = () => {
    const canvasRef = useRef(null);
    const moveStep = 10;
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [cubePosition, setCubePosition] = useState({ x: window.innerWidth / 2 - 25, y: window.innerHeight / 2 - 25 });
    const [cubeSize, setCubeSize] = useState(50);
    const [randomCubes, setRandomCubes] = useState([]);

    const generateRandomCubes = (count) => {
        const cubes = [];
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 30 + 20; // Random size between 20 and 50
            const x = Math.random() * (canvasSize.width - size);
            const y = Math.random() * (canvasSize.height - size);
            cubes.push({ x, y, size });
        }
        return cubes;
    };

    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
            setCubePosition({ x: window.innerWidth / 2 - cubeSize / 2, y: window.innerHeight / 2 - cubeSize / 2 });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [cubeSize]);

    useEffect(() => {
        setRandomCubes(generateRandomCubes(25));
    }, [canvasSize]);

    const handleMouseClick = useCallback((event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        setCubePosition((prevPosition) => {
            const deltaX = clickX - (prevPosition.x + cubeSize / 2);
            const deltaY = clickY - (prevPosition.y + cubeSize / 2);
            const angle = Math.atan2(deltaY, deltaX);

            const newX = prevPosition.x + moveStep * Math.cos(angle);
            const newY = prevPosition.y + moveStep * Math.sin(angle);

            return { x: newX, y: newY };
        });
    }, [moveStep, cubeSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        canvas.addEventListener('click', handleMouseClick);

        return () => {
            canvas.removeEventListener('click', handleMouseClick);
        };
    }, [canvasSize, handleMouseClick]);

    const checkCollision = (cube1, cube2) => {
        return (
            cube1.x < cube2.x + cube2.size &&
            cube1.x + cube1.size > cube2.x &&
            cube1.y < cube2.y + cube2.size &&
            cube1.y + cube1.size > cube2.y
        );
    };

    const handleCollisionsAndDraw = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw line (surface)
        context.beginPath();
        context.moveTo(0, canvas.height / 2);
        context.lineTo(canvas.width, canvas.height / 2);
        context.strokeStyle = '#6B7280';
        context.lineWidth = 2;
        context.stroke();

        // Handle collisions
        setRandomCubes((prevCubes) =>
            prevCubes.filter((cube) => {
                if (checkCollision({ x: cubePosition.x, y: cubePosition.y, size: cubeSize }, cube)) {
                    if (cubeSize > cube.size) {
                        setCubeSize(cubeSize + cube.size * 0.1);
                    } else {
                        setCubeSize(cubeSize - cube.size * 0.1);
                    }
                    return false; // Remove collided cube
                }
                return true;
            })
        );

        // Draw moving cube
        context.fillStyle = '#3B82F6';
        context.fillRect(cubePosition.x, cubePosition.y, cubeSize, cubeSize);
        context.strokeStyle = '#1E40AF';
        context.lineWidth = 2;
        context.strokeRect(cubePosition.x, cubePosition.y, cubeSize, cubeSize);

        // Draw random cubes
        randomCubes.forEach((cube) => {
            context.fillStyle = '#10B981';
            context.fillRect(cube.x, cube.y, cube.size, cube.size);
            context.strokeStyle = '#047857';
            context.lineWidth = 2;
            context.strokeRect(cube.x, cube.y, cube.size, cube.size);
        });
    };

    const animate = () => {
        handleCollisionsAndDraw();
        requestAnimationFrame(animate);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        const animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [canvasSize, cubePosition, cubeSize, randomCubes]);

    return (
        <>
            <div className={'text-white text-3xl text-center'}>
                this is hungry cube
            </div>
            <div className="flex flex-col items-center justify-center h-screen scale-95 rounded-lg bg-gray-100">
                <canvas ref={canvasRef} className="rounded-lg shadow-lg"/>
            </div>
        </>
    );
};

export default MovingCube;

