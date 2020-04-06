import { Users, Messages, Problems } from "./db";
import { Room } from "../../app";
import { io } from "../../app";

const ChatEntry = "chat entry";
const NewMessage = "message";
const Disconnect = "disconnect";
const PreviousMessages = "previous messages";
const ActiveUsers = "active users";
const AddProblem = "add problem";
const AddSolution = "add solution";
const PinnedProblems = "pinned problems";
const UpdateProblem = "update problem";

class Chat {
  constructor(socket) {
    this.socket = socket;
  }

  loop() {
    // socket event loop
    this.socket.on(ChatEntry, (msg) => {
      this.onChatEntry(msg);
    });

    this.socket.on(NewMessage, (msg) => {
      this.onMessage(msg);
    });

    this.socket.on(AddProblem, (msg) => {
      this.onAddProblem(msg);
    });

    this.socket.on(AddSolution, (msg) => {
      this.onAddSolution(msg);
    });

    this.socket.on(UpdateProblem, (msg) => {
      this.onUpdateProblem(msg);
    });

    this.socket.on(Disconnect, () => {
      this.onDisconnect();
    });
  }

  onChatEntry(msg) {
    let user = Users.get(msg.name);
    this.user = user;
    if (user === null) {
      this.dismiss();
      return;
    }
    user.id = this.socket.client.id;
    Users.update(user);
    this.socket.emit(PreviousMessages, Messages.getAll());
    this.socket.emit(PinnedProblems, Problems.getAll());
    this.userJoinNotification();
  }

  userJoinNotification() {
    let notification = {
      username: "server",
      body: `${this.user.name} joined as ${this.user.type}`,
      time: new Date().toLocaleString(),
    };
    Messages.add(notification);
    io.of(Room).emit(NewMessage, notification);
    io.of(Room).emit(ActiveUsers, Users.getAll());
  }

  onMessage(msg) {
    Messages.add(msg);
    io.of(Room).emit(NewMessage, msg);
  }

  onAddProblem(msg) {
    Problems.add(msg);
    io.of(Room).emit(AddProblem, msg);
  }

  onAddSolution(msg) {
    Problems.addSolutionOn(msg.problemId, msg.solution);
    io.of(Room).emit(AddSolution, msg);
  }

  onUpdateProblem(msg) {
    Problems.update(msg);
    io.of(Room).emit(UpdateProblem, msg);
  }

  onDisconnect() {
    try {
      let notification = {
        username: "server",
        time: new Date().toLocaleString(),
        body: `${this.user.type} ${this.user.name} leave`,
      };
      Users.remove(this.user);
      Messages.add(notification);
      if (Users.isOnlyServerExists()) {
        this.clearDataBase();
        console.log("chat room is closing...");
        io.of(Room).emit(Disconnect);
        return;
      }
      io.of(Room).emit(NewMessage, notification);
      io.of(Room).emit(ActiveUsers, Users.getAll());
      console.log("disconnected client : " + this.user.id);
    } catch (err) {}
    try {
      this.dismiss();
    } catch (err) {}
  }

  clearDataBase() {
    Users.clear();
    Messages.clear();
    Problems.clear();
  }

  dismiss() {
    try {
      this.socket.disconnect();
    } catch {
      this.socket = null;
    }
  }
}

export default Chat;
