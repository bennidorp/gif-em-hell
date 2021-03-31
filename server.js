const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
app.use(express.static("public"));

const users = {};

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
    console.log("socket has connected", socket.id);
    socket.on("new-user", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-connected", name);
    });
    socket.on("send-chat-message", (message) => {
        socket.broadcast.emit("chat-message", {
            message: message,
            name: users[socket.id],
        });
    });
    socket.on("gif-to-chat", (gif) => {
        io.emit("gif-to-chat", {
            gif: gif,
            name: users[socket.id],
        });
    });
    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(process.env.PORT || 3000, function () {
    console.log("I'm listening.");
});
