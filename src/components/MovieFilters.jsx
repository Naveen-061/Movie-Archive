import "./MovieFilters.css";

function MovieFilters({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  selectedRating,
  setSelectedRating,
  selectedYear,
  setSelectedYear,
  sortBy,
  setSortBy,
  genres = [],
  years = [],
  onClearFilters,
}) {
  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (selectedGenre !== "All" ? 1 : 0) +
    (selectedRating !== "All" ? 1 : 0) +
    (selectedYear !== "All" ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0);

  return (
    <section className="movie-filters">
      <div className="filter-search">
        <div className="search-label">
          <span>🔍</span>

          <label>
            Search Movies
          </label>
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() =>
                setSearchTerm("")
              }
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="filter-controls">
        {/* Genre */}
        <div
          className={`filter-group ${
            selectedGenre !== "All"
              ? "active"
              : ""
          }`}
        >
          <label>🎭 Genre</label>

          <select
            value={selectedGenre}
            onChange={(event) =>
              setSelectedGenre(
                event.target.value
              )
            }
          >
            <option value="All">
              All Genres
            </option>

            {genres.map((genre) => (
              <option
                key={genre.id}
                value={genre.id}
              >
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div
          className={`filter-group ${
            selectedRating !== "All"
              ? "active"
              : ""
          }`}
        >
          <label>⭐ Rating</label>

          <select
            value={selectedRating}
            onChange={(event) =>
              setSelectedRating(
                event.target.value
              )
            }
          >
            <option value="All">
              All Ratings
            </option>

            <option value="9">
              9+ ⭐
            </option>

            <option value="8">
              8+ ⭐
            </option>

            <option value="7">
              7+ ⭐
            </option>

            <option value="6">
              6+ ⭐
            </option>

            <option value="5">
              5+ ⭐
            </option>
          </select>
        </div>

        {/* Year */}
        <div
          className={`filter-group ${
            selectedYear !== "All"
              ? "active"
              : ""
          }`}
        >
          <label>📅 Year</label>

          <select
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(
                event.target.value
              )
            }
          >
            {years.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year === "All"
                  ? "All Years"
                  : year}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div
          className={`filter-group ${
            sortBy !== "default"
              ? "active"
              : ""
          }`}
        >
          <label>↕️ Sort By</label>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value
              )
            }
          >
            <option value="default">
              Popularity
            </option>

            <option value="rating-high">
              Rating: High → Low
            </option>

            <option value="rating-low">
              Rating: Low → High
            </option>

            <option value="year-new">
              Newest → Oldest
            </option>

            <option value="year-old">
              Oldest → Newest
            </option>

            <option value="title">
              Title: A → Z
            </option>
          </select>
        </div>

        {/* Clear */}
        <button
          type="button"
          className="clear-filters-button"
          onClick={onClearFilters}
          disabled={
            activeFilterCount === 0
          }
        >
          ✕ Clear
        </button>
      </div>

      <div className="filter-status">
        {activeFilterCount > 0 ? (
          <span className="active-filter-count">
            {activeFilterCount}{" "}
            {activeFilterCount === 1
              ? "filter"
              : "filters"}{" "}
            active
          </span>
        ) : (
          <span className="no-filters">
            Showing popular movies
          </span>
        )}

        {searchTerm && (
          <span className="filter-tag">
            🔍 {searchTerm}
          </span>
        )}

        {selectedGenre !== "All" && (
          <span className="filter-tag">
            🎭{" "}
            {genres.find(
              (genre) =>
                String(genre.id) ===
                String(selectedGenre)
            )?.name || "Genre"}
          </span>
        )}

        {selectedRating !== "All" && (
          <span className="filter-tag">
            ⭐ {selectedRating}+
          </span>
        )}

        {selectedYear !== "All" && (
          <span className="filter-tag">
            📅 {selectedYear}
          </span>
        )}
      </div>
    </section>
  );
}

export default MovieFilters;