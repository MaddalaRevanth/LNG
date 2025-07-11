import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("TOKEN MISSING");
      return res.status(400).json({ message: "token is not found" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    console.log("TOKEN VERIFY ERROR", error);
    return res.status(500).json({ message: `isauth error ${error}` });
  }
};

export default isAuth;
