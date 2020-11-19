const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  //   console.log(req.method, req.path);
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    req.isAuth = false;
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return console.log(err);
    }
    // console.log(user);
    req.isAuth = true;
    req.userId = user.userId;
    next();
  });
};

module.exports = isAuth;
