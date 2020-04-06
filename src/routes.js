import { Router } from "express";
import { runJavaScript, runPython } from "./core/runner";
import { Users, Problems } from "./core/db";
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

routes.post("/login", (req, res) => {
  if (Users.legth() === 0) {
    addServerItself();
  }
  var user = req.body;
  if (user === null) {
    res.writeHead(400, {});
    res.write("no body");
    return res.end();
  }

  if (Users.get(user.name) !== null) {
    res.writeHead(400, {});
    res.write("a user already exists with this name");
    return res.end();
  }

  if (Users.isOnlyServerExists()) {
    if (user.type.toLowerCase() === "candidate") {
      res.writeHead(400, {});
      res.write("only an interviewer can create a room conversation");
      return res.end();
    } else if (user.type.toLowerCase() === "interviewer") {
      user.type = "Creator";
      user.time = new Date().toLocaleDateString();
      Users.add(user);
      res.writeHead(200, {});
      res.write(JSON.stringify(user));
      return res.end();
    } else {
      res.writeHead(400, {});
      res.write("");
      return res.end();
    }
  }
  user.time = new Date().toLocaleDateString();
  Users.add(user);
  res.writeHead(200, {});
  res.write(JSON.stringify(user));
  return res.end();
});

const addServerItself = () => {
  Users.add({
    id: "server",
    name: "server",
    type: "server",
    time: new Date().toLocaleDateString(),
  });
};

export default routes;
