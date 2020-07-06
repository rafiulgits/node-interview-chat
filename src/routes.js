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
  var requestedUser = req.body;
  if (requestedUser === null) {
    res.writeHead(400, {});
    res.write("no request body");
    return res.end();
  }
  var user = Users.get(requestedUser.name);
  if (user === null) {
    res.writeHead(401, {});
    res.write("invalid user name");
    return res.end();
  }
  if (user.password !== requestedUser.password) {
    res.writeHead(401, {});
    res.write("incorrect password");
    return res.end();
  }
  user.active = true;
  Users.update(user);
  res.writeHead(200, {});
  res.write(JSON.stringify(user));
  return res.end();
});

routes.post("/entry", (req, res) => {
  if (Users.legth() === 0) {
    addServerItself();
  }
  var requestedUser = req.body;
  if (requestedUser === null) {
    res.writeHead(400, {});
    res.write("no request body");
    return res.end();
  }
  if (Users.get(requestedUser.name)) {
    res.writeHead(400, {});
    res.write("a user already exists with that name");
    return res.end();
  }
  if (Users.isOnlyServerExists()) {
    if (requestedUser.type.toLowerCase() === "candidate") {
      res.writeHead(403, {});
      res.write("only an interviewer can create a meeting room");
      return res.end();
    } else {
      requestedUser.type = "Creator";
      requestedUser.time = new Date().toLocaleString();
      requestedUser.active = true;
      Users.add(requestedUser);
      res.writeHead(200, {});
      res.write(JSON.stringify(requestedUser));
      return res.end();
    }
  }
  requestedUser.time = new Date().toLocaleString();
  requestedUser.active = true;
  Users.add(requestedUser);
  res.writeHead(200, {});
  res.write(JSON.stringify(requestedUser));
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
