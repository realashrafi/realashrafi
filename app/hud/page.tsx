//@ts-nocheck
"use client"
import React, { useEffect, useState } from 'react';

const HUD = () => {
    const [speed, setSpeed] = useState(0);
    const [altitude, setAltitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        if ('geolocation' in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { speed, altitude, latitude, longitude } = position.coords;
                    setSpeed((speed || 0) * 3.6); // تبدیل سرعت از متر بر ثانیه به کیلومتر بر ساعت
                    setAltitude(altitude);
                    setLatitude(latitude);
                    setLongitude(longitude);
                },
                (error) => console.error(error),
                { enableHighAccuracy: true }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;

    return (
        <div
            className={`flex flex-col items-center justify-center h-screen ${
                isNight ? 'bg-black text-white' : 'bg-white text-black'
            } transition-colors duration-1000 ease-in-out`}
            style={{ transform: 'scaleX(-1)' }}
        >
            <h1 className="text-4xl mb-4">Speed: {speed.toFixed(2)} km/h</h1>
            <h2 className="text-2xl mb-2">Altitude: {altitude !== null ? `${altitude.toFixed(2)} m` : 'Loading...'}</h2>
            <h2 className="text-2xl">Latitude: {latitude !== null ? latitude.toFixed(6) : 'Loading...'}</h2>
            <h2 className="text-2xl">Longitude: {longitude !== null ? longitude.toFixed(6) : 'Loading...'}</h2>
        </div>
    );
};

export default HUD;
