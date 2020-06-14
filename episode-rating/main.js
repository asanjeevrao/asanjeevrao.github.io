const list = document.querySelector("div.episode-list"); //list of episodes
const seeMore = document.querySelector("div.see-more"); //see more button
const form = document.querySelector("form"); //form for adding subreddit
const showSubreddits = document.querySelector("ul.subreddits"); //form for adding subreddit
const searchBar = document.querySelector("input.form-control");
const autocompleteDropDown = document.querySelector("div.autocomplete-items");
const dropdown = document.querySelector(".dropdown-menu");
const dropdownToggle = document.querySelector(".btn-warning");
console.log(dropdownToggle);

//showSubreddits.addEventListener("click", deleteSubreddit);
//searchBar.addEventListener("input", filterResults);
//list.addEventListener("click", clickPost);
form.addEventListener("submit", newSearchEntry);
searchBar.addEventListener("keyup", autocompleteSearch);
//dropdown.addEventListener("click", changeTimePeriod);

let subReddits = JSON.parse(localStorage.getItem("subRedditsLocStor")) || [
  "askreddit",
];
let listHTML = "";
let postObject = [];
let postArray = [];
let period = "day";
let episodeCount = 0;
let episodeList = [];

document.addEventListener("DOMContentLoaded", () => {
  //fetchPosts("the-office");
});

//how to catch 403 errors? Forbidden pages which are private subreddits
async function fetchPosts(showName) {
  episodeList = [];
  episodeCount = 0;
  //returns postObject array which is one JSON response corresponding to each subreddit
  let data, seasons, imdbID;

  try {
    let responseShowName = await fetch(
      `http://www.omdbapi.com/?apikey=88607469&t=${showName}`
    );
    data = await responseShowName.json();
    seasons = data.totalSeasons;
    imdbID = data.imdbID;
    //console.log(data);
    //console.log(data.Title + " " + data.Year + " " + data.imdbID);
  } catch {
    console.log("Error detected while reading name of TV show");
  }

  let outputArray = await Promise.all(
    [...Array(parseInt(seasons)).keys()].map((elem) =>
      fetch(
        `http://www.omdbapi.com/?apikey=88607469&i=${imdbID}&season=${elem + 1}`
      ).then((response) => response.json())
    )
  );

  console.log(outputArray);

  /* Alternative Approach - is there any difference between these methods?
  let promiseArray = [];
  for (let i = 0; i < seasons; i++) {
    promiseArray[i] = fetch(
      `http://www.omdbapi.com/?apikey=88607469&i=${data.imdbID}&season=${i + 1}`
    ).then((response) => response.json());
  }
  const outputArray = await Promise.all(promiseArray);
  */

  outputArray.forEach((seasonObj) => {
    seasonObj.Episodes.forEach((episode) => {
      episodeList.push({
        season: seasonObj.Season,
        episode: episode.Episode,
        title: episode.Title,
        imdbRating: episode.imdbRating,
        imdbID: episode.imdbID,
      });
    });
  });

  episodeList.sort((a, b) => b.imdbRating - a.imdbRating);
  //console.log(episodeList);
  //console.log(episodeList.slice(0, 10));
  renderPosts(episodeList.slice(0, 10));
  episodeCount += 10;
}

async function renderPosts(episodeListObjArray) {
  let z = await Promise.all(
    episodeListObjArray.map((episode) =>
      fetch(
        `http://www.omdbapi.com/?apikey=88607469&i=${episode.imdbID}`
      ).then((response) => response.json())
    )
  );

  episodeListObjArray.forEach((episode, index) => {
    episode.plot = z[index].Plot;
    episode.img = z[index].Poster;
  });

  listHTML = episodeCount === 10 ? "" : listHTML;
  episodeListObjArray.forEach((element) => {
    listHTML =
      listHTML +
      `
    <div class = "card bg-light mb-3" data-id = "${element.imdbID}" data-subreddit = "placeholder">
    <div class="card-header"> Season ${element.season} Episode ${element.episode} </div>
    <img class="card-img-top" src="${element.img}" alt="Card image cap">  
    <div class = "card-body">
        
          <h6 class="card-title">${element.title} <span class = "badge badge-primary" style = "margin-left : 10px">IMDB ${element.imdbRating}</span></h6> 
          <p class="card-text mb-2 text-muted" style = "font-size : 0.8em"> ${element.plot}</p>
       
      </div>
    </div>`;
  });

  list.innerHTML = listHTML;
  seeMore.style.display = episodeCount > episodeList.length ? "none" : "block";
}

seeMore.addEventListener("click", fetchMoreEpisodes);

function fetchMoreEpisodes() {
  renderPosts(episodeList.slice(episodeCount - 1, episodeCount + 9));
  episodeCount += 10;
}

/*function clickPost() {
  const postID = event.target.closest(".card");
  window.open(
    `https://www.reddit.com/r/${postID.dataset.subreddit}/comments/${postID.dataset.id}`
  );
}
*/

function newSearchEntry() {
  event.preventDefault();
  const input = this.querySelector('input[type="text"]');
  const searchTerm = input.value;
  input.value = "";
  document.querySelector(".show-name").innerText = searchTerm;
  fetchPosts(searchTerm.toLowerCase().trim().split(/\s+/).join("-"));
}

//Auto-complete search

var countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua &amp; Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia &amp; Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central Arfrican Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote D Ivoire",
  "Croatia",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "French West Indies",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauro",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Pierre &amp; Miquelon",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St Kitts &amp; Nevis",
  "St Lucia",
  "St Vincent",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor L'Este",
  "Togo",
  "Tonga",
  "Trinidad &amp; Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks &amp; Caicos",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Virgin Islands (US)",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

function autocompleteSearch() {
  /*
  const term = searchBar.value;
  const suggestedList = countries.filter((country) =>
    country.toLowerCase().includes(term)
  );
  autocompleteDropDown.innerHTML = suggestedList
    .map((elem) => `<div>${elem}</div>`)
    .join(" ");
  console.log(suggestedList);
  */
}
