Builders.Form.solution = (problem) => {
  return $("<form>")
    .attr("id", `${problem.id}-solution-form`)
    .submit((event) => Handlers.Problem.solution(event, problem))
    .append(
      $("<textarea>")
        .attr("style", "width:100%;")
        .attr("class", "form-control")
        .attr("placeholder", "Your solution")
        .attr("id", `${problem.id}-solution-code`),

      $("<select>")
        .attr("class", "form-control")
        .attr("id", `${problem.id}-solution-lang`)
        .attr("style", "font-size:12px")
        .append(
          $("<option>").attr("value", "javascript").text("JavaScript"),
          $("<option>").attr("value", "python").text("Python")
        ),

      $("<button>").attr("class", "btn btn-primary btn-sm").text("Submit")
    );
};

Builders.Block.sampleCase = (sampleTestCases) => {
  if (sampleTestCases === null) {
    return $("<b>").text("no test case");
  }
  var tableHead = $("<thead>").append(
    $("<tr>").append($("<th>").text("Input"), $("<th>").text("Output"))
  );
  var tableBody = $("<tbody>");
  if (!Array.isArray(sampleTestCases)) {
    tableBody.append(
      $("<tr>").append(
        $("<td>").text(sampleTestCases.input),
        $("<td>").text(sampleTestCases.output)
      )
    );
  } else {
    sampleTestCases.forEach((item) => {
      tableBody.append(
        $("<tr>").append(
          $("<td>").text(item.input),
          $("<td>").text(item.output)
        )
      );
    });
  }

  return $("<table>")
    .addClass("table")
    .attr("style", "font-size:13px;")
    .append(tableHead, tableBody);
};
