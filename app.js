"use strict";

let movies = [];
let genres = [];
const moviesEl = document.getElementById("movies");
const searchEl = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  movies = [];
  moviesEl.innerHTML = "";
  searchMovie(searchEl.value);
  searchEl.value = "";
});

searchEl.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    movies = [];
    moviesEl.innerHTML = "";
    searchMovie(searchEl.value);
    searchEl.value = "";
  }
});

async function searchMovie(query) {
  const imgData = await fetch("http://localhost:9000/getimgs");
  // const imgData = await fetch("/.netlify/functions/getimgs");
  const imgResult = await imgData.json();

  const response = await fetch(
    `http://localhost:9000/searchmovies?query=${query}`
  );

  const genresData = await fetch("http://localhost:9000/getgenres");
  const genresResult = await genresData.json();
  // const response = await fetch(
  //   `/.netlify/functions/searchmovies?query=${query}`
  // );
  const data = await response.json();
  const baseImgUrl = imgResult.images.secure_base_url;

  let postSize = imgResult.images.poster_sizes[4];

  populateGenres(genresResult);

  if (data.length > 0) {
    data.forEach((movie) => {
      const completeImgUrl = `${baseImgUrl}/${postSize}${movie.poster_path}`;
      let genresList = [];
      movie.genre_ids.forEach((id) => {
        genres.forEach((currentGenre) => {
          if (currentGenre[id]) genresList.push(currentGenre[id]);
        });
      });

      movies.push({
        title: movie.original_title,
        poster: completeImgUrl,
        summary: movie.overview,
        year: movie.release_date.slice(0, 4),
        rating: movie.vote_average,
        genres: genresList,
      });
    });

    renderMovies(movies);
  }
}

function populateGenres(genresResult) {
  if (genresResult.genres.length > 0) {
    genresResult.genres.forEach((genre) => {
      genres.push({
        [genre.id]: genre.name,
      });
    });
  }
}

function renderMovies(movies) {
  movies.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    const h3Title = document.createElement("h3");
    h3Title.classList.add("title");
    h3Title.textContent = movie.title;

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const img = document.createElement("img");
    img.src = movie.poster;

    const movieSummary = document.createElement("div");
    movieSummary.classList.add("movie-summary");

    movieSummary.textContent = movie.summary;

    imgContainer.appendChild(img);

    movieEl.appendChild(imgContainer);
    movieEl.appendChild(h3Title);
    movieEl.appendChild(movieSummary);
    moviesEl.appendChild(movieEl);
  });
}
