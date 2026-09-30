import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({
  movie,
  watchlist = [],
  onToggleWatchlist,
}) {
  const isFavorite = watchlist.some(
    (item) => item.id === movie.id
  );

  function handleWatchlist() {
    onToggleWatchlist(movie);
  }

  const genre =
    movie.genre ||
    movie.genres?.[0]?.name ||
    "Movie";

  return (
    <div className="movie-card">
      <img
        className="movie-poster"
        src={movie.poster}
        alt={movie.title}
        loading="lazy"
      />

      <div className="movie-info">
        <h2 className="movie-title">
          {movie.title}
        </h2>

        <p className="movie-meta">
          {movie.year || "N/A"} • {genre}
        </p>

        <p className="movie-rating">
          ⭐{" "}
          {movie.rating
            ? movie.rating.toFixed(1)
            : "N/A"}
        </p>

        {movie.rating >= 8.5 && (
          <p className="highly-rated">
            🔥 Highly Rated
          </p>
        )}

        <div className="movie-actions">
          <button
            type="button"
            onClick={handleWatchlist}
          >
            {isFavorite
              ? "❤️ Added"
              : "♡ Watchlist"}
          </button>

          <Link
            to={`/movie/${movie.id}`}
            className="view-button"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;