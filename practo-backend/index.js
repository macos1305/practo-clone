const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Global Error Handler (always after routes)
app.use(errorHandler);

// PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

