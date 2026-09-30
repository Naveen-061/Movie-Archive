const express = require("express");

const Watchlist = require("../models/Watchlist");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

/* ========================================
   GET WATCHLIST
======================================== */

router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const movies =
        await Watchlist.find({
          user: req.user.userId,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        movies,
      });
    } catch (error) {
      console.error(
        "Get watchlist error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch watchlist.",
      });
    }
  }
);

/* ========================================
   ADD TO WATCHLIST
======================================== */

router.post(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        movieId,
        title,
        poster,
        backdrop,
        description,
        year,
        releaseDate,
        genreIds,
        genre,
        rating,
        popularity,
        voteCount,
      } = req.body;

      if (
        !movieId ||
        !title
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Movie ID and title are required.",
        });
      }

      const existingMovie =
        await Watchlist.findOne({
          user: req.user.userId,
          movieId,
        });

      if (existingMovie) {
        return res.status(409).json({
          success: false,
          message:
            "Movie is already in your watchlist.",
        });
      }

      const movie =
        await Watchlist.create({
          user: req.user.userId,
          movieId,
          title,
          poster,
          backdrop,
          description,
          year,
          releaseDate,
          genreIds,
          genre,
          rating,
          popularity,
          voteCount,
        });

      res.status(201).json({
        success: true,
        message:
          "Movie added to watchlist.",
        movie,
      });
    } catch (error) {
      console.error(
        "Add watchlist error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to add movie to watchlist.",
      });
    }
  }
);

/* ========================================
   REMOVE FROM WATCHLIST
======================================== */

router.delete(
  "/:movieId",
  authenticateToken,
  async (req, res) => {
    try {
      const movie =
        await Watchlist.findOneAndDelete({
          user: req.user.userId,
          movieId: Number(
            req.params.movieId
          ),
        });

      if (!movie) {
        return res.status(404).json({
          success: false,
          message:
            "Movie is not in your watchlist.",
        });
      }

      res.json({
        success: true,
        message:
          "Movie removed from watchlist.",
      });
    } catch (error) {
      console.error(
        "Remove watchlist error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to remove movie.",
      });
    }
  }
);

module.exports = router;