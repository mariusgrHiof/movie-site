'use strict';

const key = 'c1a299b1b07f504df816ef7dcf5ad793';

let movies = [];
const moviesEl = document.getElementById('movies');
const searchEl = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', () => {
  movies = [];
  moviesEl.innerHTML = '';
  searchMovie(searchEl.value);
  searchEl.value = '';
});

searchEl.addEventListener('keyup', (e) => {
  if (e.code === 'Enter') {
    movies = [];
    moviesEl.innerHTML = '';
    searchMovie(searchEl.value);
    searchEl.value = '';
  }
});

async function searchMovie(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}`;
  const imgUrl = `https://api.themoviedb.org/3/configuration?api_key=${key}`;
  const result = await fetch(url);

  const data = await result.json();

  const imgData = await fetch(imgUrl);
  const imgResult = await imgData.json();

  const baseImgUrl = imgResult.images.base_url;

  let postSize = imgResult.images.poster_sizes[4];

  if (data.results) {
    data.results.forEach((movie) => {
      const completeImgUrl = `${baseImgUrl}/${postSize}${movie.poster_path}`;
      movies.push({
        title: movie.original_title,
        poster: completeImgUrl,
        summary: movie.overview,
      });
    });

    renderMovies();
  }
}

function renderMovies() {
  movies.forEach((movie) => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    const h3Title = document.createElement('h3');
    h3Title.classList.add('title');
    h3Title.textContent = movie.title;

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = movie.poster;

    const movieSummary = document.createElement('div');
    movieSummary.classList.add('movie-summary');

    movieSummary.textContent = movie.summary;

    imgContainer.appendChild(img);

    movieEl.appendChild(imgContainer);
    movieEl.appendChild(h3Title);
    movieEl.appendChild(movieSummary);

    moviesEl.appendChild(movieEl);
  });
}
