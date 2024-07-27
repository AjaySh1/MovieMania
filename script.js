const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3ba758977c84617b0c5934c60b2a67b4&include_adult=false&page=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3ba758977c84617b0c5934c60b2a67b4&include_adult=false&query=';
const WATCH_PROVIDERS_API = (id) => `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=3ba758977c84617b0c5934c60b2a67b4`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

var prev_url = API_URL;

// Define a global variable to store movies and watchlist
let movies = [];
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];



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

// Function to fetch watch providers for a movie
const fetchWatchProviders = async (id) => {
    const response = await fetch(WATCH_PROVIDERS_API(id));
    const data = await response.json();
    return data.results;
};

// Function for showing movies
async function showMovies(moviesArray) {
    movies = moviesArray; // Store the movies globally
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
                <button class="watchlist-btn" data-id="${id}" >Add to Watchlist</button>
            </div>
        `;
        main.appendChild(movieEl);
    }

    // Add event listeners to the watchlist buttons
    document.querySelectorAll('.watchlist-btn').forEach(button => {
        button.addEventListener('click', addToWatchlist);
    });
}

 function addToWatchlist(event) {
    const movieId = parseInt(event.target.dataset.id);
    const movie = movies.find(m => m.id === movieId); // Use global 'movies' array

    if (!watchlist.some(m => m.id === movieId)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${movie.title} added to your watchlist!`);
    } else {
        alert(`${movie.title} is already in your watchlist!`);
    }
}
async function showWatchlist() {
    main.innerHTML = '';

    for (const movie of watchlist) {
        const { title, poster_path, vote_average, overview, id } = movie;

        // Fetch watch providers asynchronously
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
const getMovies = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            showMovies(data.results);
        } else {
            main.innerHTML = `<h2>No results found</h2>`;
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        main.innerHTML = `<h2>Error fetching search results. Please try again later.</h2>`;
    }
};
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
    element.style.backgroundColor = 'rgb(129, 125, 130)';  // Set background color for the selected genre
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



document.addEventListener("DOMContentLoaded", () => {
    let filterButton = document.getElementById("addtowatchlist");
    
    let dropdown = document.getElementById("add-to-watchlist");

    filterButton.addEventListener("click", () => {
      
        if (dropdownContent.style.backgroundColor === "#960606") {
            
            dropdown.style.backgroundColor = "";
            
        } else {
            
            dropdown.style.backgroundColor = "#960606";
        }
    });
});