import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import MovieCard from "../components/MovieCard.jsx";

import { getMovieDetails } from "../api/tmdb.js";

import "./MovieDetails.css";

const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/w500";

const BACKDROP_BASE_URL =
  "https://image.tmdb.org/t/p/original";

const PROFILE_BASE_URL =
  "https://image.tmdb.org/t/p/w185";

function formatRuntime(minutes) {
  if (!minutes) {
    return "N/A";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatDate(date) {
  if (!date) {
    return "Unknown";

  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function formatMovie(movie) {
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

    genre:
      movie.genres?.[0]?.name ||
      "Movie",

    genreIds:
      movie.genre_ids || [],

    rating:
      movie.vote_average || 0,

    popularity:
      movie.popularity || 0,

    voteCount:
      movie.vote_count || 0,
  };
}

function MovieDetails({
  watchlist = [],
  onToggleWatchlist,
}) {
  const { id } = useParams();

  const navigate = useNavigate();

  const [movie, setMovie] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeTrailer, setActiveTrailer] =
    useState(null);

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getMovieDetails(id);

        setMovie(response);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load movie details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  const isInWatchlist =
    movie &&
    watchlist.some(
      (item) =>
        item.id === movie.id
    );

  const trailer = useMemo(() => {
    const videos =
      movie?.videos?.results || [];

    const youtubeVideos =
      videos.filter(
        (video) =>
          video.site === "YouTube"
      );

    return (
      youtubeVideos.find(
        (video) =>
          video.type === "Trailer" &&
          video.official
      ) ||
      youtubeVideos.find(
        (video) =>
          video.type === "Trailer"
      ) ||
      youtubeVideos.find(
        (video) =>
          video.type === "Teaser"
      ) ||
      null
    );
  }, [movie]);

  const cast =
    movie?.credits?.cast?.slice(
      0,
      12
    ) || [];

  const directors =
    movie?.credits?.crew?.filter(
      (person) =>
        person.job === "Director"
    ) || [];

  const writers =
    movie?.credits?.crew?.filter(
      (person) =>
        person.job === "Writer" ||
        person.job === "Screenplay" ||
        person.job === "Story"
    ) || [];

  const recommendations =
    movie?.recommendations?.results
      ?.filter(
        (item) =>
          item.poster_path
      )
      .slice(0, 12)
      .map(formatMovie) || [];

  const similarMovies =
    movie?.similar?.results
      ?.filter(
        (item) =>
          item.poster_path
      )
      .slice(0, 12)
      .map(formatMovie) || [];

  const relatedMovies =
    recommendations.length > 0
      ? recommendations
      : similarMovies;

  const productionCompanies =
    movie?.production_companies || [];

  const spokenLanguages =
    movie?.spoken_languages || [];

  if (loading) {
    return (
      <main className="movie-details-loading">
        <div className="movie-details-spinner">
          🎬
        </div>

        <h1>
          Loading movie...
        </h1>

        <p>
          Getting details from TMDB.
        </p>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="movie-details-error">
        <div className="movie-details-error-icon">
          ⚠️
        </div>

        <h1>
          Movie not found
        </h1>

        <p>
          {error ||
            "We couldn't find this movie."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to Movies
        </button>
      </main>
    );
  }

  return (
    <main className="movie-details-page">
      {/* =================================
          CINEMATIC HERO
      ================================= */}

      <section
        className="movie-details-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(8, 8, 8, 0.97) 0%,
              rgba(8, 8, 8, 0.82) 32%,
              rgba(8, 8, 8, 0.48) 68%,
              rgba(8, 8, 8, 0.72) 100%
            ),
            linear-gradient(
              0deg,
              var(--bg-primary) 0%,
              transparent 45%
            ),
            url(${
              movie.backdrop_path
                ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
                : movie.poster_path
                  ? `${BACKDROP_BASE_URL}${movie.poster_path}`
                  : ""
            })
          `,
        }}
      >
        <div className="movie-details-hero-inner">
          {/* BACK BUTTON */}

          <button
            type="button"
            className="details-back-button"
            onClick={() =>
              navigate(-1)
            }
          >
            ← Back
          </button>

          <div className="movie-details-main">
            {/* POSTER */}

            <div className="movie-details-poster-wrap">
              {movie.poster_path ? (
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-details-poster"
                />
              ) : (
                <div className="movie-details-poster-placeholder">
                  🎬
                </div>
              )}
            </div>

            {/* INFORMATION */}

            <div className="movie-details-content">
              <div className="movie-details-label">
                MOVIE DETAILS
              </div>

              <h1>
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="movie-tagline">
                  “{movie.tagline}”
                </p>
              )}

              {/* META */}

              <div className="movie-details-meta">
                {movie.release_date && (
                  <span>
                    📅{" "}
                    {new Date(
                      movie.release_date
                    ).getFullYear()}
                  </span>
                )}

                <span>
                  ⏱️{" "}
                  {formatRuntime(
                    movie.runtime
                  )}
                </span>

                {movie.vote_average > 0 && (
                  <span className="details-rating">
                    ⭐{" "}
                    {movie.vote_average.toFixed(
                      1
                    )}
                  </span>
                )}

                {movie.vote_count > 0 && (
                  <span>
                    {movie.vote_count.toLocaleString()}{" "}
                    votes
                  </span>
                )}
              </div>

              {/* GENRES */}

              {movie.genres?.length >
                0 && (
                <div className="details-genres">
                  {movie.genres.map(
                    (genre) => (
                      <span
                        key={genre.id}
                      >
                        {genre.name}
                      </span>
                    )
                  )}
                </div>
              )}

              {/* OVERVIEW */}

              <p className="movie-details-overview">
                {movie.overview ||
                  "No description available."}
              </p>

              {/* ACTIONS */}

              <div className="movie-details-actions">
                {trailer && (
                  <button
                    type="button"
                    className="details-primary-button"
                    onClick={() =>
                      setActiveTrailer(
                        trailer
                      )
                    }
                  >
                    ▶ Watch Trailer
                  </button>
                )}

                <button
                  type="button"
                  className={
                    isInWatchlist
                      ? "details-watchlist-button active"
                      : "details-watchlist-button"
                  }
                  onClick={() =>
                    onToggleWatchlist(
                      formatMovie(movie)
                    )
                  }
                >
                  {isInWatchlist
                    ? "❤️ In Watchlist"
                    : "♡ Add to Watchlist"}
                </button>
              </div>

              {/* RELEASE DATE */}

              <div className="details-small-info">
                <span>
                  Release
                </span>

                <strong>
                  {formatDate(
                    movie.release_date
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================
          DETAILS
      ================================= */}

      <section className="movie-details-body">
        <div className="details-columns">
          {/* LEFT */}

          <div className="details-primary-column">
            {/* TRAILER */}

            {trailer && (
              <section className="details-section">
                <div className="details-section-heading">
                  <span className="section-accent" />
                  <h2>
                    Official Trailer
                  </h2>
                </div>

                <div className="trailer-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${movie.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* CAST */}

            {cast.length > 0 && (
              <section className="details-section">
                <div className="details-section-heading">
                  <span className="section-accent" />
                  <h2>
                    Cast
                  </h2>
                </div>

                <div className="cast-grid">
                  {cast.map(
                    (person) => (
                      <div
                        className="cast-card"
                        key={
                          person.credit_id ||
                          person.id
                        }
                      >
                        {person.profile_path ? (
                          <img
                            src={`${PROFILE_BASE_URL}${person.profile_path}`}
                            alt={
                              person.name
                            }
                            loading="lazy"
                          />
                        ) : (
                          <div className="cast-placeholder">
                            👤
                          </div>
                        )}

                        <div className="cast-info">
                          <strong>
                            {person.name}
                          </strong>

                          <span>
                            {person.character ||
                              "Unknown role"}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* RELATED MOVIES */}

            {relatedMovies.length >
              0 && (
              <section className="details-section">
                <div className="details-section-heading">
                  <span className="section-accent" />

                  <h2>
                    {recommendations.length >
                    0
                      ? "You May Also Like"
                      : "Similar Movies"}
                  </h2>
                </div>

                <div className="details-related-grid">
                  {relatedMovies.map(
                    (relatedMovie) => (
                      <MovieCard
                        key={
                          relatedMovie.id
                        }
                        movie={
                          relatedMovie
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
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="details-sidebar">
            {/* CREW */}

            {(directors.length >
              0 ||
              writers.length >
                0) && (
              <section className="details-info-panel">
                <h3>
                  Crew
                </h3>

                {directors.length >
                  0 && (
                  <div className="crew-row">
                    <span>
                      Director
                    </span>

                    <div>
                      {directors
                        .slice(0, 3)
                        .map(
                          (
                            person,
                            index
                          ) => (
                            <strong
                              key={
                                person.credit_id ||
                                person.id ||
                                index
                              }
                            >
                              {
                                person.name
                              }
                            </strong>
                          )
                        )}
                    </div>
                  </div>
                )}

                {writers.length >
                  0 && (
                  <div className="crew-row">
                    <span>
                      Writers
                    </span>

                    <div>
                      {writers
                        .slice(0, 5)
                        .map(
                          (
                            person,
                            index
                          ) => (
                            <strong
                              key={
                                person.credit_id ||
                                person.id ||
                                index
                              }
                            >
                              {
                                person.name
                              }
                            </strong>
                          )
                        )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* PRODUCTION */}

            {productionCompanies.length >
              0 && (
              <section className="details-info-panel">
                <h3>
                  Production
                </h3>

                <div className="production-list">
                  {productionCompanies
                    .slice(0, 6)
                    .map(
                      (company) => (
                        <div
                          className="production-company"
                          key={
                            company.id
                          }
                        >
                          {company.logo_path ? (
                            <img
                              src={`${IMAGE_BASE_URL}${company.logo_path}`}
                              alt={
                                company.name
                              }
                            />
                          ) : (
                            <div className="company-icon">
                              🎬
                            </div>
                          )}

                          <span>
                            {
                              company.name
                            }
                          </span>
                        </div>
                      )
                    )}
                </div>
              </section>
            )}

            {/* MOVIE INFORMATION */}

            <section className="details-info-panel">
              <h3>
                Information
              </h3>

              <div className="info-list">
                <div>
                  <span>
                    Original Title
                  </span>

                  <strong>
                    {movie.original_title ||
                      movie.title}
                  </strong>
                </div>

                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    {movie.status ||
                      "Unknown"}
                  </strong>
                </div>

                <div>
                  <span>
                    Language
                  </span>

                  <strong>
                    {movie.original_language?.toUpperCase() ||
                      "N/A"}
                  </strong>
                </div>

                {spokenLanguages.length >
                  0 && (
                  <div>
                    <span>
                      Spoken Languages
                    </span>

                    <strong>
                      {spokenLanguages
                        .map(
                          (language) =>
                            language.english_name ||
                            language.name
                        )
                        .join(
                          ", "
                        )}
                    </strong>
                  </div>
                )}

                {movie.budget > 0 && (
                  <div>
                    <span>
                      Budget
                    </span>

                    <strong>
                      $
                      {movie.budget.toLocaleString()}
                    </strong>
                  </div>
                )}

                {movie.revenue > 0 && (
                  <div>
                    <span>
                      Revenue
                    </span>

                    <strong>
                      $
                      {movie.revenue.toLocaleString()}
                    </strong>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>

        {/* TMDB ATTRIBUTION */}

        <footer className="tmdb-attribution">
          <div className="tmdb-logo">
            TMDB
          </div>

          <p>
            This product uses TMDB and
            the TMDB APIs but is not
            endorsed, certified, or
            otherwise approved by TMDB.
          </p>
        </footer>
      </section>

      {/* =================================
          TRAILER MODAL
      ================================= */}

      {activeTrailer && (
        <div
          className="trailer-modal"
          onClick={() =>
            setActiveTrailer(null)
          }
        >
          <div
            className="trailer-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="trailer-close"
              onClick={() =>
                setActiveTrailer(null)
              }
              aria-label="Close trailer"
            >
              ×
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${activeTrailer.key}?autoplay=1`}
              title={`${movie.title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default MovieDetails;