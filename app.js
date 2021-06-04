"use strict";

let movies = [];
let genres = [];
const moviesEl = document.getElementById("movies");
const searchEl = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  movies = [];
  genres = [];
  moviesEl.innerHTML = "";
  searchMovie(searchEl.value);
  searchEl.value = "";
});

searchEl.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    movies = [];
    genres = [];
    moviesEl.innerHTML = "";
    searchMovie(searchEl.value);
    searchEl.value = "";
  }
});

async function searchMovie(query) {
  if (query.trim() !== "") {
    // const imgData = await fetch("/.netlify/functions/getimgs");
    const imgData = await fetch("http://localhost:9000/getimgs");

    const imgResult = await imgData.json();

    // const response = await fetch(
    //   `/.netlify/functions/searchmovies?query=${query}`
    // );
    const response = await fetch(
      `http://localhost:9000/searchmovies?query=${query}`
    );

    // const genresData = await fetch("/.netlify/functions/getgenres");
    const genresData = await fetch("http://localhost:9000/getgenres");
    const genresResult = await genresData.json();

    const data = await response.json();
    const baseImgUrl = imgResult.images.secure_base_url;

    let postSize = imgResult.images.poster_sizes[4];

    populateGenres(genresResult);

    if (data.length > 0) {
      data.forEach((movie) => {
        const {
          original_title,
          overview,
          release_date,
          vote_average,
          poster_path,
        } = movie;

        const completeImgUrl = `${baseImgUrl}/${postSize}${poster_path}`;
        let genresList = [];
        movie.genre_ids.forEach((id) => {
          genres.forEach((currentGenre) => {
            if (currentGenre[id]) genresList.push(currentGenre[id]);
          });
        });

        const movieObject = createMovieObject(
          original_title,
          completeImgUrl,
          overview,
          release_date,
          vote_average,
          genresList
        );

        movies.push(movieObject);
      });
      renderMovies(movies);
    } else {
      moviesEl.innerHTML = `No results for ${query}`;
    }
  } else {
    moviesEl.innerHTML = "";
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

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const img = document.createElement("img");
    img.src = movie.poster;

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");

    const topInfo = document.createElement("div");
    topInfo.classList.add("top-info");

    const title = document.createElement("span");
    title.classList.add("title");
    title.textContent = movie.title;

    const rating = document.createElement("span");
    rating.classList.add("rating");
    rating.classList.add(getRatingcolor(movie.rating));
    rating.textContent = movie.rating;

    const year = document.createElement("span");
    year.classList.add("year");
    year.textContent = movie.year;

    const genres = document.createElement("div");
    genres.classList.add("genres");

    movie.genres.forEach((genre) => {
      const span = document.createElement("span");
      span.classList.add("genre");
      span.textContent = genre;
      genres.appendChild(span);
    });

    const movieSummary = document.createElement("div");
    movieSummary.classList.add("movie-summary");

    movieSummary.textContent = movie.summary;

    topInfo.appendChild(title);
    topInfo.appendChild(rating);

    infoContainer.appendChild(topInfo);
    infoContainer.appendChild(year);
    infoContainer.appendChild(genres);

    imgContainer.appendChild(img);

    movieEl.appendChild(imgContainer);
    movieEl.appendChild(infoContainer);
    movieEl.appendChild(movieSummary);
    moviesEl.appendChild(movieEl);
  });
}

function getRatingcolor(score) {
  if (score >= 0 && score <= 4) {
    return "red";
  } else if (score > 4 && score <= 6) {
    return "orange";
  } else if (score > 6) {
    return "green";
  }
}

function createMovieObject(
  title,
  completeImgUrl,
  overview,
  year,
  vote_average,
  genresList
) {
  const movieObject = {
    title,
    poster: completeImgUrl,
    summary: overview,
    year: year ? year.slice(0, 4) : "",
    rating: vote_average,
    genres: genresList,
  };

  return movieObject;
}
