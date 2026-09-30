import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MovieCard from "../components/MovieCard.jsx";
import {
  discoverMovies,
  getMovieGenres,
  searchMovies,
} from "../api/tmdb.js";

import "./Search.css";

const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/w500";

function formatMovie(movie, genres) {
  const genreIds =
    movie.genre_ids ||
    movie.genres?.map(
      (genre) => genre.id
    ) ||
    [];

  const genre =
    genres.find((item) =>
      genreIds.includes(item.id)
    )?.name ||
    movie.genres?.[0]?.name ||
    "Movie";

  return {
    id: movie.id,

    title:
      movie.title ||
      movie.original_title ||
      "Unknown Title",

    poster: movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : null,

    description:
      movie.overview ||
      "No description available.",

    year: movie.release_date
      ? Number(
          movie.release_date.slice(0, 4)
        )
      : 0,

    genre,

    genreIds,

    rating:
      movie.vote_average || 0,

    popularity:
      movie.popularity || 0,

    voteCount:
      movie.vote_count || 0,
  };
}

function Search({
  watchlist = [],
  onToggleWatchlist,
}) {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const initialQuery =
    searchParams.get("query") || "";

  const [query, setQuery] =
    useState(initialQuery);

  const [genres, setGenres] =
    useState([]);

  const [movies, setMovies] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [selectedGenre, setSelectedGenre] =
    useState("All");

  const [selectedRating, setSelectedRating] =
    useState("All");

  const [selectedYear, setSelectedYear] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("default");

  const currentYear =
    new Date().getFullYear();

  const years = useMemo(
    () => [
      "All",
      ...Array.from(
        {
          length:
            currentYear - 1900 + 1,
        },
        (_, index) =>
          currentYear - index
      ),
    ],
    [currentYear]
  );

  useEffect(() => {
    async function loadGenres() {
      try {
        const response =
          await getMovieGenres();

        setGenres(
          response.genres || []
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadGenres();
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        let response;

        const trimmedQuery =
          initialQuery.trim();

        if (trimmedQuery) {
          response =
            await searchMovies(
              trimmedQuery,
              page
            );
        } else {
          const params =
            new URLSearchParams();

          if (
            selectedGenre !== "All"
          ) {
            params.set(
              "with_genres",
              selectedGenre
            );
          }

          if (
            selectedRating !== "All"
          ) {
            params.set(
              "vote_average.gte",
              selectedRating
            );

            params.set(
              "vote_count.gte",
              "50"
            );
          }

          if (
            selectedYear !== "All"
          ) {
            params.set(
              "primary_release_year",
              selectedYear
            );
          }

          if (
            sortBy === "rating-high"
          ) {
            params.set(
              "sort_by",
              "vote_average.desc"
            );

            params.set(
              "vote_count.gte",
              "100"
            );
          } else if (
            sortBy === "rating-low"
          ) {
            params.set(
              "sort_by",
              "vote_average.asc"
            );
          } else if (
            sortBy === "year-new"
          ) {
            params.set(
              "sort_by",
              "primary_release_date.desc"
            );
          } else if (
            sortBy === "year-old"
          ) {
            params.set(
              "sort_by",
              "primary_release_date.asc"
            );
          } else if (
            sortBy === "title"
          ) {
            params.set(
              "sort_by",
              "original_title.asc"
            );
          } else {
            params.set(
              "sort_by",
              "popularity.desc"
            );
          }

          params.set(
            "page",
            page
          );

          response =
            await discoverMovies(
              params.toString()
            );
        }

        let results =
          (response.results || [])
            .map((movie) =>
              formatMovie(
                movie,
                genres
              )
            )
            .filter(
              (movie) =>
                movie.poster
            );

        if (
          trimmedQuery &&
          selectedGenre !== "All"
        ) {
          results =
            results.filter(
              (movie) =>
                movie.genreIds.includes(
                  Number(
                    selectedGenre
                  )
                )
            );
        }

        if (
          trimmedQuery &&
          selectedRating !== "All"
        ) {
          results =
            results.filter(
              (movie) =>
                movie.rating >=
                Number(
                  selectedRating
                )
            );
        }

        if (
          trimmedQuery &&
          selectedYear !== "All"
        ) {
          results =
            results.filter(
              (movie) =>
                movie.year ===
                Number(
                  selectedYear
                )
            );
        }

        if (trimmedQuery) {
          results.sort(
            (a, b) => {
              switch (sortBy) {
                case "rating-high":
                  return (
                    b.rating -
                    a.rating
                  );

                case "rating-low":
                  return (
                    a.rating -
                    b.rating
                  );

                case "year-new":
                  return (
                    b.year -
                    a.year
                  );

                case "year-old":
                  return (
                    a.year -
                    b.year
                  );

                case "title":
                  return a.title.localeCompare(
                    b.title
                  );

                default:
                  return (
                    b.popularity -
                    a.popularity
                  );
              }
            }
          );
        }

        setMovies(results);

        setTotalPages(
          Math.min(
            response.total_pages || 1,
            500
          )
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load movies."
        );

        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [
    initialQuery,
    page,
    genres,
    selectedGenre,
    selectedRating,
    selectedYear,
    sortBy,
  ]);

  function submitSearch(event) {
    event.preventDefault();

    const trimmed =
      query.trim();

    setPage(1);

    if (trimmed) {
      setSearchParams({
        query: trimmed,
      });
    } else {
      setSearchParams({});
    }
  }

  function clearFilters() {
    setSelectedGenre("All");
    setSelectedRating("All");
    setSelectedYear("All");
    setSortBy("default");
    setPage(1);
  }

  function browseGenre(genreId) {
    setSelectedGenre(
      String(genreId)
    );

    setPage(1);
  }

  const hasPrevious =
    page > 1;

  const hasNext =
    page < totalPages;

  const hasActiveFilters =
    selectedGenre !== "All" ||
    selectedRating !== "All" ||
    selectedYear !== "All" ||
    sortBy !== "default";

  return (
    <main className="search-page">
      <div className="search-container">
        <section className="search-header">
          <p className="search-eyebrow">
            MOVIE DISCOVERY
          </p>

          <h1>
            Find Your Next Movie
          </h1>

          <p className="search-subtitle">
            Search thousands of movies
            and discover something new.
          </p>

          <form
            className="search-large-form"
            onSubmit={submitSearch}
          >
            <span className="search-large-icon">
              🔎
            </span>

            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search for a movie..."
              aria-label="Search movies"
            />

            {query && (
              <button
                type="button"
                className="search-clear-input"
                onClick={() =>
                  setQuery("")
                }
              >
                ×
              </button>
            )}

            <button
              type="submit"
              className="search-submit"
            >
              Search
            </button>
          </form>
        </section>

        <section className="discovery-panel">
          <div className="discovery-panel-header">
            <div>
              <h2>
                Filters
              </h2>

              <p>
                Narrow down your
                results.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="reset-filters"
                onClick={
                  clearFilters
                }
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="filter-row">
            <label>
              <span>
                Genre
              </span>

              <select
                value={selectedGenre}
                onChange={(event) => {
                  setSelectedGenre(
                    event.target.value
                  );
                  setPage(1);
                }}
              >
                <option value="All">
                  All Genres
                </option>

                {genres.map(
                  (genre) => (
                    <option
                      key={genre.id}
                      value={genre.id}
                    >
                      {genre.name}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>
                Rating
              </span>

              <select
                value={selectedRating}
                onChange={(event) => {
                  setSelectedRating(
                    event.target.value
                  );
                  setPage(1);
                }}
              >
                <option value="All">
                  Any Rating
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
            </label>

            <label>
              <span>
                Year
              </span>

              <select
                value={selectedYear}
                onChange={(event) => {
                  setSelectedYear(
                    event.target.value
                  );
                  setPage(1);
                }}
              >
                {years.map(
                  (year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year === "All"
                        ? "All Years"
                        : year}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>
                Sort
              </span>

              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(
                    event.target.value
                  );
                  setPage(1);
                }}
              >
                <option value="default">
                  Popular
                </option>

                <option value="rating-high">
                  Rating: High → Low
                </option>

                <option value="rating-low">
                  Rating: Low → High
                </option>

                <option value="year-new">
                  Newest First
                </option>

                <option value="year-old">
                  Oldest First
                </option>

                <option value="title">
                  A → Z
                </option>
              </select>
            </label>
          </div>
        </section>

        <section className="genre-browser">
          <div className="genre-browser-header">
            <h2>
              Browse Genres
            </h2>
          </div>

          <div className="genre-chips">
            <button
              type="button"
              className={
                selectedGenre === "All"
                  ? "genre-chip active"
                  : "genre-chip"
              }
              onClick={() => {
                setSelectedGenre(
                  "All"
                );
                setPage(1);
              }}
            >
              All
            </button>

            {genres.map(
              (genre) => (
                <button
                  type="button"
                  key={genre.id}
                  className={
                    String(
                      genre.id
                    ) ===
                    String(
                      selectedGenre
                    )
                      ? "genre-chip active"
                      : "genre-chip"
                  }
                  onClick={() =>
                    browseGenre(
                      genre.id
                    )
                  }
                >
                  {genre.name}
                </button>
              )
            )}
          </div>
        </section>

        <section className="search-results">
          <div className="results-header">
            <div>
              <p className="results-label">
                RESULTS
              </p>

              <h2>
                {initialQuery
                  ? `Results for "${initialQuery}"`
                  : "Explore Movies"}
              </h2>
            </div>

            {!loading && (
              <span className="results-page">
                Page {page} of{" "}
                {totalPages}
              </span>
            )}
          </div>

          {loading && (
            <div className="search-loading">
              <div className="search-spinner">
                🎬
              </div>

              <h3>
                Finding movies...
              </h3>

              <p>
                Searching TMDB.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="search-empty">
              <div>
                ⚠️
              </div>

              <h3>
                Something went wrong
              </h3>

              <p>
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            movies.length === 0 && (
              <div className="search-empty">
                <div>
                  🎬
                </div>

                <h3>
                  No movies found
                </h3>

                <p>
                  Try another search or
                  change your filters.
                </p>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                >
                  Clear Filters
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            movies.length > 0 && (
              <>
                <div className="search-grid">
                  {movies.map(
                    (movie) => (
                      <MovieCard
                        key={
                          movie.id
                        }
                        movie={
                          movie
                        }
                        watchlist={
                          watchlist
                        }
                        onToggleWatchlist={
                          onToggleWatchlist
                        }
                      />
                    )
                  )}
                </div>

                <div className="pagination">
                  <button
                    type="button"
                    disabled={
                      !hasPrevious
                    }
                    onClick={() => {
                      setPage(
                        (current) =>
                          current - 1
                      );

                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      });
                    }}
                  >
                    ← Previous
                  </button>

                  <span>
                    {page} /{" "}
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      !hasNext
                    }
                    onClick={() => {
                      setPage(
                        (current) =>
                          current + 1
                      );

                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
                      });
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
        </section>
      </div>
    </main>
  );
}

export default Search;