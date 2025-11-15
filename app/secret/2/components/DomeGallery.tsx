'use client';

import React, {
    useRef,
    useMemo,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useGesture } from '@use-gesture/react';

/* -------------------------------------------------
   1. لیست موزیک‌ها (هر عکس → یک آهنگ)
   ------------------------------------------------- */
const MUSIC_LIST = [
    { title: 'آواز شب', artist: 'realashrafi', src: 'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/Gary%20Moore%20-%20I%20Had%20A%20Dream%20%28320%29.mp3' },
];

/* -------------------------------------------------
   2. پلیر موزیک
   ------------------------------------------------- */
function MusicPlayer({
                         currentTrack,
                         onNext,
                         onPrev,
                         isPlaying,
                         onTogglePlay,
                     }: {
    currentTrack: typeof MUSIC_LIST[0];
    onNext: () => void;
    onPrev: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [volume, setVolume] = useState(0.7);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current!;
        audio.src = currentTrack.src;
        audio.volume = volume;

        const onMeta = () => setDuration(audio.duration);
        const onTime = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);

        audio.addEventListener('loadedmetadata', onMeta);
        audio.addEventListener('timeupdate', onTime);

        if (isPlaying) audio.play().catch(() => {});
        else audio.pause();

        return () => {
            audio.removeEventListener('loadedmetadata', onMeta);
            audio.removeEventListener('timeupdate', onTime);
            audio.pause();
        };
    }, [currentTrack, isPlaying, volume]);

    const format = (s: number) => {
        const m = Math.floor(s / 60);
        const ss = Math.floor(s % 60);
        return `${m}:${ss.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <audio ref={audioRef} preload="metadata" />
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-96 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl z-50 transition hover:bg-black/90">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl animate-pulse" />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate">{currentTrack.title}</h4>
                        <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
                    </div>
                </div>

                <div className="mt-3 relative h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{format((progress * duration) / 100)}</span>
                    <span>{format(duration)}</span>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                    <button onClick={onPrev} className="text-white/70 hover:text-white transition">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 6h2v12H6zm3.5 12l8.5-6-8.5-6z" />
                        </svg>
                    </button>

                    <button
                        onClick={onTogglePlay}
                        className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition"
                    >
                        {isPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    <button onClick={onNext} className="text-white/70 hover:text-white transition">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                    <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #a855f7 0%, #3b82f6 ${volume * 100}%, #ffffff33 ${volume * 100}%, #ffffff33 100%)`,
                        }}
                    />
                </div>
            </div>
        </>
    );
}

/* -------------------------------------------------
   3. گالری اصلی (با onImageClick اضافه شده)
   ------------------------------------------------- */
type ImageItem = string | { src: string; alt?: string };
type DomeGalleryProps = {
    images?: ImageItem[];
    fit?: number;
    fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
    minRadius?: number;
    maxRadius?: number;
    padFactor?: number;
    overlayBlurColor?: string;
    maxVerticalRotationDeg?: number;
    dragSensitivity?: number;
    enlargeTransitionMs?: number;
    segments?: number;
    dragDampening?: number;
    openedImageWidth?: string;
    openedImageHeight?: string;
    imageBorderRadius?: string;
    openedImageBorderRadius?: string;
    grayscale?: boolean;
    onImageClick?: (index: number) => void;
};

const DEFAULT_IMAGES: ImageItem[] = [
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-10-03_17-23-11.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-10-06_14-58-05.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-10-19_22-12-51.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-10-22_18-38-44.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-10-22_21-01-31.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-10-27_09-21-45.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-10-28_18-26-13.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-07_16-27-15.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_20-09-04.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_21-58-27.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_21-58-31.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_21-59-03.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_21-59-07.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_22-05-57.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_22-06-02.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_22-06-10.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_22-06-17.jpg',
    'https://wonderful-yonath-zqfmh2rkb.storage.iran.liara.space/table%201/secret/photo_2025-11-15_22-06-23.jpg',
];

const DEFAULTS = { maxVerticalRotationDeg: 5, dragSensitivity: 20, enlargeTransitionMs: 300, segments: 35 };
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => (((deg + 180) % 360) + 360) % 360 - 180;
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
    const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
    const n = attr == null ? NaN : parseFloat(attr);
    return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool: ImageItem[], seg: number) {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4], oddYs = [-3, -1, 1, 3, 5];
    const coords = xCols.flatMap((x, c) => (c % 2 === 0 ? evenYs : oddYs).map(y => ({ x, y, sizeX: 2, sizeY: 2 })));
    const normalized = pool.map(img => typeof img === 'string' ? { src: img, alt: '' } : img);
    const used = Array.from({ length: coords.length }, (_, i) => normalized[i % normalized.length]);
    return coords.map((c, i) => ({ ...c, src: used[i].src, alt: used[i].alt }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
    const unit = 360 / segments / 2;
    return { rotateX: unit * (offsetY - (sizeY - 1) / 2), rotateY: unit * (offsetX + (sizeX - 1) / 2) };
}

function Particles() {
    const count = 1200;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 12 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);
    const ref = useRef<THREE.Points>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.03;
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
        }
    });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#8888ff" transparent opacity={0.6} />
        </points>
    );
}

function DomeGalleryDOM({
                            images = DEFAULT_IMAGES,
                            fit = 0.5,
                            fitBasis = 'auto',
                            minRadius = 600,
                            maxRadius = Infinity,
                            padFactor = 0.25,
                            overlayBlurColor = '#060010',
                            maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
                            dragSensitivity = DEFAULTS.dragSensitivity,
                            enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
                            segments = DEFAULTS.segments,
                            dragDampening = 2,
                            openedImageWidth = '400px',
                            openedImageHeight = '400px',
                            imageBorderRadius = '30px',
                            openedImageBorderRadius = '30px',
                            grayscale = true,
                            onImageClick,
                        }: DomeGalleryProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const sphereRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<HTMLDivElement>(null);
    const scrimRef = useRef<HTMLDivElement>(null);
    const focusedElRef = useRef<HTMLElement | null>(null);
    const originalTilePositionRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
    const rotationRef = useRef({ x: 0, y: 0 });
    const startRotRef = useRef({ x: 0, y: 0 });
    const startPosRef = useRef<{ x: number; y: number } | null>(null);
    const draggingRef = useRef(false);
    const cancelTapRef = useRef(false);
    const movedRef = useRef(false);
    const inertiaRAF = useRef<number | null>(null);
    const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch'>('mouse');
    const tapTargetRef = useRef<HTMLElement | null>(null);
    const openingRef = useRef(false);
    const openStartedAtRef = useRef(0);
    const lastDragEndAt = useRef(0);
    const scrollLockedRef = useRef(false);

    const lockScroll = useCallback(() => {
        if (scrollLockedRef.current) return;
        scrollLockedRef.current = true;
        document.body.classList.add('dg-scroll-lock');
    }, []);
    const unlockScroll = useCallback(() => {
        if (!scrollLockedRef.current) return;
        if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
        scrollLockedRef.current = false;
        document.body.classList.remove('dg-scroll-lock');
    }, []);

    const items = useMemo(() => buildItems(images, segments), [images, segments]);

    const applyTransform = (xDeg: number, yDeg: number) => {
        const el = sphereRef.current;
        if (el) el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    };

    const lockedRadiusRef = useRef<number | null>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const ro = new ResizeObserver(entries => {
            const cr = entries[0].contentRect;
            const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
            const minDim = Math.min(w, h), aspect = w / h;
            let basis: number;
            switch (fitBasis) {
                case 'min': basis = minDim; break;
                case 'max': basis = Math.max(w, h); break;
                case 'width': basis = w; break;
                case 'height': basis = h; break;
                default: basis = aspect >= 1.3 ? w : minDim;
            }
            let radius = basis * fit;
            radius = Math.min(radius, h * 1.35);
            radius = clamp(radius, minRadius, maxRadius);
            lockedRadiusRef.current = Math.round(radius);
            const viewerPad = Math.max(8, Math.round(minDim * padFactor));
            root.style.setProperty('--radius', `${radius}px`);
            root.style.setProperty('--viewer-pad', `${viewerPad}px`);
            root.style.setProperty('--overlay-blur-color', overlayBlurColor);
            root.style.setProperty('--tile-radius', imageBorderRadius);
            root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
            applyTransform(rotationRef.current.x, rotationRef.current.y);
        });
        ro.observe(root);
        return () => ro.disconnect();
    }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, imageBorderRadius, openedImageBorderRadius]);

    useEffect(() => applyTransform(rotationRef.current.x, rotationRef.current.y), []);

    const stopInertia = useCallback(() => {
        if (inertiaRAF.current) cancelAnimationFrame(inertiaRAF.current);
        inertiaRAF.current = null;
    }, []);

    const startInertia = useCallback((vx: number, vy: number) => {
        const MAX_V = 1.4;
        let vX = clamp(vx, -MAX_V, MAX_V) * 80;
        let vY = clamp(vy, -MAX_V, MAX_V) * 80;
        let frames = 0;
        const d = clamp(dragDampening ?? 0.6, 0, 1);
        const frictionMul = 0.94 + 0.055 * d;
        const stopThreshold = 0.015 - 0.01 * d;
        const maxFrames = Math.round(90 + 270 * d);
        const step = () => {
            vX *= frictionMul; vY *= frictionMul;
            if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) return (inertiaRAF.current = null);
            if (++frames > maxFrames) return (inertiaRAF.current = null);
            const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
            const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
            rotationRef.current = { x: nextX, y: nextY };
            applyTransform(nextX, nextY);
            inertiaRAF.current = requestAnimationFrame(step);
        };
        stopInertia();
        inertiaRAF.current = requestAnimationFrame(step);
    }, [dragDampening, maxVerticalRotationDeg, stopInertia]);

    useGesture({
        onDragStart: ({ event }) => {
            if (focusedElRef.current) return;
            stopInertia();
            const evt = event as PointerEvent;
            pointerTypeRef.current = (evt.pointerType as any) || 'mouse';
            if (pointerTypeRef.current === 'touch') evt.preventDefault();
            if (pointerTypeRef.current === 'touch') lockScroll();
            draggingRef.current = true;
            cancelTapRef.current = false;
            movedRef.current = false;
            startRotRef.current = { ...rotationRef.current };
            startPosRef.current = { x: evt.clientX, y: evt.clientY };
            const potential = (evt.target as Element).closest?.('.item__image') as HTMLElement | null;
            tapTargetRef.current = potential || null;
        },
        onDrag: ({ event, last, velocity: [vx, vy], movement }) => {
            if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
            const evt = event as PointerEvent;
            if (pointerTypeRef.current === 'touch') evt.preventDefault();
            const dxTotal = evt.clientX - startPosRef.current.x;
            const dyTotal = evt.clientY - startPosRef.current.y;
            if (!movedRef.current && dxTotal * dxTotal + dyTotal * dyTotal > 16) movedRef.current = true;
            const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
            const nextY = startRotRef.current.y + dxTotal / dragSensitivity;
            if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
                rotationRef.current = { x: nextX, y: nextY };
                applyTransform(nextX, nextY);
            }
            if (last) {
                draggingRef.current = false;
                let isTap = false;
                if (startPosRef.current) {
                    const dx = evt.clientX - startPosRef.current.x;
                    const dy = evt.clientY - startPosRef.current.y;
                    const dist2 = dx * dx + dy * dy;
                    const TAP_THRESH_PX = pointerTypeRef.current === 'touch' ? 10 : 6;
                    if (dist2 <= TAP_THRESH_PX * TAP_THRESH_PX) isTap = true;
                }
                if (!isTap && (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)) startInertia(vx, vy);
                startPosRef.current = null;
                cancelTapRef.current = !isTap;
                if (isTap && tapTargetRef.current && !focusedElRef.current) {
                    openItemFromElement(tapTargetRef.current);
                }
                tapTargetRef.current = null;
                if (cancelTapRef.current) setTimeout(() => (cancelTapRef.current = false), 120);
                if (pointerTypeRef.current === 'touch') unlockScroll();
                if (movedRef.current) lastDragEndAt.current = performance.now();
                movedRef.current = false;
            }
        }
    }, { target: mainRef, eventOptions: { passive: false } });

    const openItemFromElement = (el: HTMLElement) => {
        if (openingRef.current) return;
        openingRef.current = true;
        openStartedAtRef.current = performance.now();
        lockScroll();
        const parent = el.parentElement as HTMLElement;
        focusedElRef.current = el;
        el.setAttribute('data-focused', 'true');
        const offsetX = getDataNumber(parent, 'offsetX', 0);
        const offsetY = getDataNumber(parent, 'offsetY', 0);
        const sizeX = getDataNumber(parent, 'sizeX', 2);
        const sizeY = getDataNumber(parent, 'sizeY', 2);
        const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
        const parentY = normalizeAngle(parentRot.rotateY);
        const globalY = normalizeAngle(rotationRef.current.y);
        let rotY = -(parentY + globalY) % 360;
        if (rotY < -180) rotY += 360;
        const rotX = -parentRot.rotateX - rotationRef.current.x;
        parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
        parent.style.setProperty('--rot-x-delta', `${rotX}deg`);
        const refDiv = document.createElement('div');
        refDiv.className = 'item__image item__image--reference opacity-0';
        refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
        parent.appendChild(refDiv);
        void refDiv.offsetHeight;
        const tileR = refDiv.getBoundingClientRect();
        const mainR = mainRef.current?.getBoundingClientRect();
        const frameR = frameRef.current?.getBoundingClientRect();
        if (!mainR || !frameR || tileR.width <= 0) {
            openingRef.current = false;
            focusedElRef.current = null;
            parent.removeChild(refDiv);
            unlockScroll();
            return;
        }
        originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
        el.style.visibility = 'hidden';
        (el.style as any).zIndex = 0;
        const overlay = document.createElement('div');
        overlay.className = 'enlarge';
        overlay.style.cssText = `position:absolute; left:${frameR.left - mainR.left}px; top:${frameR.top - mainR.top}px; width:${frameR.width}px; height:${frameR.height}px; opacity:0; z-index:30; transition:transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease; border-radius:${openedImageBorderRadius}; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.35);`;
        const img = document.createElement('img');
        img.src = parent.dataset.src || (el.querySelector('img') as HTMLImageElement)?.src || '';
        img.alt = parent.dataset.alt || '';
        img.style.cssText = 'width:100%; height:100%; object-fit:cover; filter:none;';
        overlay.appendChild(img);
        viewerRef.current!.appendChild(overlay);
        const tx0 = tileR.left - frameR.left;
        const ty0 = tileR.top - frameR.top;
        const sx0 = tileR.width / frameR.width;
        const sy0 = tileR.height / frameR.height;
        overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`;
        setTimeout(() => {
            if (!overlay.parentElement) return;
            overlay.style.opacity = '1';
            overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
            rootRef.current?.setAttribute('data-enlarging', 'true');
        }, 16);
    };

    useEffect(() => {
        const scrim = scrimRef.current;
        if (!scrim) return;
        const close = () => {
            if (performance.now() - openStartedAtRef.current < 250) return;
            const el = focusedElRef.current;
            if (!el) return;
            const parent = el.parentElement as HTMLElement;
            const overlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement | null;
            if (!overlay) return;
            const originalPos = originalTilePositionRef.current;
            if (!originalPos) {
                overlay.remove();
                el.style.visibility = '';
                (el.style as any).zIndex = 0;
                focusedElRef.current = null;
                rootRef.current?.removeAttribute('data-enlarging');
                openingRef.current = false;
                return;
            }
            const animatingOverlay = document.createElement('div');
            animatingOverlay.className = 'enlarge-closing';
            const currentRect = overlay.getBoundingClientRect();
            const rootRect = rootRef.current!.getBoundingClientRect();
            animatingOverlay.style.cssText = `
        position: absolute; left: ${currentRect.left - rootRect.left}px; top: ${currentRect.top - rootRect.top}px;
        width: ${currentRect.width}px; height: ${currentRect.height}px; z-index: 9999; border-radius: ${openedImageBorderRadius};
        overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.35); transition: all ${enlargeTransitionMs}ms ease-out;
        pointer-events: none; filter: none;
      `;
            const img = overlay.querySelector('img')!.cloneNode() as HTMLImageElement;
            img.style.cssText = 'width:100%; height:100%; object-fit:cover;';
            animatingOverlay.appendChild(img);
            overlay.remove();
            rootRef.current!.appendChild(animatingOverlay);
            void animatingOverlay.getBoundingClientRect();
            requestAnimationFrame(() => {
                animatingOverlay.style.left = `${originalPos.left - rootRect.left}px`;
                animatingOverlay.style.top = `${originalPos.top - rootRect.top}px`;
                animatingOverlay.style.width = `${originalPos.width}px`;
                animatingOverlay.style.height = `${originalPos.height}px`;
                animatingOverlay.style.opacity = '0';
            });
            animatingOverlay.addEventListener('transitionend', () => {
                animatingOverlay.remove();
                originalTilePositionRef.current = null;
                parent.querySelector('.item__image--reference')?.remove();
                parent.style.transition = 'none';
                el.style.transition = 'none';
                parent.style.setProperty('--rot-y-delta', `0deg`);
                parent.style.setProperty('--rot-x-delta', `0deg`);
                requestAnimationFrame(() => {
                    el.style.visibility = '';
                    (el.style as any).zIndex = 0;
                    focusedElRef.current = null;
                    rootRef.current?.removeAttribute('data-enlarging');
                    openingRef.current = false;
                    unlockScroll();
                });
            }, { once: true });
        };
        scrim.addEventListener('click', close);
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
        window.addEventListener('keydown', onKey);
        return () => {
            scrim.removeEventListener('click', close);
            window.removeEventListener('keydown', onKey);
        };
    }, [enlargeTransitionMs, openedImageBorderRadius]);

    return (
        <div ref={rootRef} className="sphere-root relative w-full h-full" style={{
            '--segments-x': segments, '--segments-y': segments, '--overlay-blur-color': overlayBlurColor,
            '--tile-radius': imageBorderRadius, '--enlarge-radius': openedImageBorderRadius
        } as React.CSSProperties}>
            <style dangerouslySetInnerHTML={{ __html: `
        .sphere-root { --radius: 520px; --viewer-pad: 72px; --circ: calc(var(--radius) * 3.14); }
        .sphere-root * { box-sizing: border-box; }
        .sphere, .sphere-item, .item__image { transform-style: preserve-3d; }
        .stage { width: 100%; height: 100%; display: grid; place-items: center; position: absolute; inset: 0; margin: auto; perspective: calc(var(--radius) * 2); }
        .sphere { transform: translateZ(calc(var(--radius) * -1)); will-change: transform; position: absolute; }
        .sphere-item { width: calc(var(--circ) / var(--segments-x) * var(--item-size-x)); height: calc(var(--circ) / var(--segments-y) * var(--item-size-y));
            position: absolute; top: -999px; bottom: -999px; left: -999px; right: -999px; margin: auto; transform-origin: 50% 50%;
            backface-visibility: hidden; transition: transform 300ms;
            transform: rotateY(calc((360deg / var(--segments-x)) / 2 * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg)))
                       rotateX(calc((360deg / var(--segments-y)) / 2 * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg)))
                       translateZ(var(--radius));
        }
        .item__image { position: absolute; inset: 10px; border-radius: var(--tile-radius); overflow: hidden; cursor: pointer;
            backface-visibility: hidden; transition: transform 300ms; pointer-events: auto; }
        .item__image.grayscale img { filter: grayscale(1); }
        .item__image--reference { position: absolute; inset: 10px; pointer-events: none; }
        .sphere-root[data-enlarging="true"] .scrim { opacity: 1 !important; pointer-events: all !important; }
      ` }} />
            <main ref={mainRef} className="absolute inset-0 grid place-items-center overflow-hidden select-none" style={{ touchAction: 'none' }}>
                <div className="stage">
                    <div ref={sphereRef} className="sphere">
                        {items.map((it, i) => {
                            const idx = images.findIndex(img => (typeof img === 'string' ? img : img.src) === it.src);
                            return (
                                <div key={`${it.x},${it.y},${i}`} className="sphere-item absolute m-auto"
                                     data-src={it.src} data-alt={it.alt} data-offset-x={it.x} data-offset-y={it.y}
                                     data-size-x={it.sizeX} data-size-y={it.sizeY}
                                     style={{ '--offset-x': it.x, '--offset-y': it.y, '--item-size-x': it.sizeX, '--item-size-y': it.sizeY } as React.CSSProperties}>
                                    <div className={`item__image absolute block overflow-hidden cursor-pointer bg-gray-200 transition-transform duration-300 ${grayscale ? 'grayscale' : ''}`}
                                         role="button" tabIndex={0} aria-label={it.alt || 'Open image'}
                                         onClick={e => {
                                             if (draggingRef.current || movedRef.current || performance.now() - lastDragEndAt.current < 80 || openingRef.current) return;
                                             onImageClick?.(idx);
                                             openItemFromElement(e.currentTarget as HTMLElement);
                                         }}>
                                        <img src={it.src} draggable={false} alt={it.alt} className="w-full h-full object-cover pointer-events-none" style={{ backfaceVisibility: 'hidden' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="absolute inset-0 m-auto z-[3] pointer-events-none"
                     style={{ backgroundImage: `radial-gradient(rgba(235,235,235,0) 65%, ${overlayBlurColor} 100%)` }} />
                <div className="absolute inset-0 m-auto z-[3] pointer-events-none"
                     style={{ WebkitMaskImage: `radial-gradient(rgba(235,235,235,0) 70%, ${overlayBlurColor} 90%)`, backdropFilter: 'blur(3px)' }} />

                <div ref={viewerRef} className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" style={{ padding: 'var(--viewer-pad)' }}>
                    <div ref={scrimRef} className="scrim absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500"
                         style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }} />
                    <div ref={frameRef} className="viewer-frame h-full aspect-square flex" style={{ borderRadius: `var(--enlarge-radius)` }} />
                </div>
            </main>
        </div>
    );
}

/* -------------------------------------------------
   4. کامپوننت نهایی با پلیر
   ------------------------------------------------- */
export default function HybridDomeGalleryWithMusic({
                                                       images = DEFAULT_IMAGES,
                                                       grayscale = true,
                                                   }: { images?: ImageItem[]; grayscale?: boolean }) {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const handleImageClick = (idx: number) => {
        const trackIdx = idx >= 0 ? idx % MUSIC_LIST.length : 0;
        setCurrentTrackIndex(trackIdx);
        setIsPlaying(true);
    };

    const next = () => setCurrentTrackIndex(i => (i + 1) % MUSIC_LIST.length);
    const prev = () => setCurrentTrackIndex(i => (i - 1 + MUSIC_LIST.length) % MUSIC_LIST.length);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(p => !p);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <Canvas className="absolute inset-0" camera={{ position: [0, 0, 15], fov: 60 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <Particles />
                <Environment preset="night" />
            </Canvas>

            <div className="absolute inset-0 z-10">
                <DomeGalleryDOM images={images} grayscale={grayscale} onImageClick={handleImageClick} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none z-20" />

            <MusicPlayer
                currentTrack={MUSIC_LIST[currentTrackIndex]}
                onNext={next}
                onPrev={prev}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(p => !p)}
            />
        </div>
    );
}