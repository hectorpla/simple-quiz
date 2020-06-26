import express from "express";
const bodyParser = require("body-parser");

import { QuestionService } from "./services/questions";
import { SubmissionService } from "./services/answer";
import { UserService } from "./services/user";

const jsonParser = bodyParser.json();
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "my_database",
  port: 54320,
});

// deps
const userService = new UserService(pool);
const questionService = new QuestionService(pool);
const submissionService = new SubmissionService(pool);

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the hehe!");
});

app.post("/user/add", jsonParser, async (req, res) => {
  const { email } = req.body;
  try {
    res.send(await userService.addUser(email));
  } catch (e) {
    console.log(`adding user error: ${e}`);
    res.status(400).send(JSON.stringify(e));
  }
});

app.post("/user/points", jsonParser, async (req, res) => {
  const { email } = req.body;
  try {
    res.send(await userService.getUserPoints(email));
  } catch (e) {
    res.status(500);
  }
});

app.get("/questions/:id", async (req, res) => {
  const id = req.params.id;
  const question = await questionService.getQuestion(parseInt(id));
  res.send(question);
});

app.post("/submit", jsonParser, async (req, res) => {
  res.send(await submissionService.submitAnswer(req.body));
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
