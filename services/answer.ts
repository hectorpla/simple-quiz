const OPTION_QUERY =
  "SELECT id, question_id, is_correct from options where id=$1";

const INSERT_USER_ANSWER =
  "INSERT INTO user_answer (user_id, question_id, point) VALUES ($1, $2, $3)";

type SubmitRequest = {
  userId: string;
  questionId: number;
  answeredOptionId: number;
};

type SubmissionConfirmation = {
  questionId: number;
  answeredOptionId: number;
  correct: boolean;
};

class OptionNotMatchQuestion extends Error {
  constructor(...params) {
    super(...params);
  }
}

export class SubmissionService {
  pool: any;
  constructor(dbpool) {
    this.pool = dbpool;
  }

  submitAnswer = async (req: SubmitRequest) => {
    const verified = await this.verifyAnswer(req);
    const { userId } = req;
    const { questionId, correct } = verified;

    await this.updateUserAnswer(userId, questionId, correct ? 100 : 0);

    return verified;
  };

  /**
   * not ideal definition:
   * point is a derived value
   */
  updateUserAnswer = async (
    userEmail: string,
    questionId: number,
    point: number
  ) => {
    // user_answer table
    // verify user id
    this.pool.query(INSERT_USER_ANSWER, [userEmail, questionId, point]);
  };

  verifyAnswer = async (
    request: SubmitRequest
  ): Promise<SubmissionConfirmation> => {
    const { questionId, answeredOptionId } = request;

    try {
      const result = await this.pool.query(OPTION_QUERY, [answeredOptionId]);
      const option = result.rows[0];

      if (questionId !== option.question_id) {
        throw new OptionNotMatchQuestion();
      }

      return {
        questionId,
        answeredOptionId,
        correct: option.is_correct,
      };
    } catch (e) {
      throw new Error(`failed to verify option ${answeredOptionId}: ${e}`);
    }
  };
}

export default SubmissionService;
