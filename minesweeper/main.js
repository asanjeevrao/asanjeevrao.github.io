//Define HTML elements
const resetButton = document.querySelector("#reset"); //reset button
const timer = document.querySelector("#timer");
const minesCount = document.querySelector("#bomb-counter");
const gameTable = document.querySelector("tbody.game-cells"); //container for the game cells
const levelSelector = document.querySelector('#size-btns');

//Define button actions
gameTable.addEventListener('click', () => cellClicked(event.target)); //is there a way to write just the function name and arguments without adding the () & => like you would in a function without any arguments
gameTable.addEventListener('contextmenu', () => flagCell(event,event.target));
resetButton.addEventListener('click', resetGame); //click on smiley face resets game 
levelSelector.addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', resetGame);

//Define cell object
function CellObject (row, column){
       this.row = row;
       this.col =  column;
       this.state = false;
       this.type = 'safe'
       this.neighbours = 0;
       this.useraction = 'free';
};  

//Declare Global Objects
let cellArray = []; //Array that will store each cell object
let counter; //global timer variable 
let gameState; // refreshed, ongoing, ended
let mines = 40; //number of mines - begins at Medium level
let boardSize = 16; //number of rows & columns - begins at Medium level

//resets cell objects, randomly assign cells to be mines and calculate number of neighbours for the rest
function resetGame(){
    const level = event.target.tagName === 'IMG' ? event.target.parentElement.innerText : event.target.innerText;
    switch(level){
        case ' Easy':
            mines = 10;
            boardSize = 9;
            break;
        case ' Medium':
            mines = 40;
            boardSize = 16;
            break;
        case ' Hard':
            mines = 160;
            boardSize = 30;
            break;    
    }
    //reset game configurations 
    cellArray = [];    //flush old cellArray if it existed
    gameTable.innerHTML = ''; //clear all existing cells in gameTable container from previous iteration
    let tableCellElements = '';
    timer.innerText = '000'; //set timer to 0 
    minesCount.innerText = setToThreeDigits(mines);
    resetButton.innerHTML = `<img src="images/smiley-face.png">`;
    gameState = 'refreshed';
    clearInterval(counter);

    for(i=0; i<boardSize; i++){  //create new Cell Objects & generate HTML code for gameTable container
        tableCellElements = tableCellElements + '<tr>';
        for(j=0; j<boardSize; j++){
            cellArray.push(new CellObject(i,j));
            tableCellElements = tableCellElements + `<td class="game-cell" data-row="${i}" data-col="${j}"></td>`;
        }
        tableCellElements = tableCellElements + '</tr>';
    }    
    gameTable.innerHTML = gameTable.innerHTML + tableCellElements;
    document.querySelectorAll(".menu").forEach(e => {//make menu width dynamic with each level
        e.colSpan = `${boardSize}`;
    })

    shuffleArray(cellArray); //randomize position of cell objects in cellArray
    for (i=0; i<mines; i++){ //pick first 'mines' number of objects as mines after shuffling array
        cellArray[i].type = 'mine';
    }
    cellArray.forEach(cell => {
        cell.neighbours = calculateNeighbours(cell); //calculate number of neighbours for each cell object
    });
    
} 

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array){
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//returns number of neighbours for each cell Object 
function calculateNeighbours(obj){
  return listNeighbours(obj).reduce((sum, cell) => {
           if(cell.type === 'mine')
             sum++;    
           return sum;
        }, 0);
};

//assign actions when a cell is right clicked or long pressed
function flagCell (event, elem){ 
    event.preventDefault(); //don't open right click menu
    const targetCellElem = elem.tagName === 'IMG'? elem.parentElement: elem;
    const cellObjClicked = findClickedObj(elem);
    if(cellObjClicked.state === true) return; // right click on opened cells should do nothing
    else if(cellObjClicked.useraction === 'free'){ //if cell is free then flag it and set state to flagged
        targetCellElem.innerHTML = `<img src="images/flag.png">`
        cellObjClicked.useraction = 'flagged';
        minesCount.innerText = setToThreeDigits(parseInt(minesCount.innerText)-1);
    }
    else { //if cell is flagged then remove the flag and set state to free
        targetCellElem.innerHTML = ''; 
        cellObjClicked.useraction = 'free'; 
        minesCount.innerText = setToThreeDigits(parseInt(minesCount.innerText)+1);
    }   
    //return false;
    if(isVictory()) //check if the flag action resulted in user winning the game 
        wonGame();
};

//set reset and timer numbers to 3 digits
function setToThreeDigits(num){ 
    if(num < -9 || num >= 100) return `${num}`;
    else if (num < 0) return `-0${-num}`;
    else if (num < 10) return `00${num}`;
    else if (num < 100) return `0${num}`;
}

//assign actions when a cell is clicked 
function cellClicked(elem){
    const objSelected = findClickedObj(elem);
    if(gameState ==='ended' || objSelected.state || objSelected.useraction === 'flagged') 
    //game has ended or selected cell is already opened or selected cell has been flagged by user
        return;
    else if(objSelected.type === 'mine') //clicked mine cell, so game ends
        lostGame(elem);
    else if(objSelected.neighbours === 0) //safe cell with zero neighbours, so it opens all the cells around it
        openCellRange(objSelected); 
    else displayCell(objSelected); //safe cell with non-zero neighbours, so just it's own cell value is displayed
    if(gameState === 'refreshed') //if it is the first click, i.e. game just started
        {startTimer();
         gameState = 'ongoing';
        }

    if(isVictory()) //check if the click action resulted in user winning the game 
        wonGame();
}

function startTimer(){ 
    counter = setInterval(() => {
      timer.innerText = setToThreeDigits(parseInt(timer.innerText) + 1);
    }, 1000);
}

//takes element and returns the corresponding cell object
function findClickedObj(elem){ 
    const elemClicked = elem.tagName === 'IMG'? elem.parentElement: elem;
    const rowClicked = elemClicked.dataset.row; 
    const colClicked = elemClicked.dataset.col;
    return cellArray.filter(cellObj => cellObj.row === parseInt(rowClicked) && cellObj.col === parseInt(colClicked))[0];
}

//takes cell object, displays value (neighbour count or mine)
function displayCell(obj){
    let cellElement = document.querySelector(`[data-row="${obj.row}"][data-col="${obj.col}"]`);
    cellElement.innerHTML = obj.type === 'mine' ? `<img src="images/bomb.png">` : (obj.neighbours > 0? obj.neighbours : '');
    
    switch(obj.neighbours){
        case 1:
            cellElement.style.color = "blue";
            break;
        case 2:
            cellElement.style.color = "green";
            break;
        case 3:
            cellElement.style.color = "red";
            break;   
        case 4:
            cellElement.style.color = "navy";
            break;     
    }
    if(obj.type !='mine') 
        cellElement.classList.add("revealed"); //change background for non-mine cells when they are opened
    obj.state = true;
}

function openCellRange(obj){
    displayCell(obj); //first display the selected cell
    listNeighbours(obj).forEach(cell => { //for each neighboring cell object..  
        if(cell.state===true || cell.useraction === 'flagged') return; //if cell is flagged or open, no action
        if(cell.neighbours===0)  //if cell has zero neighbours, run the same function for this cell
            openCellRange(cell);
        else displayCell(cell); //if cell has non-zero neighbours and not flagged or open, then open it 
    });
}    

//set actions when user has lost game
function lostGame(elem){
    resetButton.innerHTML = `<img src="images/dead-face.png">`; //change resetButton icon
    gameState = 'ended';
    clearInterval(counter); //stop timer
    cellArray.forEach(cell => displayCell(cell)); //display all cells
    elem.classList.add("selected-mine"); //add red background for selected mine cell
}

//set actions when user has won game
function wonGame(){
    resetButton.innerHTML = `<img src="images/cool-face.png">`; //change resetButton icon
    gameState = 'ended';
    clearInterval(counter); //stop timer
}

//returns an array of neighbouring objects to the object passed in argument
function listNeighbours(obj){ 
    return cellArray.filter((cell) => {
        return [-1,0,1].includes(cell.row - obj.row) && 
               [-1,0,1].includes(cell.col - obj.col) && 
               !(cell.row === obj.row && cell.col === obj.col)
     });
}

//return if user has won the game 
function isVictory(){ 
    const minesFlagged = cellArray.reduce((count,cell) => { //number of mines flagged by user
        count = cell.useraction==='flagged'? count + 1 : count;
        return count;
    },0)
    const cellsOpened = cellArray.reduce((count,cell) => { //total number of open cells
        count = cell.state===true? count + 1 : count;
        return count;
    },0)
    return minesFlagged === mines && cellsOpened === (boardSize*boardSize-mines); 
}