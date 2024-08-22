'use client'
import React, {useRef, useState, useEffect, useCallback} from 'react';

const VideoScroller = ({videoSrc, fps, speed}: { videoSrc: string; fps: number; speed: number; }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    const handleScroll = useCallback(() => {
        setScrollPosition(window.scrollY);
    }, []);

    const updateVideoTime = useCallback(() => {
        const video = videoRef.current;
        if (video && video.readyState >= 2) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const totalFrames = fps * video.duration; // Total frames in video

            const percentage = Math.min(Math.max(scrollPosition / totalHeight, 0), 1);
            const frameNumber = Math.floor(percentage * totalFrames);
            const frameTime = video.duration / totalFrames;

            video.currentTime = frameNumber * frameTime;
            video.playbackRate = speed;
            video.pause(); // Ensure video stays paused
        }
    }, [scrollPosition, fps, speed]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        const handleScrollUpdate = () => {
            requestAnimationFrame(updateVideoTime);
        };

        window.addEventListener('scroll', handleScrollUpdate);
        return () => {
            window.removeEventListener('scroll', handleScrollUpdate);
        };
    }, [updateVideoTime]);

    // Attempt to play video after component mounts to ensure it's loaded
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch((error) => {
                console.error("Failed to play video automatically:", error);
            });
        }
    }, []);

    return (
        <div className="relative overflow-hidden h-[100vh]">
            <video
                ref={videoRef}
                src={videoSrc}
                className="fixed top-0 left-0 w-full h-full object-cover"
                muted
                playsInline
                preload="auto" // Preload the video

            />
        </div>
    );
};

export default VideoScroller;
