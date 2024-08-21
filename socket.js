// socket.js
import { Server } from "socket.io";

let io;

export function initSocket(server) {
    if (!io) {
        io = new Server(server, {
            path: "/api/socket", // مسیر سفارشی برای Socket.IO
        });

        io.on("connection", (socket) => {
            console.log("New connection: " + socket.id);

            socket.on("disconnect", () => {
                console.log("User disconnected: " + socket.id);
            });
        });
    }
    return io;
}
