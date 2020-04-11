DOM.Conversation.message = (msg) => {
  let messageBody = msg.body.split("#").join("");
  let fullMessage = markdown(`###### ${msg.username}\n  ${messageBody}`);

  $("#message-list").append($("<li>").html(fullMessage));
  // highlightCode();
};

DOM.Peoples.active = (user) => {
  $("#active-user-list").append(
    $("<li>").append(user.name, $("<br>"), $("<span>").text(user.type))
  );
};

DOM.Problem.create = (problem) => {
  let card = $("<div>");

  let header = $("<div>")
    .addClass("card-header")
    .append(
      $("<a>")
        .attr("class", "card-link")
        .attr("data-toggle", "collapse")
        .attr("aria-expanded", "false")
        .attr("href", `#${problem.id}`)
        .attr("id", `problem-id-${problem.id}`)
        .text(`${problem.question}`)
    );
  header.append(
    $("<button>")
      .attr("class", "btn btn-sm btn-dark ml-2 disabled")
      .text(`@${problem.author}`)
  );

  if (problem.author === user.name) {
    header.append(
      $("<button>")
        .attr("class", "btn btn-sm btn-primary ml-2")
        .text("edit")
        .click((event) => {
          Handlers.Problem.update(event, problem);
        })
    );
  }

  let solutionForm = Builders.Form.solution(problem);

  let sampleCaseBlock = Builders.Block.sampleCase(problem.sampleTestCases);
  let body = $("<div>")
    .attr("id", `${problem.id}`)
    .attr("class", "collapse hide")
    .attr("data-parent", "#problem-list")
    .append(
      $("<div>")
        .attr("class", "card-body")
        .append(sampleCaseBlock)
        .append(
          $("<ul>")
            .attr("class", "list-group")
            .attr("id", `solutions-${problem.id}`),
          solutionForm
        )
    );
  card.append(header, body);
  $("#problem-list").prepend(card);
};

DOM.Problem.solution = (problemId, solution) => {
  let preview = $("<li>")
    .attr("class", "list-group-item")
    .append(
      //Code
      $("<pre>")
        .attr("class", "prettyprint")
        .append(
          $("<code>")
            .text(solution.code)
            .attr("class", `language-${solution.lang}`)
        ),
      // Meta
      $("<small>").text(
        `${solution.lang} by ${solution.author} at ${solution.time}`
      ),
      // Executor
      $("<button>")
        .text("Run")
        .attr("class", "btn btn-success btn-sm float-right")
        .click((event) => {
          runCodeScript(solution.lang, solution.code, problemId);
        })
    );

  $(`#solutions-${problemId}`).append(preview);
  highlightCode();
};

DOM.Problem.update = (problem) => {
  $(`#problem-id-${problem.id}`).text(`${problem.question}`);
};
