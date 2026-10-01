import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar.jsx";
import MovieFilters from "./components/MovieFilters.jsx";
import MovieSection from "./components/MovieSection.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Search from "./pages/Search.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "./api/watchlist.js";

import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieGenres,
  discoverMovies,
} from "./api/tmdb.js";

const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/w500";

const BACKDROP_BASE_URL =
  "https://image.tmdb.org/t/p/original";

const SECTION_MOVIE_LIMIT = 100;

/* ========================================
   FORMAT MOVIE
======================================== */

function formatMovie(movie, genres = []) {
  const movieGenreIds =
    movie.genre_ids ||
    movie.genres?.map(
      (genre) => genre.id
    ) ||
    [];

  const firstGenre =
    genres.find((genre) =>
      movieGenreIds.includes(
        genre.id
      )
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

    backdrop: movie.backdrop_path
      ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
      : null,

    description:
      movie.overview ||
      "No description available.",

    year: movie.release_date
      ? Number(
          movie.release_date.slice(0, 4)
        )
      : 0,

    releaseDate:
      movie.release_date || "",

    genreIds: movieGenreIds,

    genre: firstGenre,

    rating:
      movie.vote_average || 0,

    popularity:
      movie.popularity || 0,

    voteCount:
      movie.vote_count || 0,
  };
}

/* ========================================
   MERGE MOVIES
======================================== */

function mergeMovies(
  currentMovies,
  newMovies
) {
  const combined = [
    ...currentMovies,
    ...newMovies,
  ];

  return Array.from(
    new Map(
      combined.map((movie) => [
        movie.id,
        movie,
      ])
    ).values()
  );
}

/* ========================================
   SORT MOVIES
======================================== */

function sortMovies(
  movies,
  sortBy
) {
  return [...movies].sort(
    (a, b) => {
      switch (sortBy) {
        case "rating-high":
          return (
            b.rating - a.rating
          );

        case "rating-low":
          return (
            a.rating - b.rating
          );

        case "year-new":
          return (
            b.year - a.year
          );

        case "year-old":
          return (
            a.year - b.year
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

/* ========================================
   HOME
======================================== */

function Home({
  watchlist,
  onToggleWatchlist,
}) {
  const navigate = useNavigate();

  /* ======================================
     MOVIE DATA
  ====================================== */

  const [genres, setGenres] =
    useState([]);

  const [trendingMovies, setTrendingMovies] =
    useState([]);

  const [popularMovies, setPopularMovies] =
    useState([]);

  const [topRatedMovies, setTopRatedMovies] =
    useState([]);

  const [upcomingMovies, setUpcomingMovies] =
    useState([]);

  /* ======================================
     PAGINATION
  ====================================== */

  const [trendingPage, setTrendingPage] =
    useState(1);

  const [popularPage, setPopularPage] =
    useState(1);

  const [topRatedPage, setTopRatedPage] =
    useState(1);

  const [upcomingPage, setUpcomingPage] =
    useState(1);

  const [
    trendingTotalPages,
    setTrendingTotalPages,
  ] = useState(1);

  const [
    popularTotalPages,
    setPopularTotalPages,
  ] = useState(1);

  const [
    topRatedTotalPages,
    setTopRatedTotalPages,
  ] = useState(1);

  const [
    upcomingTotalPages,
    setUpcomingTotalPages,
  ] = useState(1);

  /* ======================================
     LOADING STATES
  ====================================== */

  const [
    loadingTrending,
    setLoadingTrending,
  ] = useState(false);

  const [
    loadingPopular,
    setLoadingPopular,
  ] = useState(false);

  const [
    loadingTopRated,
    setLoadingTopRated,
  ] = useState(false);

  const [
    loadingUpcoming,
    setLoadingUpcoming,
  ] = useState(false);

  /* ======================================
     EXPLORE
  ====================================== */

  const [exploreMovies, setExploreMovies] =
    useState([]);

  const [explorePage, setExplorePage] =
    useState(1);

  const [
    exploreTotalPages,
    setExploreTotalPages,
  ] = useState(1);

  const [loadingExplore, setLoadingExplore] =
    useState(false);

  /* ======================================
     FILTERS
  ====================================== */

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedGenre, setSelectedGenre] =
    useState("All");

  const [selectedRating, setSelectedRating] =
    useState("All");

  const [selectedYear, setSelectedYear] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("default");

  /* ======================================
     GENERAL LOADING
  ====================================== */

  const [loading, setLoading] =
    useState(true);

  const [filterLoading, setFilterLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ======================================
     HERO CAROUSEL
  ====================================== */

  const [heroIndex, setHeroIndex] =
    useState(0);

  /* ======================================
     INITIAL HOMEPAGE DATA
  ====================================== */

  useEffect(() => {
    async function loadHomeMovies() {
      try {
        setLoading(true);
        setError("");

        const genreResponse =
          await getMovieGenres();

        const loadedGenres =
          genreResponse.genres || [];

        setGenres(loadedGenres);

        const [
          trendingResponse,
          popularResponse,
          topRatedResponse,
          upcomingResponse,
        ] = await Promise.all([
          getTrendingMovies(1),
          getPopularMovies(1),
          getTopRatedMovies(1),
          getUpcomingMovies(1),
        ]);

        const trending =
          trendingResponse.results.map(
            (movie) =>
              formatMovie(
                movie,
                loadedGenres
              )
          );

        const popular =
          popularResponse.results.map(
            (movie) =>
              formatMovie(
                movie,
                loadedGenres
              )
          );

        const topRated =
          topRatedResponse.results.map(
            (movie) =>
              formatMovie(
                movie,
                loadedGenres
              )
          );

        const upcoming =
          upcomingResponse.results.map(
            (movie) =>
              formatMovie(
                movie,
                loadedGenres
              )
          );

        setTrendingMovies(trending);

        setPopularMovies(popular);

        setTopRatedMovies(topRated);

        setUpcomingMovies(upcoming);

        setTrendingTotalPages(
          trendingResponse.total_pages ||
            1
        );

        setPopularTotalPages(
          popularResponse.total_pages ||
            1
        );

        setTopRatedTotalPages(
          topRatedResponse.total_pages ||
            1
        );

        setUpcomingTotalPages(
          upcomingResponse.total_pages ||
            1
        );

        /*
          Explore starts with popular movies.
        */

        setExploreMovies(popular);

        setExplorePage(1);

        setExploreTotalPages(
          popularResponse.total_pages ||
            1
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load movies from TMDB."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHomeMovies();
  }, []);

  /* ======================================
     HERO AUTO ROTATION
  ====================================== */

  const heroMovies =
    trendingMovies.slice(0, 5);

  useEffect(() => {
    if (heroMovies.length <= 1) {
      return;
    }

    const interval =
      setInterval(() => {
        setHeroIndex(
          (currentIndex) =>
            (currentIndex + 1) %
            heroMovies.length
        );
      }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [heroMovies.length]);

  /*
    Make sure index remains valid.
  */

  useEffect(() => {
    if (
      heroIndex >= heroMovies.length &&
      heroMovies.length > 0
    ) {
      setHeroIndex(0);
    }
  }, [
    heroIndex,
    heroMovies.length,
  ]);

  const featuredMovie =
    heroMovies[heroIndex] ||
    heroMovies[0] ||
    null;

  /* ======================================
     SEARCH + FILTERS
  ====================================== */

  useEffect(() => {
    const hasSearch =
      searchTerm.trim().length > 0;

    const hasFilters =
      selectedGenre !== "All" ||
      selectedRating !== "All" ||
      selectedYear !== "All" ||
      sortBy !== "default";

    if (!hasSearch && !hasFilters) {
      return;
    }

    const timeout =
      setTimeout(
        async () => {
          try {
            setFilterLoading(true);

            let response;

            /* ==========================
               SEARCH
            ========================== */

            if (hasSearch) {
              response =
                await searchMovies(
                  searchTerm.trim(),
                  1
                );

              let results =
                response.results.map(
                  (movie) =>
                    formatMovie(
                      movie,
                      genres
                    )
                );

              if (
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

              results = sortMovies(
                results,
                sortBy
              );

              setExploreMovies(
                results
              );

              setExplorePage(1);

              setExploreTotalPages(
                response.total_pages ||
                  1
              );
            }

            /* ==========================
               DISCOVER
            ========================== */

            else {
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
                sortBy ===
                "rating-high"
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
                sortBy ===
                "rating-low"
              ) {
                params.set(
                  "sort_by",
                  "vote_average.asc"
                );
              } else if (
                sortBy ===
                "year-new"
              ) {
                params.set(
                  "sort_by",
                  "primary_release_date.desc"
                );
              } else if (
                sortBy ===
                "year-old"
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

              response =
                await discoverMovies(
                  params.toString()
                );

              const results =
                response.results.map(
                  (movie) =>
                    formatMovie(
                      movie,
                      genres
                    )
                );

              setExploreMovies(
                results
              );

              setExplorePage(1);

              setExploreTotalPages(
                response.total_pages ||
                  1
              );
            }
          } catch (err) {
            console.error(err);

            setError(
              "Unable to load filtered movies."
            );
          } finally {
            setFilterLoading(false);
          }
        },
        400
      );

    return () =>
      clearTimeout(timeout);
  }, [
    searchTerm,
    selectedGenre,
    selectedRating,
    selectedYear,
    sortBy,
    genres,
  ]);

  /* ======================================
     LOAD MORE CURATED SECTION
  ====================================== */

  async function loadMoreCurated(
    type
  ) {
    let page;

    let totalPages;

    let currentMovies;

    let setMovies;

    let setPage;

    let setLoading;

    switch (type) {
      case "trending":
        page = trendingPage;

        totalPages =
          trendingTotalPages;

        currentMovies =
          trendingMovies;

        setMovies =
          setTrendingMovies;

        setPage =
          setTrendingPage;

        setLoading =
          setLoadingTrending;

        break;

      case "popular":
        page = popularPage;

        totalPages =
          popularTotalPages;

        currentMovies =
          popularMovies;

        setMovies =
          setPopularMovies;

        setPage =
          setPopularPage;

        setLoading =
          setLoadingPopular;

        break;

      case "top-rated":
        page = topRatedPage;

        totalPages =
          topRatedTotalPages;

        currentMovies =
          topRatedMovies;

        setMovies =
          setTopRatedMovies;

        setPage =
          setTopRatedPage;

        setLoading =
          setLoadingTopRated;

        break;

      case "upcoming":
        page = upcomingPage;

        totalPages =
          upcomingTotalPages;

        currentMovies =
          upcomingMovies;

        setMovies =
          setUpcomingMovies;

        setPage =
          setUpcomingPage;

        setLoading =
          setLoadingUpcoming;

        break;

      default:
        return;
    }

    if (
      currentMovies.length >=
        SECTION_MOVIE_LIMIT ||
      page >= totalPages
    ) {
      return;
    }

    try {
      setLoading(true);

      const nextPage =
        page + 1;

      let response;

      if (type === "trending") {
        response =
          await getTrendingMovies(
            nextPage
          );
      } else if (
        type === "popular"
      ) {
        response =
          await getPopularMovies(
            nextPage
          );
      } else if (
        type === "top-rated"
      ) {
        response =
          await getTopRatedMovies(
            nextPage
          );
      } else {
        response =
          await getUpcomingMovies(
            nextPage
          );
      }

      const newMovies =
        response.results.map(
          (movie) =>
            formatMovie(
              movie,
              genres
            )
        );

      setMovies(
        mergeMovies(
          currentMovies,
          newMovies
        ).slice(
          0,
          SECTION_MOVIE_LIMIT
        )
      );

      setPage(nextPage);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load more movies."
      );
    } finally {
      setLoading(false);
    }
  }

  /* ======================================
     EXPLORE PAGINATION
  ====================================== */

  async function loadMoreExplore() {
    if (
      loadingExplore ||
      explorePage >=
        exploreTotalPages
    ) {
      return;
    }

    try {
      setLoadingExplore(true);

      const nextPage =
        explorePage + 1;

      const hasSearch =
        searchTerm.trim().length > 0;

      const hasFilters =
        selectedGenre !== "All" ||
        selectedRating !== "All" ||
        selectedYear !== "All" ||
        sortBy !== "default";

      let response;

      /* ==========================
         SEARCH
      ========================== */

      if (hasSearch) {
        response =
          await searchMovies(
            searchTerm.trim(),
            nextPage
          );

        let results =
          response.results.map(
            (movie) =>
              formatMovie(
                movie,
                genres
              )
          );

        if (
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

        results = sortMovies(
          results,
          sortBy
        );

        setExploreMovies(
          results
        );
      }

      /* ==========================
         FILTERED DISCOVER
      ========================== */

      else if (hasFilters) {
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
          sortBy ===
          "rating-high"
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
          sortBy ===
          "rating-low"
        ) {
          params.set(
            "sort_by",
            "vote_average.asc"
          );
        } else if (
          sortBy ===
          "year-new"
        ) {
          params.set(
            "sort_by",
            "primary_release_date.desc"
          );
        } else if (
          sortBy ===
          "year-old"
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
          nextPage
        );

        response =
          await discoverMovies(
            params.toString()
          );

        setExploreMovies(
          response.results.map(
            (movie) =>
              formatMovie(
                movie,
                genres
              )
          )
        );
      }

      /* ==========================
         DEFAULT EXPLORE
      ========================== */

      else {
        response =
          await getPopularMovies(
            nextPage
          );

        setExploreMovies(
          response.results.map(
            (movie) =>
              formatMovie(
                movie,
                genres
              )
          )
        );
      }

      setExplorePage(nextPage);

      setExploreTotalPages(
        response.total_pages ||
          exploreTotalPages
      );

      /*
        Return Explore row
        to the beginning.
      */

      setTimeout(() => {
        const movieGrids =
          document.querySelectorAll(
            ".movie-section .movie-grid"
          );

        const exploreGrid =
          movieGrids[
            movieGrids.length - 1
          ];

        exploreGrid?.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load more movies."
      );
    } finally {
      setLoadingExplore(false);
    }
  }

  /* ======================================
     CLEAR FILTERS
  ====================================== */

  function clearFilters() {
    setSearchTerm("");

    setSelectedGenre("All");

    setSelectedRating("All");

    setSelectedYear("All");

    setSortBy("default");

    setExploreMovies(
      popularMovies
    );

    setExplorePage(1);

    setExploreTotalPages(
      popularTotalPages
    );
  }

  /* ======================================
     HERO ACTIONS
  ====================================== */

  function openFeaturedMovie() {
    if (!featuredMovie) {
      return;
    }

    navigate(
      `/movie/${featuredMovie.id}`
    );
  }

  function selectHeroMovie(index) {
    setHeroIndex(index);
  }

  /* ======================================
     YEARS
  ====================================== */

  const currentYear =
    new Date().getFullYear();

  const years = [
    "All",

    ...Array.from(
      {
        length:
          currentYear - 1900 + 1,
      },
      (_, index) =>
        currentYear - index
    ),
  ];

  /* ======================================
     MORE BUTTON STATES
  ====================================== */

  const hasExploreMore =
    explorePage <
    exploreTotalPages;

  const hasTrendingMore =
    trendingMovies.length <
      SECTION_MOVIE_LIMIT &&
    trendingPage <
      trendingTotalPages;

  const hasPopularMore =
    popularMovies.length <
      SECTION_MOVIE_LIMIT &&
    popularPage <
      popularTotalPages;

  const hasTopRatedMore =
    topRatedMovies.length <
      SECTION_MOVIE_LIMIT &&
    topRatedPage <
      topRatedTotalPages;

  const hasUpcomingMore =
    upcomingMovies.length <
      SECTION_MOVIE_LIMIT &&
    upcomingPage <
      upcomingTotalPages;

  /* ======================================
     LOADING SCREEN
  ====================================== */

  if (loading) {
    return (
      <>
        <Navbar
          watchlistCount={
            watchlist.length
          }
        />

        <main className="loading-page">
          <div className="loading-content">
            <div className="loading-spinner">
              🎬
            </div>

            <h1>
              Loading Movie Archive...
            </h1>

            <p>
              Getting movies from TMDB.
            </p>
          </div>
        </main>
      </>
    );
  }

  /* ======================================
     ERROR SCREEN
  ====================================== */

  if (
    error &&
    !exploreMovies.length
  ) {
    return (
      <>
        <Navbar
          watchlistCount={
            watchlist.length
          }
        />

        <main className="error-page">
          <div className="error-content">
            <div className="error-icon">
              ⚠️
            </div>

            <h1>
              Something went wrong
            </h1>

            <p>{error}</p>

            <p>
              Check your TMDB token and
              internet connection.
            </p>
          </div>
        </main>
      </>
    );
  }

  /* ======================================
     HOME PAGE
  ====================================== */

  return (
    <>
      <Navbar
        watchlistCount={
          watchlist.length
        }
      />

      <main>
        {/* =================================
            HERO
        ================================= */}

        {featuredMovie && (
          <section
            className="hero-section"
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(8, 8, 8, 0.96) 0%,
                  rgba(8, 8, 8, 0.78) 34%,
                  rgba(8, 8, 8, 0.42) 68%,
                  rgba(8, 8, 8, 0.18) 100%
                ),
                linear-gradient(
                  0deg,
                  rgba(8, 8, 8, 0.95) 0%,
                  transparent 45%
                ),
                url(${featuredMovie.backdrop || featuredMovie.poster})
              `,
            }}
          >
            <div className="hero-content">
              <p className="hero-label">
                🔥 TRENDING MOVIE
              </p>

              <h1>
                {featuredMovie.title}
              </h1>

              <div className="hero-meta">
                <span>
                  {featuredMovie.year}
                </span>

                <span>•</span>

                <span>
                  ⭐{" "}
                  {featuredMovie.rating.toFixed(
                    1
                  )}
                </span>
              </div>

              <p className="hero-description">
                {featuredMovie.description}
              </p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="hero-primary-button"
                  onClick={
                    openFeaturedMovie
                  }
                >
                  <span className="button-icon">
                    ▶
                  </span>

                  <span>
                    View Details
                  </span>
                </button>

                <button
                  type="button"
                  className="hero-secondary-button"
                  onClick={() =>
                    onToggleWatchlist(
                      featuredMovie
                    )
                  }
                >
                  <span className="button-icon">
                    {watchlist.some(
                      (movie) =>
                        movie.id ===
                        featuredMovie.id
                    )
                      ? "❤️"
                      : "＋"}
                  </span>

                  <span>
                    {watchlist.some(
                      (movie) =>
                        movie.id ===
                        featuredMovie.id
                    )
                      ? "In Watchlist"
                      : "Watchlist"}
                  </span>
                </button>
              </div>

              {/* HERO INDICATORS */}

              {heroMovies.length > 1 && (
                <div className="hero-indicators">
                  {heroMovies.map(
                    (movie, index) => (
                      <button
                        key={movie.id}
                        type="button"
                        className={
                          index === heroIndex
                            ? "hero-indicator active"
                            : "hero-indicator"
                        }
                        onClick={() =>
                          selectHeroMovie(
                            index
                          )
                        }
                        aria-label={`Show ${movie.title}`}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================
            FILTERS
        ================================= */}

        <MovieFilters
          searchTerm={searchTerm}
          setSearchTerm={
            setSearchTerm
          }
          selectedGenre={
            selectedGenre
          }
          setSelectedGenre={
            setSelectedGenre
          }
          selectedRating={
            selectedRating
          }
          setSelectedRating={
            setSelectedRating
          }
          selectedYear={
            selectedYear
          }
          setSelectedYear={
            setSelectedYear
          }
          sortBy={sortBy}
          setSortBy={setSortBy}
          genres={genres}
          years={years}
          onClearFilters={
            clearFilters
          }
        />

        {filterLoading && (
          <p className="movie-count">
            🔄 Searching TMDB...
          </p>
        )}

        {/* =================================
            TRENDING
        ================================= */}

        <MovieSection
          title="🔥 Trending Movies"
          movies={trendingMovies}
          watchlist={watchlist}
          onToggleWatchlist={
            onToggleWatchlist
          }
          showMore={
            hasTrendingMore
          }
          onMore={() =>
            loadMoreCurated(
              "trending"
            )
          }
          loadingMore={
            loadingTrending
          }
        />

        {/* =================================
            POPULAR
        ================================= */}

        <MovieSection
          title="⭐ Popular Movies"
          movies={popularMovies}
          watchlist={watchlist}
          onToggleWatchlist={
            onToggleWatchlist
          }
          showMore={
            hasPopularMore
          }
          onMore={() =>
            loadMoreCurated(
              "popular"
            )
          }
          loadingMore={
            loadingPopular
          }
        />

        {/* =================================
            TOP RATED
        ================================= */}

        <MovieSection
          title="🏆 Top Rated"
          movies={topRatedMovies}
          watchlist={watchlist}
          onToggleWatchlist={
            onToggleWatchlist
          }
          showMore={
            hasTopRatedMore
          }
          onMore={() =>
            loadMoreCurated(
              "top-rated"
            )
          }
          loadingMore={
            loadingTopRated
          }
        />

        {/* =================================
            UPCOMING
        ================================= */}

        <MovieSection
          title="🔮 Upcoming Movies"
          movies={upcomingMovies}
          watchlist={watchlist}
          onToggleWatchlist={
            onToggleWatchlist
          }
          showMore={
            hasUpcomingMore
          }
          onMore={() =>
            loadMoreCurated(
              "upcoming"
            )
          }
          loadingMore={
            loadingUpcoming
          }
        />

        {/* =================================
            EXPLORE
        ================================= */}

        <MovieSection
          title="🎬 Explore Movies"
          movies={exploreMovies}
          watchlist={watchlist}
          onToggleWatchlist={
            onToggleWatchlist
          }
          showMore={
            hasExploreMore
          }
          onMore={
            loadMoreExplore
          }
          loadingMore={
            loadingExplore
          }
        />
      </main>
    </>
  );
}

/* ========================================
   APP
======================================== */

function mapWatchlistMovie(movie) {
  return {
    id: movie.movieId,

    title: movie.title,

    poster: movie.poster || null,

    backdrop: movie.backdrop || null,

    description:
      movie.description ||
      "No description available.",

    year: movie.year || 0,

    releaseDate:
      movie.releaseDate || "",

    genreIds: movie.genreIds || [],

    genre: movie.genre || "Movie",

    rating: movie.rating || 0,

    popularity:
      movie.popularity || 0,

    voteCount:
      movie.voteCount || 0,
  };
}

function App() {
  const [watchlist, setWatchlist] =
    useState([]);

  /* ======================================
     LOAD WATCHLIST FROM BACKEND
  ====================================== */

  async function loadWatchlist() {
    const token =
      localStorage.getItem(
        "movieArchiveToken"
      );

    if (!token) {
      setWatchlist([]);
      return;
    }

    try {
      const data =
        await getWatchlist();

      const movies =
        (data.movies || []).map(
          mapWatchlistMovie
        );

      setWatchlist(movies);
    } catch (error) {
      console.error(
        "Unable to load watchlist:",
        error
      );
    }
  }

  useEffect(() => {
    loadWatchlist();

    function handleAuthChange() {
      loadWatchlist();
    }

    window.addEventListener(
      "movieArchiveAuthChanged",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "movieArchiveAuthChanged",
        handleAuthChange
      );
    };
  }, []);

  /* ======================================
     TOGGLE WATCHLIST
  ====================================== */

  async function toggleWatchlist(movie) {
    const token =
      localStorage.getItem(
        "movieArchiveToken"
      );

    if (!token) {
      alert(
        "Please sign in to use your watchlist."
      );

      return;
    }

    const alreadyAdded =
      watchlist.some(
        (item) =>
          item.id === movie.id
      );

    try {
      if (alreadyAdded) {
        await removeFromWatchlist(
          movie.id
        );

        setWatchlist(
          (currentWatchlist) =>
            currentWatchlist.filter(
              (item) =>
                item.id !== movie.id
            )
        );

        return;
      }

      await addToWatchlist(movie);

      setWatchlist(
        (currentWatchlist) => [
          ...currentWatchlist,
          movie,
        ]
      );
    } catch (error) {
      console.error(
        "Unable to update watchlist:",
        error
      );

      alert(
        error.message ||
          "Unable to update watchlist."
      );
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}

        <Route
          path="/"
          element={
            <Home
              watchlist={watchlist}
              onToggleWatchlist={
                toggleWatchlist
              }
            />
          }
        />

        {/* SEARCH / DISCOVER */}

        <Route
          path="/search"
          element={
            <>
              <Navbar
                watchlistCount={
                  watchlist.length
                }
              />

              <Search
                watchlist={watchlist}
                onToggleWatchlist={
                  toggleWatchlist
                }
              />
            </>
          }
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        {/* SIGNUP */}

        <Route
          path="/signup"
          element={
            <Signup />
          }
        />

        {/* MOVIE DETAILS */}

        <Route
          path="/movie/:id"
          element={
            <>
              <Navbar
                watchlistCount={
                  watchlist.length
                }
              />

              <MovieDetails
                watchlist={watchlist}
                onToggleWatchlist={
                  toggleWatchlist
                }
              />
            </>
          }
        />

        {/* WATCHLIST */}

        <Route
          path="/watchlist"
          element={
            <>
              <Navbar
                watchlistCount={
                  watchlist.length
                }
              />

              <Watchlist
                watchlist={watchlist}
                onToggleWatchlist={
                  toggleWatchlist
                }
              />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;