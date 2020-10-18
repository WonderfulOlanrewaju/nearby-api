import { User } from "../../models/User.model";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { secretKey } = process.env;

export const createUser = async (userDetails) => {
  try {
    let foundExistingUser = await User.findOne({ email: userDetails.email });
    let err;
    let user;
    if (foundExistingUser && foundExistingUser !== null) {
      err = {
        message: "account already exist. Login instead!",
      };
      return { err, user };
    } else {
      let pwSalt = await bcrypt.genSaltSync(10);
      let pwHash = await bcrypt.hashSync(userDetails.password, pwSalt);
      let registeredUser = await User.create({
        ...userDetails,
        password: pwHash,
      });
      user = registeredUser.toJSON();
      return { err, user };
    }
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const loginUser = async (loginDetails) => {
  try {
    let foundExistingUser = await User.findOne({
      email: loginDetails.email,
    });
    if (foundExistingUser) {
      let correctPW = bcrypt.compareSync(
        loginDetails.password,
        foundExistingUser.password
      );
      console.log(correctPW);
      if (!correctPW)
        return {
          err: {
            message: "incorrect password",
          },
        };
      else {
        let { _id, email, isActive } = foundExistingUser;
        let options = {
          expiresIn: "12h",
          issuer: "meetin-hasher",
        };
        let token = await JWT.sign(
          { _id, email, isActive },
          secretKey,
          options
        );
        return { token };
      }
    } else if (foundExistingUser === null) {
      let err = { message: "User does not exist. Signup instead!" };
      return { err };
    }
  } catch (err) {
    return { err };
  }
};
