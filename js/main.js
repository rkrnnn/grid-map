console.log('main.js loaded');

var mapDisplay = document.querySelector(".map");
var tilesNrDisplay = document.querySelector("#tiles-number-display");
var noFoodMsg = document.querySelector("#no-food-msg");
var newWidthInput = document.querySelector("#new-width");
var newHeightInput = document.querySelector("#new-height");

var defaultFace = '◔◡◔';
var newFace = 'ᗒᗣᗕ';
var eatingFace01 = '◕∇◕';
var eatingFace02 = '´ω｀';
var happyFace = '⁀∇⁀';
var player = defaultFace;

var emptySpace = '';
var foodSpace = '✿';
const cordSeparator = '-';

var tilesNr = maxMapDim * maxMapDim;

tilesNrDisplay.innerText = tilesNr;

// Add event listener for keyboard up, down, left, right inputs
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "ArrowLeft":
            // Left pressed
            movePlayerCall(-1, 0);
            break;
        case "ArrowRight":
            // Right pressed
            movePlayerCall(1, 0);
            break;
        case "ArrowUp":
            // Up pressed
            movePlayerCall(0, -1);
            break;
        case "ArrowDown":
            // Down pressed
            movePlayerCall(0, 1);
            break;
    }
});



// Update width and height of grid using user input 
function updateWidthHeight() {
    var newHeight = newHeightInput.value;
    var newWidth = newWidthInput.value;

    var errorCases = [' ', ''];

    if ((newHeight) && (newWidth) && (!isNaN(newHeight)) && (!isNaN(newWidth))) {
        if ((newHeight > 0) && (newWidth > 0)) {
            if ((newHeight > 10) && (newWidth > 10)){
                alert('Oops! Not enough space. Maximum is 10 tiles, otherwise your screen is full.');
            }
            else {
                tilesNr = newHeight * newWidth;
                tilesNrDisplay.innerText = tilesNr;
            
                mapWidth = newWidth;
                mapHeight = newHeight;
            
                foodCount = 0;
                mapObj = [];   
                playerObj.score = 0; 
                playerObj.x = 0;
                playerObj.y = 0;
                initializeMap(mapHeight, mapWidth);
                initializeMapDisplay();
                placePlayer();
            }
        }
        else {
            alert('Please enter a positive numeric value!');
        }
    }
    else {
        alert('Please enter a positive numeric value!');
    }

    newHeightInput.value = '';
    newWidthInput.value = '';
}

// Redraw map following mapObj
function initializeMapDisplay() {
    var i = 0;
    mapDisplay.innerHTML = '';

    while (i < mapHeight) {
        var j = 0;

        var mapRowSection = document.createElement("DIV");
        mapRowSection.className = "row";

        while (j < mapWidth) {
            var mapSection = document.createElement("DIV");
            var mapSectionDisplay = document.createElement("SPAN");
            mapSection.appendChild(mapSectionDisplay);
            mapSection.id = i + cordSeparator + j;
            // mapSection.id = mapSection.id + j;
            mapSection.className = "tile";
            mapSection.addEventListener("click", function(event){
                moveToTile(event.target);
            });
            mapRowSection.appendChild(mapSection); 
        
            if (mapObj[i][j].hasFood) {
                mapSectionDisplay.innerText = foodSpace;
                mapSection.classList.add("food-tile");
            }
            j++;
        }

        mapDisplay.appendChild(mapRowSection);
        i++;
    }

    refreshScore();

}



// Place player
function placePlayer() {
    var tileID = playerObj.y + cordSeparator + playerObj.x;
    console.log('Look for tile with id ' + tileID);
    
    var playerTile = document.getElementById(tileID);
    console.log(playerTile);
    
    playerTile.firstChild.innerText = player;
    playerTile.classList.add("player");
    playerTile.classList.remove("food-tile");
    playerTile.addEventListener("click", function(event){
        changeFace();
    });
}

function removePlayer() {
    var tileID = playerObj.y + cordSeparator + playerObj.x;
    var playerTile = document.getElementById(tileID);
    playerTile.classList.remove("player");
    playerTile.firstChild.innerText = '';
}

initializeMapDisplay();
placePlayer();


// Move player call 
function movePlayerCall(moveX, moveY) {
    var success = true;
    removePlayer();

    if (moveX) {
        if (moveX < 0) {
            success = moveLeft(1);
        }
        else {
            success = moveRight(1);
        }
    }
    if (moveY) {
        if (moveY < 0) {
            success = moveUp(1);
        }
        else {
            success = moveDown(1);
        }
    }

    placePlayer();
    checkForFoodCall();
    
    if (noFoodAngry()) {
        return;
    }
    
    if (!success) {
        changeFace();
    }
}

// Check for food call
function checkForFoodCall(){
    if (checkForFood()) {
        changeFaceEating();
        refreshScore();
    }
}


// Change face to angry face
function changeFace() {
    keepAngryFace();
    document.querySelector(".player").firstChild.style.animationIterationCount = "1";
    setTimeout(changeFaceBack,600);
}

function keepAngryFace() {
    var playerDisplay = document.querySelector(".player").firstChild;

    playerDisplay.innerText = newFace;
    playerDisplay.style.animation = "shake 0.4s";
    playerDisplay.style.animationIterationCount = "infinite";
}

function changeFaceBack() {
    var playerDisplay = document.querySelector(".player").firstChild;

    playerDisplay.innerText = defaultFace;
    playerDisplay.style.animation = "";
    playerDisplay.style.animationIterationCount = "0";

    noFoodAngry();
}


// Change face to eating face
function changeFaceEating() {
    var playerFace = document.querySelector(".player").firstChild;
    
    console.log('Found food on tile ' + playerObj.y + playerObj.x);
    playerFace.innerText = eatingFace01;
    
    setTimeout(changeFaceBack,1000);
}

// Change face to eating face
function changeFaceHappy() {
    var playerFace = document.querySelector(".player").firstChild;
    
    playerFace.innerText = happyFace;
    playerFace.style.animation = "shake 0.4s";
    playerFace.style.animationIterationCount = "2";
    
    setTimeout(changeFaceBack,1000);
}


// Refresh number of flowers
function refreshScore() {
    var playerScoreDisplay = document.querySelector("#player-score-display");

    playerScoreDisplay.innerText = foodCount - playerObj.score;

    noFoodAngry();
}

// Make player angry when no food
function noFoodAngry() {
    var result = false;
    if (foodCount == playerObj.score) {
        noFoodMsg.style.display = "";
        keepAngryFace();
        result = true;
    }
    return result;
}


// Move player to clicked tile
function moveToTile(btn) {
    var id = btn.id;
    console.log(id);

    var newX = '';
    var newY = '';
    var i = 0;
    while ((i < id.length) && (id[i] != cordSeparator)) {
        newY = newY + id[i];
        i++;
    }
    var i = id.length - 1;
    while ((i > 0) && (id[i] != cordSeparator)) {
        newX = newX + id[i];
        i--;
    }

    console.log('x = ' + newX + ', y = ' + newY);
    newX = parseInt(newX);
    newY = parseInt(newY);

    var moveX = newX - playerObj.x;
    var moveY = newY - playerObj.y;
    console.log(moveX, moveY);

    moveRepeat(moveX, moveY);

}

async function moveRepeat(x , y) {
    if (x > 0) {
        var i = 0;
        while (i < x) {
            movePlayerCall(x, 0);
            await sleep(500);
            i++;
        }
    }
    if (x <= 0) {
        var i = x;
        while (i < 0) {
            movePlayerCall(x, 0);
            await sleep(500);
            i++;
        }
    }
    if (y > 0) {
        var i = 0;
        while (i < y) {
            movePlayerCall(0, y);
            await sleep(500);
            i++;
        }
    }
    if (y <= 0) {
        var i = y;
        while (i < 0) {
            movePlayerCall(0, y);
            await sleep(500);
            i++;
        }
    }

    if (noFoodAngry()) {
        return;
    }
    changeFaceHappy();
    
}

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }
