const socket = io("http://localhost:3000");
const messageBody = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const gifInput = document.getElementById("gif-search");
const searchButton = document.getElementById("search-button");
const results = document.getElementById("results");

setTimeout(() => {
    const name = prompt("Please enter your name");
    appendMessage("You joined the chat");
    socket.emit("new-user", name);
}, 700);

// socket.on("chat-message", (data) => {
//     appendMessage(`${data.name}: ${data.message}`);
// });

socket.on("user-connected", (name) => {
    appendMessage(`${name} joined the Chat`);
});

socket.on("user-disconnected", (name) => {
    appendMessage(`${name} left the Chat`);
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", message);
    messageInput.value = "";
});

function appendMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageBody.append(messageElement);
}

socket.on("gif-to-chat", (gif) => {
    appendMessage(gif.name);
    //console.log("gif", gif);
    appendGif(gif.gif);
});
function appendGif(gif) {
    const imgElement = document.createElement("img");
    imgElement.src = gif;
    messageBody.append(imgElement);
    setTimeout(() => {
        messageBody.scrollTop = 1000000;
    }, 500);
}

searchButton.addEventListener("click", async () => {
    console.log("gifinput", gifInput.value);

    const res = await axios.get("https://api.giphy.com/v1/gifs/search", {
        params: {
            api_key: "NyxW6CQ2aHo036hu9Pasybcyx6KYh8Hr",
            q: gifInput.value,
            limit: 10,
            //offset : this.state.offset
        },
    });
    console.log("res", res.data);
    results.style.visibility = "visible";
    results.innerHTML = "";
    res.data.data.forEach((gif) => {
        results.innerHTML += `<img src="${gif.images.fixed_height.url}"/>`;
    });
});

results.addEventListener("click", (event) => {
    console.log("event", event);
    socket.emit("gif-to-chat", event.target.currentSrc);
});

console.log("axios", axios);
