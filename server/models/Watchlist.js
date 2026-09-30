const mongoose = require("mongoose");

const watchlistSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      movieId: {
        type: Number,
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      poster: {
        type: String,
        default: "",
      },

      backdrop: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      year: {
        type: Number,
        default: 0,
      },

      releaseDate: {
        type: String,
        default: "",
      },

      genreIds: {
        type: [Number],
        default: [],
      },

      genre: {
        type: String,
        default: "Movie",
      },

      rating: {
        type: Number,
        default: 0,
      },

      popularity: {
        type: Number,
        default: 0,
      },

      voteCount: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

watchlistSchema.index(
  {
    user: 1,
    movieId: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.model(
    "Watchlist",
    watchlistSchema
  );