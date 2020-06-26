"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require("body-parser");
const questions_1 = require("./services/questions");
const answer_1 = require("./services/answer");
const user_1 = require("./services/user");
const jsonParser = bodyParser.json();
const { Pool, Client } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "my_database",
    port: 54320,
});
// deps
const userService = new user_1.UserService(pool);
const questionService = new questions_1.QuestionService(pool);
const submissionService = new answer_1.SubmissionService(pool);
const app = express_1.default();
const port = 3000;
app.get("/", (req, res) => {
    res.send("The sedulous hyena ate the hehe!");
});
app.post("/user/add", jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        res.send(yield userService.addUser(email));
    }
    catch (e) {
        console.log(`adding user error: ${e}`);
        res.status(400).send(JSON.stringify(e));
    }
}));
app.post("/user/points", jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        res.send(yield userService.getUserPoints(email));
    }
    catch (e) {
        res.status(500);
    }
}));
app.get("/questions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const question = yield questionService.getQuestion(parseInt(id));
    res.send(question);
}));
app.post("/submit", jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield submissionService.submitAnswer(req.body));
}));
app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=server.js.map