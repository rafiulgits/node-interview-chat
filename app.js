import express from "express";
import socketio from "socket.io";
import http from "http";
import Chat from "./src/core/chat";
import BodyParser from "body-parser";
import routes from "./src/routes";

let app = express();
app.use(BodyParser.json());
app.use("/", routes);

let server = http.createServer(app);

export var io = new socketio(server);
export const Room = "room";

const Connection = "connection";

// manage chatroom entry
io.of(Room).on(Connection, (socket) => {
  let chat = new Chat(socket);
  chat.loop();
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
