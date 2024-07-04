const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';
const WATCH_PROVIDERS_API = (id) => `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=3fd2be6f0c70a2a598f084ddfb75487c`;

const main = document.getElementById('main');
const form = document.getElementById('form');
	@@ -11,7 +11,7 @@ var prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.d

// Function for fetching movies
const fetchMovies = async (page, url) => {
    const response = await fetch(url + `${page}`);
    const data = await response.json();
    return data.results;
};
	@@ -59,7 +59,7 @@ async function showMovies(movies) {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
	@@ -70,25 +70,25 @@ async function showMovies(movies) {
                ${overview}
                ${watchProvidersHTML}
            </div>
        `;
        main.appendChild(movieEl);
    }
}

// Function to generate HTML for watch providers
function getWatchProvidersHTML(watchProviders) {
  if (!watchProviders || !watchProviders.US || !watchProviders.US.flatrate) {
    return `<div class="watch-providers" style="color:black;"><h4 style="color:#960606;text-decoration:underline;">Watch on:</h4>*Not available on any platform</div>`;
  }
  const providers = watchProviders.US.flatrate || [];
  const providersHTML = providers.map(provider => {
      if (provider.logo_path) {
          return `<img src="https://image.tmdb.org/t/p/w92${provider.logo_path}" title="${provider.provider_name}" style="width: 40px; height: 40px; margin-right: 7px;">`;
      } else {
          return `<span style="margin-right: auto; font-size: 14px;">${provider.provider_name}</span>`;
      }
  }).join('');
  return providers.length > 0 ? `<div class="watch-providers"><h4 style="color:#960606;text-decoration:underline;">Watch on:</h4>${providersHTML}</div>` : '';
}

// Function for generating class based on rating
	@@ -104,29 +104,34 @@ function getClassByRate(vote) {

// Event listener for search form
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);

        search.value = '';
    } else {
        window.location.reload();
    }
});

// JS for sidebar toggle
var flag = true;
document.getElementById('sidebar-toggle').addEventListener('click', function () {
    if (flag) {
        this.innerHTML = "&#10005;";
        flag = false;
    } else {
        flag = true;
        this.innerHTML = "☰";
    }
    document.body.classList.toggle('sidebar-visible');
});

	@@ -165,17 +170,17 @@ const handleLinkClick = (url, element) => {
// JavaScript for dropdown content
document.getElementById('revenue').addEventListener('click', function (event) {
    event.preventDefault();
    handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=', this);
    prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc';
});
document.getElementById('popularity').addEventListener('click', function (event) {
    event.preventDefault();
    handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=', this);
    prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc';
});
document.getElementById('rating').addEventListener('click', function (event) {
    event.preventDefault();
    handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=', this);
    prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc';
});
document.getElementById('popularity').classList.add('active');
	@@ -219,11 +224,13 @@ document.querySelectorAll('#dropdown-content2 a').forEach((link) => {

        let genreUrl;
        if (genreId === '111') {
            genreUrl = `${prev_url}&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=`;
        } else {
            genreUrl = `${prev_url}&with_genres=${genreId}&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=`;
        }
    handleGenreLinkClick2(genreUrl, this);

});
});
