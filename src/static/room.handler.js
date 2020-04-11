Handlers.Problem.create = (event) => {
  event.preventDefault();
  let question = $("#input-new-problem").val();
  question = question.trim();
  if (question === "") {
    alert("You should type any statement");
    return;
  }
  var sampleTestCases = $("#input-problem-test-cases").val();
  $("#input-problem-test-cases").val("");
  if (sampleTestCases === "") {
    sampleTestCases = null;
  } else {
    try {
      sampleTestCases = JSON.parse(sampleTestCases);
    } catch (err) {
      sampleTestCases = null;
    }
  }
  let problem = {
    id: generateRandomString(),
    question: question,
    time: new Date().toLocaleString(),
    sampleTestCases: sampleTestCases,
    author: user.name,
    solutions: [],
  };

  // broadcast this problem
  socket.emit(AddProblem, problem);

  $("#input-new-problem").val("");
};

Handlers.Problem.update = (event, problem) => {
  event.preventDefault();
  let updatedQuestion = prompt("Update", problem.question);
  if (updatedQuestion !== null) {
    problem.question = updatedQuestion;
    socket.emit(UpdateProblem, problem);
    alert("Updated");
  }
};

Handlers.Problem.solution = (event, problem) => {
  event.preventDefault();
  let code = $(`#${problem.id}-solution-code`).val();
  if (code === "") {
    alert("You must give a piece of code");
    return;
  }
  code = code.trim();
  let lang = $(`#${problem.id}-solution-lang`).val();
  $(`#${problem.id}-solution-code`).val("");

  let solution = {
    code: code,
    lang: lang,
    author: user.name,
    time: new Date().toLocaleString(),
  };
  socket.emit(AddSolution, { problemId: problem.id, solution });
};
