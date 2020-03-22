import { Users, Messages } from "./db";
import { Room } from "../../app";
import { io } from "../../app";

const ChatEntry = "chat entry";
const NewMessage = "message";
const Disconnect = "disconnect";
const PreviousMessages = "previous messages";
const ActiveUsers = "active users";

class Chat {
  constructor(socket) {
    this.socket = socket;
  }

  loop() {
    // socket event loop
    this.socket.on(ChatEntry, msg => {
      this.onChatEntry(msg);
    });

    this.socket.on(NewMessage, msg => {
      this.onMessage(msg);
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
    this.userJoinNotification();
  }

  userJoinNotification() {
    let notification = {
      username: "server",
      body: `${this.user.name} joined`,
      time: new Date().toLocaleString()
    };
    Messages.add(notification);
    io.of(Room).emit(NewMessage, notification);
    io.of(Room).emit(ActiveUsers, Users.getAll());
  }

  onMessage(msg) {
    Messages.add(msg);
    io.of(Room).emit(NewMessage, msg);
  }

  onDisconnect() {
    let notification = {
      username: "server",
      body: `${this.user.name} leave`,
      time: new Date().toLocaleString()
    };
    Users.remove(this.user);
    Messages.add(notification);
    io.of(Room).emit(NewMessage, notification);
    io.of(Room).emit(ActiveUsers, Users.getAll());
    console.log("disconnected client : " + this.user.id);
    this.dismiss();
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
