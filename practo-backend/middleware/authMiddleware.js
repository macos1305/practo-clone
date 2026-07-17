const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");

async function authenticate(req, res, next) {
  try {
    // Read token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await authRepository.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove password before attaching user
    const { password, ...userWithoutPassword } = user;

    req.user = userWithoutPassword;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = authenticate;
