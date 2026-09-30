const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* ========================================
   HELPER
======================================== */

async function watchlistFetch(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem(
      "movieArchiveToken"
    );

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,

        ...(options.headers || {}),
      },
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Watchlist request failed."
    );
  }

  return data;
}

/* ========================================
   GET WATCHLIST
======================================== */

export async function getWatchlist() {
  return watchlistFetch(
    "/api/watchlist"
  );
}

/* ========================================
   ADD MOVIE
======================================== */

export async function addToWatchlist(
  movie
) {
  return watchlistFetch(
    "/api/watchlist",
    {
      method: "POST",

      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster || "",
        backdrop:
          movie.backdrop || "",
        description:
          movie.description || "",
        year: movie.year || 0,
        releaseDate:
          movie.releaseDate || "",
        genreIds:
          movie.genreIds || [],
        genre:
          movie.genre ||
          movie.genres?.[0]?.name ||
          "Movie",
        rating:
          movie.rating || 0,
        popularity:
          movie.popularity || 0,
        voteCount:
          movie.voteCount || 0,
      }),
    }
  );
}

/* ========================================
   REMOVE MOVIE
======================================== */

export async function removeFromWatchlist(
  movieId
) {
  return watchlistFetch(
    `/api/watchlist/${movieId}`,
    {
      method: "DELETE",
    }
  );
}