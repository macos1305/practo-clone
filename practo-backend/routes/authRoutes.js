const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email } = req.body;

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
});

router.post("/login", async (req, res,next) => {
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
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.json({
    message: "Logged out",
  });
});

router.get("/me", (req, res) => {
  return res.json({
    message: "User route working",
  });
});

module.exports = router;
