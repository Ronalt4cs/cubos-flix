const input = document.querySelector('.input');
const root = document.querySelector(':root');
const body = document.querySelector('body');

const moviesContainer = document.querySelector('.movies-container .movies');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const btnCloseModal = document.querySelector('.modal__body .modal__close');
const btnTheme = document.querySelector('.btn-theme');

let currentMovie = 0;
let currentPage = 0;
let movieList = getMovieList();

async function getMovieList() {
   const response = await api.get('discover/movie?language=pt-BR&include_adult=false');
   try {
      const movieList = response.data.results
      return movieList;

   } catch (error) {
      console.log(error);
   }
}
function applyTheme() {
   if (localStorage.getItem('theme') === 'dark') {
      root.style.setProperty('--background', '#1B2028');
      root.style.setProperty('--bg-secondary', '#2D3440');
      root.style.setProperty('--text-color', '#FFF');
      root.style.setProperty('--input-color', '#665F5F');
      btnPrev.src = './assets/arrow-left-light.svg';
      btnNext.src = './assets/arrow-right-light.svg';
      btnTheme.src = './assets/dark-mode.svg';
      btnCloseModal.src = './assets/close.svg';
      return
   }
   root.style.setProperty('--background', '#fff');
   root.style.setProperty('--bg-secondary', '#ededed');
   root.style.setProperty('--text-color', '#1b2028');
   root.style.setProperty('--input-color', '#979797');
   btnPrev.src = './assets/arrow-left-dark.svg';
   btnNext.src = './assets/arrow-right-dark.svg';
   btnTheme.src = './assets/light-mode.svg';
   btnCloseModal.src = './assets/close-dark.svg';
   return
}

if (localStorage.getItem('theme') == null) {
   localStorage.setItem('theme', 'light');
}
applyTheme();

btnTheme.addEventListener('click', () => {
   if (localStorage.getItem('theme') === 'light') {
      localStorage.setItem('theme', 'dark');
      applyTheme();
      return
   }
   localStorage.setItem('theme', 'light');
   applyTheme();
   return
})

function fillMoviesInWatchlist(movies) {

   movieList = movies || movieList;
   const totalMoviesInList = 6;

   movieList.then((res) => {
      for (let i = 0; i < totalMoviesInList; i++) {

         const movie = document.createElement('div');
         const movieTitle = document.createElement('span');
         const movieInfo = document.createElement('div');
         const movieRating = document.createElement('span');
         const ratingStar = document.createElement('img');

         movie.style.backgroundImage = `url(${res[currentMovie].poster_path})`;
         movie.id = res[currentMovie].id;
         movieTitle.textContent = res[currentMovie].title;
         movieRating.textContent = res[currentMovie].vote_average.toFixed(1);
         ratingStar.src = './assets/estrela.svg';

         movieTitle.classList.add('movie__title');
         movieRating.classList.add('movie__rating');
         movieInfo.classList.add('movie__info');
         movie.classList.add('movie');

         movieInfo.appendChild(movieTitle);
         movie.appendChild(movieInfo);
         movieInfo.appendChild(movieRating);
         movieInfo.appendChild(ratingStar);

         currentMovie++;
         moviesContainer.appendChild(movie);
      }
   });
}

fillMoviesInWatchlist();

function clearWatchList(currentMovieValue) {
   currentMovie = currentMovieValue || 0;
   moviesContainer.innerHTML = '';
   return currentMovie;
}

btnNext.addEventListener('click', () => {
   moviesContainer.innerHTML = '';
   if (currentPage === 0) {
      currentPage++;
      clearWatchList(6);
      fillMoviesInWatchlist();
      return
   }
   if (currentPage === 1) {
      currentPage++;
      clearWatchList(12);
      fillMoviesInWatchlist();
      return
   }
   if (currentPage === 2) {
      currentPage = 0;
      clearWatchList();
      fillMoviesInWatchlist();
      return
   }
});

btnPrev.addEventListener('click', () => {
   moviesContainer.innerHTML = ''
   if (currentPage === 0) {
      currentPage = 2;
      clearWatchList(12);
      fillMoviesInWatchlist();
      return
   }
   if (currentPage === 1) {
      currentPage--;
      clearWatchList();
      fillMoviesInWatchlist();
      return
   }
   if (currentPage === 2) {
      currentPage--;
      clearWatchList(6);
      fillMoviesInWatchlist();
      return
   }
});

async function findMovie(movieName) {

   const res = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${movieName}`);

   try {
      const moviesFounds = res.data.results;
      return moviesFounds;

   } catch (error) {
      console.log(error);
   }
}

input.addEventListener('keypress', (event) => {

   if (event.key === 'Enter') {
      if (!input.value) {
         currentPage = 0;
         movieList = getMovieList();
         clearWatchList();
         fillMoviesInWatchlist();
         return movieList;
      }
      movieList = findMovie(input.value);
      clearWatchList();
      fillMoviesInWatchlist(movieList);
      input.value = '';
      return movieList;
   }

});

const videoMovieOfTheDay = document.querySelector('.highlight__video');
const titleMovieOfTheDay = document.querySelector('.highlight__title');
const ratingMovieOfTheDay = document.querySelector('.highlight__rating');
const genresMovieOfTheDay = document.querySelector('.highlight__genres');
const launchMovieOfTheDay = document.querySelector('.highlight__launch');
const descriptionMovieOfTheDay = document.querySelector('.highlight__description');
const videoLinkMovieOfTheDay = document.querySelector('.highlight__video-link');

async function getMovieOfTheDay() {
   const res = await api.get('/movie/436969?language=pt-BR');
   const resVideo = await api.get('/movie/436969/videos?language=pt-BR');

   try {
      const movieLaunchDate = new Date(res.data.release_date).toLocaleDateString("pt-BR", {
         year: "numeric",
         month: "long",
         day: "numeric",
         timeZone: "UTC",
      });

      videoMovieOfTheDay.style.backgroundImage = `url(${res.data.backdrop_path})`;
      videoLinkMovieOfTheDay.href = `https://www.youtube.com/watch?v=${resVideo.data.results[0].key}`;
      titleMovieOfTheDay.textContent = res.data.title;
      ratingMovieOfTheDay.textContent = res.data.vote_average.toFixed(1);
      launchMovieOfTheDay.textContent = movieLaunchDate;
      descriptionMovieOfTheDay.textContent = res.data.overview;

      const totalGenres = 3;
      for (let i = 0; i < totalGenres; i++) {
         genresMovieOfTheDay.textContent += `${res.data.genres[i].name}, `;
      }

   } catch (error) {
      console.log(error);
   }
}

getMovieOfTheDay();

const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__body .modal__title');
const modalImg = document.querySelector('.modal__body .modal__img ');
const modalDescription = document.querySelector('.modal__body .modal__description');
const modalAverage = document.querySelector('.modal__body .modal__average');
const modalGenres = document.querySelector('.modal__body .modal__genres');

moviesContainer.addEventListener('click', (movie) => {
   const movieId = movie.srcElement.id;
   openModal(movieId);
});

async function openModal(movieId) {
   const res = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movieId}?language=pt-BR`);
   modalTitle.textContent = res.data.title;
   modalImg.src = res.data.backdrop_path;
   modalDescription.textContent = res.data.overview;
   modalAverage.textContent = res.data.vote_average.toFixed(1);

   const totalGenresInModal = res.data.genres.length > 3 ? 3 : res.data.genres.length;

   for (let i = 0; i < totalGenresInModal; i++) {

      const span = document.createElement("span");
      span.textContent = res.data.genres[i].name
      span.classList.add('modal__genre');

      modalGenres.appendChild(span);
   }
   modal.classList.remove('hidden');
}
function closeModal() {
   modal.classList.add('hidden');
   modalGenres.innerHTML = '';
}

body.addEventListener('keydown', (event) => {
   if (event.key === 'Escape') {
      closeModal();
   }
});

btnCloseModal.addEventListener('click', () => {
   closeModal();
});
