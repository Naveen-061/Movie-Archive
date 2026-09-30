import { Link } from "react-router-dom";
import MovieGrid from "../components/MovieGrid.jsx";
import "./Watchlist.css";

function Watchlist({ watchlist, onToggleWatchlist }) {
  return (
    <main className="watchlist-page">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>

        <p>
          {watchlist.length === 0
            ? "Your watchlist is empty."
            : `${watchlist.length} movie${
                watchlist.length === 1 ? "" : "s"
              } saved`}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <div className="empty-icon">🎬</div>

          <h2>No movies yet</h2>

          <p>
            Add movies to your watchlist and
            they will appear here.
          </p>

          <Link
            to="/"
            className="browse-movies-button"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <MovieGrid
          movies={watchlist}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
        />
      )}
    </main>
  );
}

export default Watchlist;