// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Home() {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const socket = io({
            path: "/api/socket",
        });

        socket.on('connect', () => {
            console.log('Connected: ' + socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected: ' + socket.id);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div>
            <h1>Online Users</h1>
            <ul>
                {onlineUsers.map((user) => (
                    <li key={user}>{user}</li>
                ))}
            </ul>
        </div>
    );
}
