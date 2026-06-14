const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { name, email, password } = req.body;

  // temporary demo user
  const user = {
    id: 1,
    name,
    email,
    role: "patient",
  };

  const token = jwt.sign(user, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.json(user);
}

async function login(req, res) {
  const { email } = req.body;

  const user = {
    id: 1,
    email,
    role: "patient",
  };

  const token = jwt.sign(user, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.json(user);
}

async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.json({
    message: "Logged out",
  });
}

async function me(req, res) {
  return res.json(req.user);
}

module.exports = {
  register,
  login,
  logout,
  me,
};
