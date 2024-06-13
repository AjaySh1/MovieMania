const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page='
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

var prev_url='https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc';
//function for fetching movies
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



//function for showing movies
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

//function for genarating class
function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}
//js for search button
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
// js for head ends here





// js for side bar starts here

document.getElementById('sidebar-toggle').addEventListener('click', function() {
  document.body.classList.toggle('sidebar-visible');
});


//js for filter starts
document.addEventListener("DOMContentLoaded", () => {
  let filterButton = document.getElementById("filter");
  let dropdownContent = document.querySelector(".dropdown-content");
  let dropdown=document.querySelector(".dropdown");
  let addto = document.getElementById("add-to-watchlist");
  filterButton.addEventListener("click", () => {
      if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
             addto.style.marginTop="20px";
             dropdown.style.backgroundColor='';
            
      } else {
          
          dropdownContent.style.display = "block";
          addto.style.marginTop="120px";
          dropdown.style.backgroundColor='#960606';
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
//javascript for dcropdown content
document.getElementById('revenue').addEventListener('click', function () {
  event.preventDefault();
  handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=', this);
  prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc';
});
document.getElementById('popularity').addEventListener('click', function () {
  event.preventDefault();
  handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=', this);
  prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc';
});
document.getElementById('rating').addEventListener('click', function () {
  event.preventDefault();
  handleLinkClick('https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=', this);
  prev_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc';
});
//js for filter ends
document.getElementById('popularity').classList.add('active');

// js for genre part start
document.addEventListener("DOMContentLoaded", () => {
  let filterButton = document.getElementById("filt");
  let dropdownContent = document.getElementById("dropdown-content2");
  let dropdown=document.getElementById("did");
  filterButton.addEventListener("click", () => {
      if (dropdownContent.style.display === "flex") {
          dropdownContent.style.display = "none";
          dropdown.style.backgroundColor="";
      } else {
          dropdownContent.style.display = "flex";
          dropdown.style.backgroundColor="#960606";
      }
  });
});

// Function to handle genre link clicks
const handleGenreLinkClick2= (url, element) => {
  fetchAllMovies(url)
    .then(movies => { showMovies(movies); })
    .catch(error => console.error('Error fetching movies:', error));

  // Update active link background color
  document.querySelectorAll('#dropdown-content2 a').forEach((link)=> {
    link.style.backgroundColor = '';  // Reset background color
  });
  element.style.backgroundColor = 'rgb(129, 125, 130)';  // Set 
};

// Event listeners for genre links in the second dropdown
document.querySelectorAll('#dropdown-content2 a').forEach((link) => {
  link.addEventListener('click', function (event) {
   
    let genreId = this.id;
  
    let genreUrl;
    if(genreId==='111')
      {
          genreUrl=`${prev_url}&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=`
      }
      else
      {
           genreUrl = `${prev_url}&with_genres=${genreId}&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=`;
      }

    handleGenreLinkClick2(genreUrl, this);
  });
});
document.getElementById('111').classList.add('active');
// 

// js for genre part ends.