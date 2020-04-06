import express from "express";
import socketio from "socket.io";
import http from "http";
import { Users } from "./src/core/db";
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

// insert server itself as a user

const handleLoginRequest = (socket, msg) => {
  if (Users.get(msg.name) !== null) {
    let response = {
      code: 400,
      user: null,
    };
    socket.emit("login response", response);
    return;
  } else {
    var user = msg;
    user.time = new Date().toLocaleString();
    Users.add(user);
    let response = {
      code: 200,
      user: user,
    };
    socket.emit("login response", response);
    return;
  }
};

// manage login
io.on(Connection, (socket) => {
  socket.on("login request", (msg) => {
    handleLoginRequest(socket, msg);
  });
});

// manage chatroom entry
io.of(Room).on(Connection, (socket) => {
  let chat = new Chat(socket);
  chat.loop();
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
