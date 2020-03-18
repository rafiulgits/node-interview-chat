import Express from "express";
import path from "path";
import http from "http";

const app = Express();

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/templates/index.html"));
});

app.listen(4000);
