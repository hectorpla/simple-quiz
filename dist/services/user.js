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
exports.UserService = void 0;
const INSERT_USER = "INSERT INTO contestuser (email) VALUES ($1)";
const USER_POINTS_QUERY = "SELECT SUM(point) as total_point FROM user_answer WHERE user_id=$1";
class UserService {
    constructor(dbpool) {
        this.addUser = (email) => __awaiter(this, void 0, void 0, function* () {
            // obmit email verification here
            try {
                yield this.pool.query(INSERT_USER, [email]);
                return {
                    email,
                };
            }
            catch (e) {
                throw new Error(`failed to register user ${e}`);
            }
        });
        this.getUserPoints = (email) => __awaiter(this, void 0, void 0, function* () {
            const totalPoint = (yield this.pool.query(USER_POINTS_QUERY, [email])).rows[0].total_point;
            // console.log(`getUserPoints... fetched`)
            return {
                email,
                point: totalPoint
            };
        });
        this.pool = dbpool;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.js.map