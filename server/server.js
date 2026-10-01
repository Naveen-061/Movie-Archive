const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/db");
const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");
const authenticateToken = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          "Origin not allowed by CORS."
        )
      );
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message:
      "Movie Archive API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message:
      "Backend is healthy",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/watchlist",
  watchlistRoutes
);

app.get(
  "/api/auth/me",
  authenticateToken,
  (req, res) => {
    res.json({
      success: true,
      message:
        "Authentication is working.",
      user: req.user,
    });
  }
);

async function startServer() {
  try {
    await connectDatabase();

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `Server running on port ${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );
  }
}

startServer();