import express from "express";
import socketio from "socket.io";
import path from "path";
import http from "http";
import { Users } from "./src/core/db";
import Chat from "./src/core/chat";

export var app = express();
export var server = http.createServer(app);
export var io = new socketio(server);
export const Room = "room";

const Connection = "connection";

const getTemplate = name => {
  return path.join(__dirname, `src/templates/${name}.html`);
};

const getStaticFile = file => {
  return path.join(__dirname, `src/static/${file}`);
};

app.get("/", (req, res) => {
  res.sendFile(getTemplate("login"));
});

app.get("/room", (req, res) => {
  res.sendFile(getTemplate("room"));
});

app.get("/static/:file", (req, res) => {
  let file = req.params.file;
  res.sendFile(getStaticFile(file));
});

const handleLoginRequest = (socket, msg) => {
  if (Users.get(msg.name) !== null) {
    let response = {
      code: 400,
      user: null
    };
    socket.emit("login response", response);
    return;
  } else {
    var user = msg;
    user.time = new Date().toLocaleString();
    Users.add(user);
    let response = {
      code: 200,
      user: user
    };
    socket.emit("login response", response);
    return;
  }
};

// manage login
io.on(Connection, socket => {
  socket.on("login request", msg => {
    handleLoginRequest(socket, msg);
  });
});

// manage chatroom entry
io.of(Room).on(Connection, socket => {
  let chat = new Chat(socket);
  chat.loop();
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
