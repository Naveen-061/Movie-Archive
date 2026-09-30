import MovieGrid from "./MovieGrid.jsx";

import "./MovieSection.css";

function MovieSection({
  title,
  movies,
  watchlist,
  onToggleWatchlist,
  showMore = false,
  onMore,
  loadingMore = false,
}) {
  return (
    <section className="movie-section">
      <div className="movie-section-header">
        <h2>{title}</h2>
      </div>

      <MovieGrid
        movies={movies}
        watchlist={watchlist}
        onToggleWatchlist={
          onToggleWatchlist
        }
        showMore={showMore}
        onMore={onMore}
        loadingMore={loadingMore}
      />
    </section>
  );
}

export default MovieSection;