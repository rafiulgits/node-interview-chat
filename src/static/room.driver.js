var Startup = {
  isLoaded: false,
  Loaders: {},
  Binders: {},
};
var user;
$(() => {
  // startup loaders
  Startup.Loaders.log();
  Startup.isLoaded = true;
  // binders
  Startup.Binders.onWriteMessage();
  Startup.Binders.onLeaveRoom();
  let _user = JSON.parse(sessionStorage.getItem("user"));
  if (_user.type === "Creator") {
    Startup.Binders.placeProblemCreateForm();
    Startup.Binders.placeRoomDismissButton();
    return;
  }
});
user = JSON.parse(sessionStorage.getItem("user"));

var DOM = {
  Conversation: {},
  Problem: {},
  Peoples: {},
};

var Handlers = {
  Problem: {},
};

var Builders = {
  Form: {},
  Block: {},
};

let API = {};

var socket = io.connect("/room");
if (socket === null) {
  alert("connection error");
  window.location.replace("/");
}

const ChatEntry = "chat entry";
const NewMessage = "message";
const Disconnect = "disconnect";
const PreviousMessages = "previous messages";
const ActiveUsers = "active users";
const PinnedProblems = "pinned problems";
const AddProblem = "add problem";
const AddSolution = "add solution";
const UpdateProblem = "update problem";
const RoomDismiss = "room dismiss";

socket.emit(ChatEntry, user);

// load from API
socket.on(PreviousMessages, (arr) => {
  arr.forEach((msg) => {
    DOM.Conversation.message(msg);
  });
  scrollToTop("#message-list");
});

socket.on(NewMessage, (msg) => {
  DOM.Conversation.message(msg);
  scrollToTop("#message-list");
});

socket.on(Disconnect, () => {
  alert("you are disconnected");
  window.location.replace("/");
});

socket.on(ActiveUsers, (users) => {
  $("#active-user-list").empty();
  users.forEach((user) => {
    DOM.Peoples.active(user);
  });
});

// receive new problem
socket.on(AddProblem, (msg) => {
  DOM.Problem.create(msg);
});

// receive a new solution of a problem
socket.on(AddSolution, (msg) => {
  DOM.Problem.solution(msg.problemId, msg.solution);
});

socket.on(PinnedProblems, (arr) => {
  arr.forEach((problem) => {
    DOM.Problem.create(problem);
    if (problem.solutions.length > 0) {
      problem.solutions.forEach((solution) => {
        DOM.Problem.solution(problem.id, solution);
      });
    }
  });
});

socket.on(UpdateProblem, (msg) => {
  DOM.Problem.update(msg);
});
