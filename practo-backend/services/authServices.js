const bcrypt = require("bcryptjs");
const authRepository = require("../repositories/authRepository");

async function register({ name, email, password, role = "PATIENT" }) {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user;
}

async function login({ email, password }) {
  // Find user by email
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare entered password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return user;
}

module.exports = {
  register,
  login,
};
