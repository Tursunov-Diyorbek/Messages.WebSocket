import { Server } from "socket.io";

export default function SocketHandler(req, res) {

    if (res.socket.server.io) {
        console.log("Already set up");
        res.end();
        return;
    }

    const io = new Server(res.socket.server);
    io.on("connect", (socket: Record<string, any>) => {
        socket.on("chat-message", (msg: Record<string, any>) => {
            io.emit("chat-message", msg);
            console.log(msg)
        })

    })

    // res.socket.server.io = io;
    // res.end();
}