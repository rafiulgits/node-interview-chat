Startup.Loaders.log = () => {
  if (sessionStorage.getItem("user") === null) {
    alert("you are not logged in");
    window.location.replace("/");
  }
};

Startup.Binders.onWriteMessage = () => {
  $("#conversation-form").submit((e) => {
    e.preventDefault();
    let value = $("#input-message").val();
    if (value === "") {
      return;
    }
    let message = {
      username: user.name,
      body: value,
      time: new Date().toLocaleString(),
    };
    socket.emit(NewMessage, message);
    $("#input-message").val("");
    return false;
  });
};

Startup.Binders.onLeaveRoom = () => {
  $("#leave-chat").text(`${user.name} Leave`);
  $("#leave-chat").on("click", (event) => {
    sessionStorage.clear();
    try {
      socket.disconnect();
    } catch (err) {
      window.location.replace("/");
    }
  });
};

Startup.Binders.placeProblemCreateForm = () => {
  $("#problem-list").append(
    $("<form>")
      .attr("id", "add-problem-form")
      .attr("action", "")
      .submit((event) => Handlers.Problem.create(event))
      .append(
        $("<input>")
          .attr("id", "input-new-problem")
          .attr("type", "text")
          .attr("class", "form-control")
          .attr("placeholder", "Your Problem"),
        $("<textarea>")
          .attr("class", "form-control")
          .attr("id", "input-problem-test-cases")
          .attr("placeholder", "Problem Test Cases"),
        $("<button>")
          .attr("class", "btn btn-success btn-sm")
          .text("Add Problem")
      )
  );
};

Startup.Binders.placeRoomDismissButton = () => {
  $("#room-actions").append(
    $("<button>")
      .addClass("btn btn-danger btn-sm m-2")
      .text("Dismiss Room")
      .click((event) => {
        socket.emit(RoomDismiss, "");
      })
  );
};
