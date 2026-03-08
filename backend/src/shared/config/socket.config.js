import {Server} from "socket.io";
import {createAdapter} from "@socket.io/redis-adapter";
import redis from "./redis.config.js";

const PUB_CLIENT = redis.duplicate();
const SUB_CLIENT = redis.duplicate();

const setupSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {origin: "*"},
        adapter: createAdapter(PUB_CLIENT, SUB_CLIENT),
        transports: ["websocket"],
        allowEIO3: true,
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("No token"));
        socket.data.userId = token;
        next();
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.data.userId);
        socket.join(socket.data.userId);
    });

    return io;
};

export default setupSocketServer;
