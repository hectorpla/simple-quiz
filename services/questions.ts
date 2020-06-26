const ALL_QUESTION_IDS = "SELECT id FROM question ORDER BY id";
const QUESTION_QUERY = "SELECT id, text_en FROM question WHERE id=$1;";
const OPTION_QUERY =
  "SELECT id, text_en, is_correct FROM options WHERE question_id=$1";

type Option = {
  id: number,
  text: string;
  isCorrect: boolean;
};

type QuestionResponse = {
  questionText: string;
  options: Option;
  questionId: number;
  nextQuestionId: number | void;
};

export class QuestionService {
  pool: any;
  questionIds: number[];

  constructor(dbpool) {
    this.pool = dbpool;
    this.getAllQuestionIds();
  }

  getAllQuestionIds = async () => {
    this.questionIds = (await this.pool.query(ALL_QUESTION_IDS)).rows.map(
      (row) => row.id
    );
  };

  findNextQuestion = (questionId: number): number | void => {
    const index = this.questionIds.indexOf(questionId);
    if (index === this.questionIds.length - 1) {
      return null;
    }
    return this.questionIds[index + 1];
  };

  getQuestion = async (questionId: number): Promise<QuestionResponse> => {
    const questionPromise = this.pool.query(QUESTION_QUERY, [questionId]);
    const optionsPromise = this.pool.query(OPTION_QUERY, [questionId]);

    try {
      const [questionResult, optionResult] = await Promise.all([
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
    } catch (e) {
      throw new Error(`failed to get question ${questionId}: ${e}`);
    }
  };
}

export default QuestionResponse;
