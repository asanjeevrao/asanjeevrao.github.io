//Define HTML elements
const gameScore = document.querySelector("#score-counter");

//start, play & pause elements & actions
const startButton = document.querySelector('#start');
const play = document.querySelector('.fa-play-circle');
const pause = document.querySelector('.fa-pause-circle');

startButton.addEventListener('click', gameControls);

//volume & audio related
const audio = new Audio('soundtrack.mp3');
const volumeControl = document.querySelector(".volume");
const volumeOn = document.querySelector(".fa-volume-up");
const volumeOff = document.querySelector(".fa-volume-mute");

volumeControl.addEventListener('click', toggleVolume);

//Define keyboard actions
document.addEventListener('keydown', setKeyboardAction);
document.addEventListener('keyup', checkDownArrowRelease);
let downArrowState = false;

var tetTimer;
var elementsGrid = [];

let orientation = 0;   
let boardSizeRow = 19; 
let boardSizeCol = 9;
let score = 0;

let startRow;
let startCol;       
let verticalCollision, leftCollision, rightCollision;
let gameStateCopy = 'not started';
let currentTetromino;
let currentTetrominoOrientation;
let currentTetrominoColour;
let gameOver = false;

document.addEventListener('DOMContentLoaded', ()=> {
    for (let i = 0; i <= boardSizeRow; i++){ //15 rows
        let colArray = [];
        for (let j = 0; j <= boardSizeCol; j++){ //15 columns
            colArray[j] = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        }
    elementsGrid.push(colArray);    
    }
})

function gameControls(){
   if(gameStateCopy === 'game over'){
    elementsGrid.forEach(row => {
        row.forEach(col => {
            col.className = "game-cell";
            });
        });
    }
   if(gameStateCopy==='not started' || gameStateCopy === 'game over'){
        //console.log(elementsGrid);
        dropNewTetromino();
        gameStateCopy = 'live';
        audio.play();
        play.style.display = 'none';
        pause.style.display = 'block';
   }
    else if(gameStateCopy === 'live'){
        gameStateCopy = 'paused';
        clearInterval(tetTimer);
        audio.pause();
        pause.style.display = 'none';
        play.style.display = 'block';
    }
    else if(gameStateCopy === 'paused'){
        gameStateCopy = 'live';
        tetTimer = setInterval(moveTetromino, 600);
        audio.play();
        play.style.display = 'none';
        pause.style.display = 'block';
    }
    //startButton.innerText = gameStateCopy;
}

function dropNewTetromino(){ //start dropping a new tetromino from position (0,6)
    startRow = 0;
    startCol = 3;
    orientation = 0;
    shuffleArray(tetrominoSet);
    currentTetromino = tetrominoSet[0].shape;
    currentTetrominoColour = tetrominoSet[0].colour;
    //currentTetromino = tetrominoSet[1];
    currentTetrominoOrientation = currentTetromino[orientation];       
    verticalCollision = false;
    leftCollision = false;
    rightCollision = false;
    configureTetrominoColour('set');
    if(gameOver){
        gameStateCopy = 'game over';
        pause.style.display = 'none';
        play.style.display = 'block';
        window.alert('Game over. Your score is ' + score);
        gameOver = false;
    }
    else
        tetTimer = setInterval(moveTetromino, 600);
}

function moveTetromino(){ //move Tetromino     
    if(verticalCollision){
        clearInterval(tetTimer);
        freezeTerminoLocation();
        rowClearCheck();
        dropNewTetromino();
        return;
    }    
    if(gameStateCopy==='paused'){ //scope for error here - if you pause when there is vertical collision, it will not work
        //clearInterval(tetTimer);
        //return;
    }
    configureTetrominoColour('clear');
    startRow++; 
    configureTetrominoColour('set');
}

function rowClearCheck(){
    let rowToBeCleared = [];
    for (let i = 0; i < 4; i++){
        let rowABC = startRow + i;
        if(isRowFull(rowABC))
            rowToBeCleared.push(rowABC);
    }
    switch(rowToBeCleared.length){
        case 0: 
            break;
        case 1:
            score = score + 40;
            break;
        case 2:
            score = score + 100;
            break;
        case 3:
            score = score + 300;
            break;
        case 4:
            score = score + 1200;
            break;        
    }    
    gameScore.innerText = setToThreeDigits(score);
    console.log(rowToBeCleared);
    rowToBeCleared.forEach(row => {
        elementsGrid[row][0].parentElement.classList.add('completed-row');
    });
    setTimeout(() => {
        deleteRow(rowToBeCleared);
    }, 200);
}

function deleteRow(rowArray){
    rowArray.forEach(row => {
        elementsGrid[row][0].parentElement.classList.remove('completed-row');
        for (let i = row; i > 0; i--){
            for (let j = 0; j < boardSizeCol; j++){
                elementsGrid[i][j].className = elementsGrid[i-1][j].className;
            }
        }
        for (let j = 0; j < boardSizeCol; j++){
            elementsGrid[0][j].className = 'game-cell';
        }
    });
}

function isRowFull(rowNumber){
    //console.log(rowNumber);
    if(rowNumber > boardSizeRow)
        return false;
    else    
        return elementsGrid[rowNumber].every( column => [...column.classList].includes('frozen'));
}

function freezeTerminoLocation(){
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            let rowABC = startRow + i;
            let colABC = startCol + j;
            let cellValue = currentTetrominoOrientation[i][j];
            if(rowABC > boardSizeRow || colABC > boardSizeCol || colABC < 0)
                continue;
            if(cellValue === 1){
                //console.log(rowABC,colABC,'added');
                elementsGrid[rowABC][colABC].classList.add('frozen');
                }
        }
    }
}    

function configureTetrominoColour(action){
    if(action === 'set'){
        leftCollision = false;
        rightCollision = false;
    }
    //console.log('loop starting', action);
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            let rowABC = startRow + i;
            let colABC = startCol + j;
            let cellValue = currentTetrominoOrientation[i][j];
            if(rowABC > boardSizeRow || colABC > boardSizeCol || colABC < 0){
             //console.log('exiting loop', rowABC, colABC);
                continue;
            }
            //console.log(rowABC,colABC,cellValue);
            if(action === 'clear' && ![...elementsGrid[rowABC][colABC].classList].includes('frozen')){
                elementsGrid[rowABC][colABC].classList.remove('tetromino');
                elementsGrid[rowABC][colABC].classList.remove(currentTetrominoColour); 
                //console.log(rowABC,colABC,'removed');
            }
            if(action === 'set' && cellValue === 1){
                //console.log(rowABC,colABC,'added');
                if([...elementsGrid[rowABC][colABC].classList].includes('frozen'))
                    gameOver = true;                    
                else
                    elementsGrid[rowABC][colABC].classList.add('tetromino', currentTetrominoColour);
                if(rowABC === boardSizeRow || [...elementsGrid[rowABC + 1][colABC].classList].includes('tetromino')){  //this logic needs to be refined
                    verticalCollision = true;
                    //console.log('vertical collision happened', rowABC);
                }
                if(colABC === 0 || [...elementsGrid[rowABC][colABC - 1].classList].includes('frozen')){  //this logic needs to be refined
                    leftCollision = true;
                    //console.log('left collision happened', colABC);
                }
                if(colABC === boardSizeCol || [...elementsGrid[rowABC][colABC + 1].classList].includes('frozen')){  //this logic needs to be refined
                    rightCollision = true;
                   // console.log('right collision happened', colABC);
                }
            }
        }
    }  
}


function setKeyboardAction(event){
    if(event.keyCode === 37 && leftCollision === false){ //left keystroke
        configureTetrominoColour('clear');
        startCol = Math.max(startCol - 1, -3);
        //console.log(startCol);
        configureTetrominoColour('set');
    }
    if(event.keyCode === 39 && rightCollision === false){ //right keystroke
        configureTetrominoColour('clear');
        startCol = Math.min(startCol + 1, boardSizeCol);
        configureTetrominoColour('set');
    }
    if(event.keyCode === 38){ //rotation logic, needs to improve 
        configureTetrominoColour('clear');
        orientation++;
        currentTetrominoOrientation = currentTetromino[orientation%4];
        configureTetrominoColour('set');
    }
    if(event.keyCode === 40){ //up keystroke, start acceleration 
        if(!downArrowState){
            clearInterval(tetTimer);
            tetTimer = setInterval(moveTetromino, 50);
            //console.log(event.keyCode + 'presssed');
            downArrowState = true;
        }
       
    }
}

function setSwipeAction(swipeDir){
    if(swipeDir === 'l' && leftCollision === false){ //left keystroke
        configureTetrominoColour('clear');
        startCol = Math.max(startCol - 1, -3);
        //console.log(startCol);
        configureTetrominoColour('set');
    }
    if(swipeDir === 'r' && rightCollision === false){ //right keystroke
        configureTetrominoColour('clear');
        startCol = Math.min(startCol + 1, boardSizeCol);
        configureTetrominoColour('set');
    }
    if(swipeDir === 'up'){ //rotation logic, needs to improve 
        configureTetrominoColour('clear');
        orientation++;
        currentTetrominoOrientation = currentTetromino[orientation%4];
        configureTetrominoColour('set');
    }
}

function checkDownArrowRelease(){
    if(event.keyCode === 40){
        clearInterval(tetTimer);
        downArrowState = false;
        //console.log(event.keyCode + 'released');
        tetTimer = setInterval(moveTetromino, 600);
    }
}

function toggleVolume() {
    if([...event.target.classList].includes("fa-volume-up")){
        audio.volume = 0;
        volumeOn.style.display = 'none';
        volumeOff.style.display = 'block';
    }
    else {
        audio.volume = 1;
        volumeOff.style.display = 'none';
        volumeOn.style.display = 'block';
    }
}

//set reset and timer numbers to 3 digits
function setToThreeDigits(num){ 
    if(num < -9 || num >= 100) return `${num}`;
    else if (num < 0) return `-0${-num}`;
    else if (num < 10) return `00${num}`;
    else if (num < 100) return `0${num}`;
}

//Algo to shuffle array 
function shuffleArray(array){
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//Detect swipe on mobile - https://stackoverflow.com/questions/15084675/how-to-implement-swipe-gestures-for-mobile-devices

const ele = document.getElementById('board');
ele.addEventListener('click', () => {
    setSwipeAction('up');
});
detectswipe();

function detectswipe() {
    swipe_det = new Object();
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    var min_x = 30;  //min x swipe for horizontal swipe
    var max_x = 30;  //max x difference for vertical swipe
    var min_y = 20;  //min y swipe for vertical swipe
    var max_y = 60;  //max y difference for horizontal swipe
    var direc = "";
    ele.addEventListener('touchstart',function(e){
      var t = e.touches[0];
      swipe_det.sX = t.screenX; 
      swipe_det.sY = t.screenY;
    },false);
    ele.addEventListener('touchmove',function(e){
      e.preventDefault();
      var t = e.touches[0];
      swipe_det.eX = t.screenX; 
      swipe_det.eY = t.screenY; 
      
      //horizontal detection
      if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
        if(swipe_det.eX > swipe_det.sX) direc = "r";
        else direc = "l";
        setSwipeAction(direc);
        swipe_det.sX = swipe_det.eX;
        swipe_det.sY = swipe_det.eY;
      }
      //vertical detection
      else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
        if(swipe_det.eY > swipe_det.sY){
            moveTetromino();
            swipe_det.sX = swipe_det.eX;
            swipe_det.sY = swipe_det.eY;
        }
      }
    },false);
    
    ele.addEventListener('touchend',function(e){
      direc = "";
      swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    },false);  
  }

