console.log('map_obj loaded');

// Initialize map
var maxMapDim = 6;
var mapWidth = maxMapDim;
var mapHeight = maxMapDim;

var playerObj = {
        x: 0,
        y: 0,
        score: 0
    }

var foodCount = 0;
var mapObj = [];

function initializeMap(h, w) {
    var i = 0;
    while (i < h) {
        var mapRowObj = [];
        var j = 0;
        while (j < w) {
            mapRowObj[j] = {
                x: j,
                y: i,
                hasFood: false
            }
            if ((Math.floor(Math.random() * (1 + 1))) && (i != 0)) {
                mapRowObj[j].hasFood = true;
                foodCount++;
            }
            j++;
        }
        i++;

        mapObj.push(mapRowObj);
    }
}

initializeMap(mapHeight, mapWidth);


// Check for end of grid 
function checkForEndOfGrid(newX, newY) {
    var result = true;
    
    if (newX >= mapWidth) {
        result = false;
    }

    if (newX < 0) {
        result = false;
    }

    if (newY >= mapHeight) {
        result = false;
    }

    if (newY < 0) {
        result = false;
    }

    return result;
}


// Move player
function movePlayer(moveX, moveY) {
    var newX = playerObj.x + moveX;
    var newY = playerObj.y + moveY;
    var result = true;

    if (newX >= mapWidth) {
        newX = mapWidth - 1;
        result = false;
    }

    if (newX < 0) {
        newX = 0;
        result = false;
    }

    if (newY >= mapHeight) {
        newY = mapHeight - 1;
        result = false;
    }

    if (newY < 0) {
        newY = 0;
        result = false;
    }

    playerObj.x = newX;
    playerObj.y = newY;

    // checkForFood();

    console.log(playerObj);
    return result;
}


// Move player right
function moveRight(tilesNrToMove) {
    var result = true;
    var i = 0;
    while ((i < tilesNrToMove) && result) {
        result = movePlayer(1, 0);
        i++;
    }

    return result;
}


// Move player left
function moveLeft(tilesNrToMove) {
    var result = true;
    var i = 0;
    while ((i < tilesNrToMove) && result) {
        result = movePlayer(-1, 0);
        i++;
    }

    return result;
}

// Move player up
function moveUp(tilesNrToMove) {
    var result = true;
    var i = 0;
    while ((i < tilesNrToMove) && result) {
        result = movePlayer(0, -1);
        i++;
    }

    return result;
}


// Move player down
function moveDown(tilesNrToMove) {
    var result = true;
    var i = 0;
    while ((i < tilesNrToMove) && result) {
        result = movePlayer(0, 1);
        i++;
    }

    return result;
}

// Check if player found food 
function checkForFood() {
    var result = false;
    if (mapObj[playerObj.y][playerObj.x].hasFood) {
        playerObj.score++;
        mapObj[playerObj.y][playerObj.x].hasFood = false;
        result = true;
    }
    console.log('Player score: ' + playerObj.score);

    return result;
}