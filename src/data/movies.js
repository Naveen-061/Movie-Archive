const movies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    genre: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    rating: 9.2,
    genre: "Crime",
    poster:
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    genre: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 4,
    title: "The Godfather Part II",
    year: 1974,
    rating: 9.0,
    genre: "Crime",
    poster:
      "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
  },
  {
    id: 5,
    title: "Schindler's List",
    year: 1993,
    rating: 9.0,
    genre: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
  },
  {
    id: 6,
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    rating: 9.0,
    genre: "Fantasy",
    poster:
      "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
  },
  {
    id: 7,
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.9,
    genre: "Crime",
    poster:
       "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
  },
  {
    id: 8,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
    rating: 8.8,
    genre: "Fantasy",
    poster:
      "https://image.tmdb.org/t/p/w500/5OPg6M0yHr21Ovs1fni2H1xpKuF.jpg",
  },
  {
    id: 9,
    title: "Forrest Gump",
    year: 1994,
    rating: 8.8,
    genre: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  },
  {
    id: 10,
    title: "Inception",
    year: 2010,
    rating: 8.8,
    genre: "Sci-Fi",
    poster:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 11,
    title: "The Matrix",
    year: 1999,
    rating: 8.7,
    genre: "Sci-Fi",
    poster:
      "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
  {
    id: 12,
    title: "Goodfellas",
    year: 1990,
    rating: 8.7,
    genre: "Crime",
    poster:
      "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
  },
  {
    id: 13,
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    genre: "Sci-Fi",
    poster:
      "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  {
    id: 14,
    title: "Spirited Away",
    year: 2001,
    rating: 8.6,
    genre: "Animation",
    poster:
      "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
  },
  {
    id: 15,
    title: "The Green Mile",
    year: 1999,
    rating: 8.6,
    genre: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
  },
  {
    id: 16,
    title: "Parasite",
    year: 2019,
    rating: 8.5,
    genre: "Thriller",
    poster:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    id: 17,
    title: "Avengers: Endgame",
    year: 2019,
    rating: 8.4,
    genre: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
  },
  {
    id: 18,
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    rating: 8.4,
    genre: "Animation",
    poster:
      "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
  },
  {
    id: 19,
    title: "Pirates of the Caribbean: The Curse of the Black Pearl",
    year: 2003,
    rating: 8.0,
    genre: "Adventure",
    poster:
      "https://image.tmdb.org/t/p/w500/z8onk7LV9Mmw6zKz4hT6pzzvmvl.jpg",
  },
  {
    id: 20,
    title: "Pacific Rim",
    year: 2013,
    rating: 6.9,
    genre: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
  },
  {
    id: 21,
    title: "Deadpool",
    year: 2016,
    rating: 8.0,
    genre: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
  },
  {
    id: 22,
    title: "Spider-Man: No Way Home",
    year: 2021,
    rating: 8.0,
    genre: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    id: 23,
    title: "Fight Club",
    year: 1999,
    rating: 8.4,
    genre: "Drama",
    poster:
       "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  },
  {
    id: 24,
    title: "Avatar",
    year: 2009,
    rating: 7.9,
    genre: "Sci-Fi",
    poster:
      "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
  },
  {
    id: 25,
    title: "Titanic",
    year: 1997,
    rating: 7.9,
    genre: "Romance",
    poster:
      "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
  },
  {
    id: 26,
    title: "Jurassic Park",
    year: 1993,
    rating: 8.2,
    genre: "Adventure",
    poster:
       "https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
  },
  {
    id: 27,
    title: "Terminator 2: Judgment Day",
    year: 1991,
    rating: 8.7,
    genre: "Action",
    poster:
       "https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg",
  },
  {
    id: 28,
    title: "The Prestige",
    year: 2006,
    rating: 8.5,
    genre: "Mystery",
    poster:
      "https://image.tmdb.org/t/p/w500/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg",
  },
  {
    id: 29,
    title: "Whiplash",
    year: 2014,
    rating: 8.5,
    genre: "Drama",
    poster:
      "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
  },
  {
    id: 30,
    title: "Mad Max: Fury Road",
    year: 2015,
    rating: 8.1,
    genre: "Action",
    poster:
      "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
  },
];

export default movies;