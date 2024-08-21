// app/api/socket/route.js (یا route.ts)
import { initSocket } from "../../../socket";

export async function GET(request) {
    const { socket } = request;

    if (!socket.server.io) {
        initSocket(socket.server);
    }

    return new Response(JSON.stringify({ message: "Socket.IO is running" }), {
        headers: { "Content-Type": "application/json" },
    });
}
