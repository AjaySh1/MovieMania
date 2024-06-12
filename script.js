const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=vote_count.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page='
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')


const fetchMovies = async (page,url) => {
    const response = await fetch(url+`${page}`);
    const data = await response.json();
    return data.results;
  };
  
  const fetchAllMovies = async (url) => {
    let allMovies = [];
    const totalPages = 2; // Number of pages to fetch
  
    for (let page = 1; page <= totalPages; page++) {
      const movies = await fetchMovies(page,url);
      allMovies = allMovies.concat(movies);
    }
  
    return allMovies;
  };
// Get initial movies
fetchAllMovies(API_URL)
  .then(movies => {showMovies(movies);})
  .catch(error => console.error('Error fetching movies:', error));

// getMovies(API_URL)
// async function getMovies(url) {
//     const res = await fetch(url)
//     const data = await res.json()

//     showMovies(data.results)
// }

function showMovies(movies) {
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
          <h3 >Overview</h3>
          ${overview}
        </div>
        `
        main.appendChild(movieEl)
    })
}

function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value

    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }
})

document.getElementById('sidebar-toggle').addEventListener('click', function() {
  document.body.classList.toggle('sidebar-visible');
});

document.getElementById('where-to-watch').addEventListener('click', function() {
  alert('Where to Watch clicked');
  //add your code
});

document.getElementById('filter').addEventListener('click', function() {
  // alert('Filter clicked');
  // Add your logic here
});

document.addEventListener("DOMContentLoaded", () => {
  let filterButton = document.getElementById("filter");
  let dropdownContent = document.querySelector(".dropdown-content");
  let addto = document.getElementById("add-to-watchlist");
  filterButton.addEventListener("click", () => {
      if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
             addto.style.marginTop="20px";
      } else {
          dropdownContent.style.display = "block";
          addto.style.marginTop="100px";
      }
  });
});
//javascript for dcropdown content
document.getElementById('revenue').addEventListener('click', function () {
  fetchAllMovies('https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=')
      .then(movies => { showMovies(movies); })
      .catch(error => console.error('Error fetching movies:', error));
});
document.getElementById('popularity').addEventListener('click', function () {
  fetchAllMovies('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=')
      .then(movies => { showMovies(movies); })
      .catch(error => console.error('Error fetching movies:', error));
});
document.getElementById('rating').addEventListener('click', function () {
  fetchAllMovies('https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=')
      .then(movies => { showMovies(movies); })
      .catch(error => console.error('Error fetching movies:', error));
});
// filter elements


document.addEventListener("DOMContentLoaded", () => {
  let filterButton = document.getElementById("filt");
  let dropdownContent = document.getElementById("dropdown-content2");
  let addto = document.getElementById("add-to-watchlist");
  filterButton.addEventListener("click", () => {
      if (dropdownContent.style.display === "flex") {
          dropdownContent.style.display = "none";
             
      } else {
          dropdownContent.style.display = "flex";
          
      }
  });
});