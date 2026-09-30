const TMDB_BASE_URL =
  "https://api.themoviedb.org/3";

const TMDB_TOKEN =
  import.meta.env.VITE_TMDB_TOKEN;

async function tmdbFetch(endpoint) {
  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status}`
    );
  }

  return response.json();
}

export async function getTrendingMovies(
  page = 1
) {
  return tmdbFetch(
    `/trending/movie/week?language=en-US&page=${page}`
  );
}

export async function getPopularMovies(
  page = 1
) {
  return tmdbFetch(
    `/movie/popular?language=en-US&page=${page}`
  );
}

export async function getTopRatedMovies(
  page = 1
) {
  return tmdbFetch(
    `/movie/top_rated?language=en-US&page=${page}`
  );
}

export async function getNowPlayingMovies(
  page = 1
) {
  return tmdbFetch(
    `/movie/now_playing?language=en-US&page=${page}`
  );
}

export async function getUpcomingMovies(
  page = 1
) {
  return tmdbFetch(
    `/movie/upcoming?language=en-US&page=${page}`
  );
}

export async function searchMovies(
  query,
  page = 1
) {
  return tmdbFetch(
    `/search/movie?query=${encodeURIComponent(
      query
    )}&language=en-US&page=${page}`
  );
}

export async function getMovieGenres() {
  return tmdbFetch(
    "/genre/movie/list?language=en-US"
  );
}

export async function discoverMovies(
  params = ""
) {
  return tmdbFetch(
    `/discover/movie?language=en-US&${params}`
  );
}

export async function getMovieDetails(id) {
  return tmdbFetch(
    `/movie/${id}?language=en-US&append_to_response=videos,credits,recommendations,similar`
  );
}