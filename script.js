const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3ba758977c84617b0c5934c60b2a67b4&page=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3ba758977c84617b0c5934c60b2a67b4&query=';
const WATCH_PROVIDERS_API = (id) => `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=3ba758977c84617b0c5934c60b2a67b4`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

var prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc';

// Function for fetching movies
const fetchMovies = async (page, url) => {
    const response = await fetch(url + `${page}`);
    const data = await response.json();
    return data.results;
};

const fetchAllMovies = async (url) => {
    let allMovies = [];
    const totalPages = 2; // Number of pages to fetch

    for (let page = 1; page <= totalPages; page++) {
        const movies = await fetchMovies(page, url);
        allMovies = allMovies.concat(movies);
    }

    return allMovies;
};

// Get initial movies
fetchAllMovies(API_URL)
    .then(movies => { showMovies(movies); })
    .catch(error => console.error('Error fetching movies:', error));

async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.results);
}

// Function to fetch watch providers for a movie
const fetchWatchProviders = async (id) => {
    const response = await fetch(WATCH_PROVIDERS_API(id));
    const data = await response.json();
    return data.results;
};

// Function for showing movies
async function showMovies(movies) {
    main.innerHTML = '';

    for (const movie of movies) {
        const { title, poster_path, vote_average, overview, id } = movie;

        const watchProviders = await fetchWatchProviders(id);
        const watchProvidersHTML = getWatchProvidersHTML(watchProviders);

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
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
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Event listener for search form
form.addEventListener('submit', (e) => {
    

    e.preventDefault()

    const searchTerm = search.value

    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }

});

// JS for sidebar toggle
var flag=true;
document.getElementById('sidebar-toggle').addEventListener('click', function () {
    if(flag)
        {
            this.innerHTML="&#10005;";
            flag=false;
        }
        else
        {  flag=true;
            this.innerHTML="☰";
        }
    document.body.classList.toggle('sidebar-visible');
});

// JS for filter dropdown
document.addEventListener("DOMContentLoaded", () => {
    let filterButton = document.getElementById("filter");
    let dropdownContent = document.querySelector(".dropdown-content");
    let dropdown = document.querySelector(".dropdown");
    let addto = document.getElementById("add-to-watchlist");

    filterButton.addEventListener("click", () => {
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
            addto.style.marginTop = "20px";
            dropdown.style.backgroundColor = '';
        } else {
            dropdownContent.style.display = "block";
            addto.style.marginTop = "120px";
            dropdown.style.backgroundColor = '#960606';
        }
    });
});

const handleLinkClick = (url, element) => {
    fetchAllMovies(url)
        .then(movies => { showMovies(movies); })
        .catch(error => console.error('Error fetching movies:', error));

    // Update active link background color
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
};

// JavaScript for dropdown content
document.getElementById('revenue').addEventListener('click', function (event) {
    event.preventDefault();
    handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc&api_key=3ba758977c84617b0c5934c60b2a67b4&page=', this);
    prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc';
});
document.getElementById('popularity').addEventListener('click', function (event) {
    event.preventDefault();
    handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3ba758977c84617b0c5934c60b2a67b4&page=', this);
    prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc';
});
document.getElementById('rating').addEventListener('click', function (event) {
    event.preventDefault();
    handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&api_key=3ba758977c84617b0c5934c60b2a67b4&page=', this);
    prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc';
});
document.getElementById('popularity').classList.add('active');

// JavaScript for genre part
document.addEventListener("DOMContentLoaded", () => {
    let filterButton = document.getElementById("filt");
    let dropdownContent = document.getElementById("dropdown-content2");
    let dropdown = document.getElementById("did");

    filterButton.addEventListener("click", () => {
        if (dropdownContent.style.display === "flex") {
            dropdownContent.style.display = "none";
            dropdown.style.backgroundColor = "";
        } else {
            dropdownContent.style.display = "flex";
            dropdown.style.backgroundColor = "#960606";
        }
    });
});

// Function to handle genre link clicks
document.getElementById('111').style.backgroundColor = 'rgb(129, 125, 130)';
const handleGenreLinkClick2 = (url, element) => {
    fetchAllMovies(url)
        .then(movies => { showMovies(movies); })
        .catch(error => console.error('Error fetching movies:', error));

    // Update active link background color
    document.querySelectorAll('#dropdown-content2 a').forEach((link) => {
        link.style.backgroundColor = '';  // Reset background color
    });
    element.style.backgroundColor = 'rgb(129, 125, 130)';  // Set 
};

// Event listeners for genre links in the second dropdown
document.querySelectorAll('#dropdown-content2 a').forEach((link) => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        let genreId = this.id;

        let genreUrl;
        if (genreId === '111') {
            genreUrl = `${prev_url}&api_key=3ba758977c84617b0c5934c60b2a67b4&page=`;
        } else {
            genreUrl = `${prev_url}&with_genres=${genreId}&api_key=3ba758977c84617b0c5934c60b2a67b4&page=`;
        }
    handleGenreLinkClick2(genreUrl, this);
  
});
});

// js for genre part ends.
