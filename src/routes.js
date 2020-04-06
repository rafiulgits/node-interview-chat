import { Router } from "express";
import { runJavaScript, runPython } from "./core/runner";
import { Problems } from "./core/db";
import path from "path";

let routes = Router();

const getTemplate = (name) => {
  return path.join(__dirname, `./templates/${name}.html`);
};

const getStaticFile = (file) => {
  return path.join(__dirname, `./static/${file}`);
};

routes.get("/", (req, res) => {
  res.sendFile(getTemplate("login"));
});

routes.get("/room", (req, res) => {
  res.sendFile(getTemplate("room"));
});

routes.get("/static/:file", (req, res) => {
  let file = req.params.file;
  res.sendFile(getStaticFile(file));
});

routes.post("/runtime/py", (req, res) => {
  let code = req.body.code;
  let problemId = req.body.problemId;
  var sampleCases = Problems.get(problemId).sampleTestCases;
  if (sampleCases === undefined) {
    sampleCases = null;
  }
  runPython(code, sampleCases, (err, result) => {
    if (err) {
      res.writeHead(400, {});
      res.write("runtime error");
      return res.end();
    }
    res.writeHead(200, {});
    res.write(JSON.stringify({ result: result }));
    return res.end();
  });
});

routes.post("/runtime/js", (req, res) => {
  let code = req.body.code;
  let problemId = req.body.problemId;
  var sampleCases = Problems.get(problemId).sampleTestCases;
  if (sampleCases === undefined) {
    sampleCases = null;
  }
  runJavaScript(code, sampleCases, (err, result) => {
    if (err) {
      res.writeHead(400, {});
      res.write("runtime error");
      return res.end();
    }
    res.writeHead(200, {});
    res.write(JSON.stringify({ result: result }));
    return res.end();
  });
});

export default routes;
