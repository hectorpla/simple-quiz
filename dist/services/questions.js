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
exports.QuestionService = void 0;
const ALL_QUESTION_IDS = "SELECT id FROM question ORDER BY id";
const QUESTION_QUERY = "SELECT id, text_en FROM question WHERE id=$1;";
const OPTION_QUERY = "SELECT id, text_en, is_correct FROM options WHERE question_id=$1";
class QuestionService {
    constructor(dbpool) {
        this.getAllQuestionIds = () => __awaiter(this, void 0, void 0, function* () {
            this.questionIds = (yield this.pool.query(ALL_QUESTION_IDS)).rows.map((row) => row.id);
        });
        this.findNextQuestion = (questionId) => {
            const index = this.questionIds.indexOf(questionId);
            if (index === this.questionIds.length - 1) {
                return null;
            }
            return this.questionIds[index + 1];
        };
        this.getQuestion = (questionId) => __awaiter(this, void 0, void 0, function* () {
            const questionPromise = this.pool.query(QUESTION_QUERY, [questionId]);
            const optionsPromise = this.pool.query(OPTION_QUERY, [questionId]);
            try {
                const [questionResult, optionResult] = yield Promise.all([
                    questionPromise,
                    optionsPromise,
                ]);
                if (questionResult.rows.length == 0) {
                    throw new Error(`Question ${questionId} not found`);
                }
                const question = questionResult.rows[0];
                const options = optionResult.rows;
                return {
                    questionId: question.id,
                    nextQuestionId: this.findNextQuestion(question.id),
                    questionText: question.text_en,
                    options: options.map((optionRow) => ({
                        id: optionRow.id,
                        text: optionRow.text_en,
                        isCorrect: optionRow.is_correct,
                    })),
                };
            }
            catch (e) {
                throw new Error(`failed to get question ${questionId}: ${e}`);
            }
        });
        this.pool = dbpool;
        this.getAllQuestionIds();
    }
}
exports.QuestionService = QuestionService;
//# sourceMappingURL=questions.js.map