import http, { Server } from "http";
import WebSocket from "ws";
import express from "express";
//Express를 import 하고, express 어플리케이션을 구성하고

const app = express();

console.log("hello");
//pug로 view 엔진을 설정
app.set('view engine', "pug");
//
app.set("views", __dirname + "/views");

//유저가 public으로 가게되면 __dirname + "/public" 폴더를 보여줌
//유저에게 공유되는 Frontend 코드
app.use("/public", express.static(__dirname + "/public")); 

//express로 views를 설정해주고 render 함
app.get("/", (_,res) => res.render("home"));
//어떤 경로로 들어오던 root로 보내버리기
app.get("/*", (_,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http:localhost:3000`);
//app.listen(3000, handleListen);

//같은 포트에서 http서버 webSocket 서버 둘다 돌릴수있다. (http서버위에 웹소켓서버)
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
//connection이 이루어지면 작동. 파라미터에 는 브라우저와 서버간의 연결이 전달

const sockets = [];

//wss는 서버전체를 위한
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    //새로운 브라우저가 들어올때마다 아래항목 실행
    //console.log(socket); //backend의 소켓
    socket.on("close", () => console.log("Disconnected from the Browser"));
    socket.on("message", msg => {
        const message = JSON.parse(msg.toString('utf-8'));
        console.log(message.type);
        switch(message.type) {
            case "new_message" : 
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}:${message.payload}`)); //브라우저로 데이터 
                break;
            case "nickname" :
                socket["nickname"] = message.payload;
                break;
        }
        
    });
});

server.listen(3000, handleListen);