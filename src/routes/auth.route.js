import express from "express";
export const router = express.Router();
import {
  FetchAUserController,
  LoginController,
  SignupController,
} from "../controllers/majors/auth.controller";
import { checkIFUserIsLoggedIn } from "../controllers/middlewares/auth.middleware";

router.route("/login").post(LoginController);

router.route("/register").post(SignupController);

router.route("/user").get(checkIFUserIsLoggedIn, FetchAUserController);
