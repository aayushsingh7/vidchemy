import {Server, Socket} from "socket.io";
import redis from "./redis.config.js";

const PUB_CLIENT = redis.duplicate();
const SUB_CLIENT = redis.duplicate();

const setupSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {origin: "http://localhost:4000"},
        adapter: [PUB_CLIENT, SUB_CLIENT],
        transports: ["websocket", "polling"],
        allowEIO3: true,
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) return next(new Error("No token"));

        socket.data.userId = token;
        next();
    });

    io.on("connection", (socket) => {
        socket.on("connect", () => console.log(socket.id));
    });

    return io;
};

export default setupSocketServer;
