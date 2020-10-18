import JWT from "jsonwebtoken";

export const checkIFUserIsLoggedIn = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.length > 0) {
      const token = req.headers.authorization.split(" ")[1];
      const payload = await JWT.verify(token, process.env.secretKey);
      req.decoded = payload;
      next();
    } else {
      res.status(401).json({
        message: "Auth token not in attached in request header",
      });
    }
  } catch (err) {
    res.status(400).json({ message: `Error with token. ${err.message}` });
  }
};
