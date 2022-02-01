const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`); //frontend의 소켓

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
    console.log("GOT THIS : ", message.data);
});

socket.addEventListener("close", ()=> {
    console.log("Disconnected from server");
});

//setTimeout(() => {
//    socket.send("hello from the browser");
//}, 1000);
function makeMassage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
};

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMassage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You : ${input.value}`;
    messageList.append(li);
    input.value = "";
});

nickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMassage("nickname", input.value));
    input.value = "";
})

