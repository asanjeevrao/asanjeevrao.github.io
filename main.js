//reference implementation - https://nickarocho.github.io/minesweeper/


//Define HTML elements
const resetButton = document.querySelector("#reset"); //reset button
//const gameCell = document.querySelectorAll("td.game-cell");
//let gameCell;
const timer = document.querySelector("#timer");
const minesCount = document.querySelector("#bomb-counter");
const easyGame = document.querySelector("#size-9");
const mediumGame = document.querySelector("#size-16");
const hardGame = document.querySelector("#size-30");
const gameTable = document.querySelector("tbody.game-cells");
//console.log(gameTable);

gameTable.addEventListener('click', () => cellClicked(event.target)); //is there a way to write just the function name and arguments without adding the () & => like you would in a function without any arguments
gameTable.addEventListener('contextmenu', () => flagCell(event,event.target));

//Define actions for clicks 
//gameCell.forEach( e => e.addEventListener('click', cellClicked));
//gameCell.forEach( e => e.addEventListener('contextmenu', flagCell)); //right click to flag mine
resetButton.addEventListener('click', resetGame); //click on smiley face resets game 
easyGame.addEventListener('click', resetGame);
mediumGame.addEventListener('click', resetGame);
hardGame.addEventListener('click', resetGame);

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
let cellArray = []; //Create new cell objects & cell array with all these objects 
let counter;
let gameState; // refreshed, ongoing, ended
let mines = 40; 
let boardSize = 16;

//resets cell objects, randomly assign cells to be mines and calculate number of neighbours for the rest
function resetGame(){
   switch(this){
        case easyGame:
            mines = 10;
            boardSize = 9;
            break;
        case mediumGame:
            mines = 40;
            boardSize = 16;
            break;
        case hardGame:
            mines = 160;
            boardSize = 30;
            break;    
    }

    cellArray = [];    //flush old cellArray if it existed
    gameTable.innerHTML = ''; 
    let tableCellElements = '';
    for(i=0; i<boardSize; i++){  //create new CellObjects
        tableCellElements = tableCellElements + '<tr>';
        for(j=0; j<boardSize; j++){
            cellArray.push(new CellObject(i,j));
            tableCellElements = tableCellElements + `<td class="game-cell" data-row="${i}" data-col="${j}"></td>`;
        }
        tableCellElements = tableCellElements + '</tr>';
        //console.log(gameTable);
    }    
    gameTable.innerHTML = gameTable.innerHTML + tableCellElements;

    //cellLoader.innerHTML = tableCellElements;
    //console.log(tableCellElements);
    //console.log(cellLoader);

    shuffleArray(cellArray);
    for (i=0; i<mines; i++){ //pick objects as mines after shuffling array
        cellArray[i].type = 'mine';
    }
    cellArray.forEach(cell => {
        cell.neighbours = calculateNeighbours(cell); //calculate number of neighbours for each cell object
        let elem = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
            elem.innerText = '';
            elem.classList.remove("selected-mine", "revealed");
        //displayCell(cell);
    });
    timer.innerText = '000'; //set timer to 0 
    minesCount.innerText = `0${mines}`;
    resetButton.innerHTML = `<img src="images/smiley-face.png">`;
    gameState = 'refreshed';
    clearInterval(counter);
    //console.log(cellArray)
} 

//console.log(document.querySelector("[data-row='1'][data-col='8']"));

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array){
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function calculateNeighbours(obj){
  return listNeighbours(obj).reduce((sum, cell) => {
           if(cell.type === 'mine')
             sum++;    
           return sum;
        }, 0);
};

function flagCell (event, elem){  //why is this being highlighted as a Construtor function? 
    console.log(elem);
    event.preventDefault(); //don't open right click menu
    const cellObjClicked = findClickedObj(elem);
    console.log(cellObjClicked);
    if(cellObjClicked.state === true) return; // right click on opened cells should do nothing
    else if(cellObjClicked.useraction === 'free'){
        elem.innerHTML = `<img src="images/flag.png">`
        cellObjClicked.useraction = 'flagged';
        minesCount.innerText = `0${parseInt(minesCount.innerText)-1}`;
    }
    else {
        elem.innerHTML = '';
        cellObjClicked.useraction = 'free'; 
        minesCount.innerText = `0${parseInt(minesCount.innerText)+1}`;
    }   
    //return false;
};

//determine action on click
function cellClicked(elem){
    const objSelected = findClickedObj(elem);
    if(gameState ==='ended' || objSelected.state || objSelected.useraction === 'flagged') 
    //game has ended or selected cell is already opened or selected cell has been flagged by user
        return;
    else if(objSelected.type === 'mine') //mine cell, so game ends
        endGame(elem);
    else if(objSelected.neighbours === 0) //safe cell with zero neighbours, so it opens a set of cells around it
        openCellRange(objSelected); 
    else displayCell(objSelected); //safe cell with non-zero neighbours, so the cell value is displayed

    if(gameState === 'refreshed') //if it is the first click, i.e. game just started
        {startTimer();
         gameState = 'ongoing';
         //console.log('timer started');
        }
}

function startTimer(){ 
    counter = setInterval(() => {
        let currentTime = parseInt(timer.innerText) + 1;
        if (currentTime < 10)
            currentTime = `00${currentTime}`
        else if (currentTime < 100)
            currentTime = `0${currentTime}`;
        timer.innerText = currentTime.toString();
    }, 1000);
}

function findClickedObj(elem){ //takes element and returns the corresponding cell object
    const rowClicked = elem.dataset.row; 
    const colClicked = elem.dataset.col;
    return cellArray.filter(cellObj => cellObj.row === parseInt(rowClicked) && cellObj.col === parseInt(colClicked))[0];
}

function displayCell(obj){
    let cellElement = document.querySelector(`[data-row="${obj.row}"][data-col="${obj.col}"]`);
    cellElement.innerHTML = obj.type === 'mine' ? `<img src="images/bomb.png">` : (obj.neighbours > 0? obj.neighbours : '');
    if(obj.type !='mine') 
        cellElement.classList.add("revealed");
    obj.state = true;
}

function openCellRange(obj){
    displayCell(obj);
    listNeighbours(obj).forEach(elem => {
        if(elem.state===true || elem.useraction === 'flagged') return;
        if(elem.neighbours===0)  
            openCellRange(elem);
        else displayCell(elem);
    })
}    

function endGame(elem){
 resetButton.innerHTML = `<img src="images/dead-face.png">`;
 gameState = 'ended';
 clearInterval(counter);
 //elem.style.backgroundColor = "red";
 cellArray.forEach(cell => displayCell(cell));
 elem.classList.add("selected-mine");
 //console.log('cleared');
}

function listNeighbours(obj){ //returns an array of neighbouring objects to the object passed in argument
    return cellArray.filter((cell) => {
        return [-1,0,1].includes(cell.row - obj.row) && 
               [-1,0,1].includes(cell.col - obj.col) && 
               !(cell.row === obj.row && cell.col === obj.col)
     });
}
