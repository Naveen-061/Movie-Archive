const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/db");
const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");
const authenticateToken = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
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

/*
  Protected test route.
  This route only works when
  a valid JWT is provided.
*/
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

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );
  }
}

startServer();