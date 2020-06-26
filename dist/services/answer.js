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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = void 0;
const OPTION_QUERY = "SELECT id, question_id, is_correct from options where id=$1";
const INSERT_USER_ANSWER = "INSERT INTO user_answer (user_id, question_id, point) VALUES ($1, $2, $3)";
class OptionNotMatchQuestion extends Error {
    constructor(...params) {
        super(...params);
    }
}
class SubmissionService {
    constructor(dbpool) {
        this.submitAnswer = (req) => __awaiter(this, void 0, void 0, function* () {
            const verified = yield this.verifyAnswer(req);
            const { userId } = req;
            const { questionId, correct } = verified;
            yield this.updateUserAnswer(userId, questionId, correct ? 100 : 0);
            return verified;
        });
        /**
         * not ideal definition:
         * point is a derived value
         */
        this.updateUserAnswer = (userEmail, questionId, point) => __awaiter(this, void 0, void 0, function* () {
            // user_answer table
            // verify user id
            this.pool.query(INSERT_USER_ANSWER, [userEmail, questionId, point]);
        });
        this.verifyAnswer = (request) => __awaiter(this, void 0, void 0, function* () {
            const { questionId, answeredOptionId } = request;
            try {
                const result = yield this.pool.query(OPTION_QUERY, [answeredOptionId]);
                const option = result.rows[0];
                if (questionId !== option.question_id) {
                    throw new OptionNotMatchQuestion();
                }
                return {
                    questionId,
                    answeredOptionId,
                    correct: option.is_correct,
                };
            }
            catch (e) {
                throw new Error(`failed to verify option ${answeredOptionId}: ${e}`);
            }
        });
        this.pool = dbpool;
    }
}
exports.SubmissionService = SubmissionService;
exports.default = SubmissionService;
//# sourceMappingURL=answer.js.map