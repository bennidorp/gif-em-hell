const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const database = require("../database/database.js");

app.use(compression());

const cookieSession = require("cookie-session");

const cookieSessionMiddleware = cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secret: "sdvbjksdbvjhzsb",
});

const csurf = require("csurf");
app.use(csurf());
app.use(function (request, response, next) {
    response.cookie("mytoken", request.csrfToken());
    next();
});

app.use(express.json());
app.use(compression());

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith(
                process.env.NODE_ENV === "production"
                //LINK!!!
                    ? "https://??????.herokuapp.com/"
                    : "http://localhost:3000"
            )
        ),
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", async function (socket) {
    const userId = socket.request.session.user.id;
    console.log("A browser connected with user id:", userId);

    const lastMessages = await database.getLastMessages();
    socket.emit("chatMessages", lastMessages.rows);

    /
    socket.on("newMessage", async (message_text) => {
        console.log(message_text);
        
        const result = await database.addMessage(userId, message_text);
        const message_id = result.rows[0].id;
        

        const user = await database.getUserById(userId);
        const message = {
            ...user.rows[0],
            message_id,
            message_text,
        };

        io.emit("chatMessage", [message]);
    });
});


app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
