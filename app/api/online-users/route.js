// app/api/online-users/route.js
export async function GET(request) {
    const io = global.io;  // Accessing the global Socket.IO instance

    if (io) {
        const onlineUsers = Array.from(io.sockets.sockets.keys());

        return new Response(JSON.stringify({ onlineUsers }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new Response(JSON.stringify({ error: 'Socket.io server not initialized' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
