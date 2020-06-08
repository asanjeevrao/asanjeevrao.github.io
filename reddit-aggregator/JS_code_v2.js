const list = document.querySelector('ul.posts'); //list of posts
const addSubreddits = document.querySelector('form'); //form for adding subreddit 
const showSubreddits = document.querySelector('ul.subreddits'); //form for adding subreddit 
const searchBar = document.querySelector('input#search');
const dropdown = document.querySelector('.dropdown-menu');
const dropdownToggle = document.querySelector('.btn-warning');
console.log(dropdownToggle);

showSubreddits.addEventListener('click', deleteSubreddit);
searchBar.addEventListener('input', filterResults);
list.addEventListener('click', clickPost);
addSubreddits.addEventListener("submit", addNewSubreddit);
dropdown.addEventListener('click', changeTimePeriod);

function changeTimePeriod()
{
  period = event.target.classList[1];
  displayPosts(subReddits);
  dropdownToggle.innerText = event.target.innerText;
  console.log(event.target.innerText);
}

let subReddits = JSON.parse(localStorage.getItem("subRedditsLocStor")) || ['askreddit'];
let listHTML = '';
let postObject = [];
let postArray =[];
let period = 'day';

displaySubReddit(subReddits);
displayPosts(subReddits);

function filterResults(){
    const searchTerm = event.target.value.toLowerCase();
    const filteredArray = postArray.filter( elem => elem.data.title.toLowerCase().includes(searchTerm));
    renderPosts(filteredArray);
}

//how to catch 403 errors? Forbidden pages which are private subreddits 
function fetchPosts(list){ //returns postObject array which is one JSON response corresponding to each subreddit
  return new Promise((resolve) => {
    postObject = [];
    list.forEach (elem => {
        fetch(`https://www.reddit.com/r/${elem}/top.json?t=${period}`)
        .then(response => {
            if(response.status === 403)
                throw new Error('Access denied');
            else 
                return response.json();
        })
        .then(data => {
            postObject.push(data);
            if (list.length === postObject.length){
                resolve(postObject);
            }
        })
        .catch(error => {
            if(error.message === 'Access denied')
                console.log(elem + ' is a private subreddit');
            else console.log(elem + ' is not a valid subreddit');    
        
        }); 
  });  
  });
}

async function displayPosts(array){
  await fetchPosts(array); 
  postArray =[];
  postObject.forEach( elem => {
    elem.data.children.forEach(post => {
        postArray.push(post)
    })
  })
  //console.log(postObject, postObject.map(elem => elem.data.children[0].data.subreddit));
  renderPosts(postArray);
}
  
function renderPosts(array){
    //console.log(array);
    listHTML = '';
    array.forEach(element => {
    listHTML = listHTML + `
    <div class = "card bg-light mb-3" data-id = "${element.data.id}" data-subreddit = "${element.data.subreddit}">
      <div class = "card-body">
        <li>
          <h6 class="card-title">${element.data.title}<span class = "badge badge-primary" style = "margin-left : 10px">${element.data.subreddit}</span></h6> 
          <p class="card-text mb-2 text-muted" style = "font-size : 0.8em"> <i class="fas fa-long-arrow-alt-up fa-lg"></i> Upvotes - ${element.data.ups} <i class="fa fa-comment" style = "margin-left : 10px" ></i> Comments - ${element.data.num_comments}</p>
          <a href = "" class = "stretched-link" onclick = "return false;"></a>
        </li>
      </div>
    </div>
    `
  });
list.innerHTML = listHTML;  
}

function clickPost(){
  const postID = event.target.closest(".card");
  window.open(`https://www.reddit.com/r/${postID.dataset.subreddit}/comments/${postID.dataset.id}`);
}

function addNewSubreddit(){
  event.preventDefault();
  const input = this.querySelector('input[type="text"]');
  const newSubreddit = input.value;
  input.value = '';
  if(subReddits.some(elem => elem === newSubreddit)) {
    alert('Subreddit already exists');
    return;
  }
  else{   
    subReddits.push(newSubreddit);
    displaySubReddit(subReddits);
    displayPosts(subReddits);
    localStorage.setItem("subRedditsLocStor", JSON.stringify(subReddits)); 
  }
} 

function deleteSubreddit(){
  const closeButton = event.target.closest('button');
  if(closeButton){
    const subr = closeButton.closest('div').id;
    subReddits.splice(subr,1);
    displaySubReddit(subReddits);
    displayPosts(subReddits);
    localStorage.setItem("subRedditsLocStor", JSON.stringify(subReddits));
    //console.log(subr);
    //console.log(event.target.classList[0] === "close");
  }
}

function displaySubReddit(list){
  showSubreddits.innerHTML = '';
  showSubreddits.innerHTML = subReddits.map((entry,index) => `
    <div id = "${index}" class = "subreddit-list badge badge-warning badge-pill">
        ${entry} 
        <button type="button" class="close" aria-label="Dismiss">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    `).join('');                              
}
    


