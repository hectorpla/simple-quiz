const INSERT_USER = "INSERT INTO contestuser (email) VALUES ($1)";
const USER_POINTS_QUERY = "SELECT SUM(point) as total_point FROM user_answer WHERE user_id=$1";

export type UserRegisterConfirmation = {
  email: string | void;
};

export type UserPointResponse = {
  email: string,
  point: number
}

export class UserService {
  pool: any;
  constructor(dbpool) {
    this.pool = dbpool;
  }

  addUser = async (email: string): Promise<UserRegisterConfirmation> => {
    // obmit email verification here
    try {
      await this.pool.query(INSERT_USER, [email]);
      return {
        email,
      };
    } catch (e) {
      throw new Error(`failed to register user ${e}`);
    }
  };

  getUserPoints = async (email: string): Promise<UserPointResponse> => {
    const totalPoint = (await this.pool.query(USER_POINTS_QUERY, [email])).rows[0].total_point;
    // console.log(`getUserPoints... fetched`)
    return {
      email,
      point: totalPoint
    }
  }
}
