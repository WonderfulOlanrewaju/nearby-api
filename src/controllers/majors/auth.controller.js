import { createUser, loginUser } from "../utils/User.util";
import { handleResError, handleResSuccess } from "../utils/response.util";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { UpdateLastLocation } from "../utils/updateLastLocation";
dotenv.config();
const { secretKey } = process.env;

export const SignupController = async (req, res) => {
  try {
    let userDetails = req.body;
    let ipInfo = { req };
    let { err, user } = await createUser(userDetails);
    if (err) handleResError(res, err, 400);
    else {
      let { _id, email, isActive } = user;
      await UpdateLastLocation(ipInfo, _id);
      let options = {
        expiresIn: "12h",
        issuer: "nearby-hasher",
      };
      let token = await JWT.sign({ _id, email, isActive }, secretKey, options);
      handleResSuccess(res, `Account created!`, token, 201);
    }
  } catch (err) {
    handleResError(res, err, 400);
  }
};

export const LoginController = async (req, res) => {
  try {
    let ipInfo = { req };
    let { err, token } = await loginUser(req.body);
    let user = await User.findOne({ email: req.body.email });
    await UpdateLastLocation(ipInfo, user._id);
    if (err) handleResError(res, err, 400);
    else handleResSuccess(res, "login successful", token, 201);
  } catch (err) {
    handleResError(res, err, 400);
  }
};

export const FetchAUserController = async (req, res) => {
  try {
    console.log(req.decoded);
    const { ipInfo } = req;
    let id = req.decoded._id;
    let updatedUser = await UpdateLastLocation(ipInfo, id);
    handleResSuccess(res, "user fetched", updatedUser, 201);
  } catch (err) {
    handleResError(res, err, 400);
  }
};
