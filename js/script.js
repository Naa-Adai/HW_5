/*
File: script.js
GUI Assignment: Scrabble Game
Mildred Kumah, UMass Lowell Computer Science, mildred_kumah@student.uml.edu
Copyright (c) 2023 by Mildred All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
*/



var pieceLetter = [];
var score = 0;
var totalScore = 0;
var doubleWord = 0;

function resetPieceLetter() {
    pieceLetter = [
        { "letter": "A", "value": 1, "letter-distribution": 9, "remaining-tiles": 9 },
        { "letter": "B", "value": 3, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "C", "value": 3, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "D", "value": 2, "letter-distribution": 4, "remaining-tiles": 4 },
        { "letter": "E", "value": 1, "letter-distribution": 12, "remaining-tiles": 12 },
        { "letter": "F", "value": 4, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "G", "value": 2, "letter-distribution": 3, "remaining-tiles": 3 },
        { "letter": "H", "value": 4, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "I", "value": 1, "letter-distribution": 9, "remaining-tiles": 9 },
        { "letter": "J", "value": 8, "letter-distribution": 1, "remaining-tiles": 1 },
        { "letter": "K", "value": 5, "letter-distribution": 1, "remaining-tiles": 1 },
        { "letter": "L", "value": 1, "letter-distribution": 4, "remaining-tiles": 4 },
        { "letter": "M", "value": 3, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "N", "value": 1, "letter-distribution": 6, "remaining-tiles": 6 },
        { "letter": "O", "value": 1, "letter-distribution": 8, "remaining-tiles": 8 },
        { "letter": "P", "value": 3, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "Q", "value": 10, "letter-distribution": 1, "remaining-tiles": 1 },
        { "letter": "R", "value": 1, "letter-distribution": 6, "remaining-tiles": 6 },
        { "letter": "S", "value": 1, "letter-distribution": 4, "remaining-tiles": 4 },
        { "letter": "T", "value": 1, "letter-distribution": 6, "remaining-tiles": 6 },
        { "letter": "U", "value": 1, "letter-distribution": 4, "remaining-tiles": 4 },
        { "letter": "V", "value": 4, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "W", "value": 4, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "X", "value": 8, "letter-distribution": 1, "remaining-tiles": 1 },
        { "letter": "Y", "value": 4, "letter-distribution": 2, "remaining-tiles": 2 },
        { "letter": "Z", "value": 10, "letter-distribution": 1, "remaining-tiles": 1 },
        { "letter": "Blank", "value": 0, "letter-distribution": 2, "remaining-tiles": 2 }
    ];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandonPiece() {
    var totalPieces = pieceLetter.length;
    var randomInt = getRandomInt(0, totalPieces - 1);
    var randomPiece = pieceLetter[randomInt];

    if (randomPiece["remaining-tiles"] > 0) {
        randomPiece["remaining-tiles"]--;
        return randomPiece;
    } else {
         // If no remaining tiles, get another random piece
        return getRandonPiece();
    }
}

function getTile() {
    for (var i = 0; i < 7; i++) {
        var letterObj = getRandonPiece();
        var tileId = 'piece' + i;

        // Check if the tile with the same ID already exists on the rack

        if ($("#rack").find("#" + tileId).length === 0) {
            var newTile = $("<img class='draggable-tile' id='" + tileId + "' src='graphics_data/Scrabble_Tiles/Scrabble_Tile_" + letterObj.letter + ".jpg' alt='Scrabble Tile'>");
            newTile.data("letter", letterObj.letter);
            $("#rack").append(newTile);
            makeTileDraggable(newTile);
        }
    }
}




function dragAndDrop() {
    $(".draggable-tile").draggable({
        revert: "invalid",
        zIndex: 50,
        cursorAt: { top: 50, left: 50 }
    });

    // Droppable on the rack
    $("#rack").droppable({
        accept: ".draggable-tile",
        drop: function (event, ui) {
            var droppedTile = ui.draggable;
            droppedTile.css({
                top: 0,
                left: 0,
                position: 'relative' 
            });

            $(this).append(droppedTile);
            
        }
    });

    // Droppable on the board
    $(".board-space").droppable({
        accept: ".draggable-tile",
        drop: function (event, ui) {
            var droppedTile = ui.draggable;

            // Set the position of the dropped tile
            droppedTile.css({
                top: 0,
                left: 0,
                position: 'absolute' 
            });

            $(this).append(droppedTile);
            getWordOnBoard();
        }
    });
}

function clearGame() {

    $("#current-score").text(0);
    $("#word").text(' ');

    // Clear the board
    $(".board-space").empty();

    // Clear the rack
    $("#rack").empty();

    totalScore = 0;

    resetPieceLetter(
    );

    getTile();

    dragAndDrop();
}

function makeTileDraggable(tile) {
    tile.draggable({
        revert: "invalid",
        zIndex: 50,
        cursorAt: { top: 50, left: 50 }
    });
}

function updateScore() {
     // Update the displayed score
    $("#current-score").text(totalScore);

}

function calculateScore() {
    score = 0;
    $(".board-space img").each(function () {
        var letter = $(this).data("letter");
        var letterValue = getLetterValue(letter);
        var bonus = $(this).closest('.board-space').data('bonus');

        // Apply bonus based on data-bonus attribute

        if (bonus === 1) {
            score += letterValue;
        } else if (bonus === 2) {
            letterValue *= 2;
            score += letterValue;
        } else if (bonus === 3) {
            doubleWord++;
            score += letterValue;
        }


    });
}



function getLetterValue(letter) {
    var letterObj = pieceLetter.find(function (piece) {
        return piece.letter === letter;
    });

    if (letterObj) {
        return letterObj.value;
    } else {
        return 0;
    }
}

/*var dictionary;

 Fetch words.txt using the fetch API
fetch('HW5-main/words.txt')
    .then(response => response.text())
    .then(data => {
        // Split the contents of the file into an array of words

        dictionary = data.split('\n');
    })
    .catch(error => console.error('Error loading words.txt:', error));


function isWordValid(word) {

    console.log("Checking word:", word);
    // Check if the word is at least 3 letters long and contains no spaces

    if (word.length >= 3 && !/\s/.test(word)) {
        // Check if the word is in the dictionary array
        
        return dictionary.includes(word.toLowerCase());
    } else {
        return false;
    }
}*/


function getWordOnBoard() {
    var word = "";
    $(".board-space img").each(function () {
        var letter = $(this).data("letter");
        word += letter;
    });

    $("#word").text(word);


    return word;
}


function next() {
    calculateScore();

    console.log("Score:", score);
    console.log("Double Word Multiplier:", doubleWord);

    if (doubleWord > 0) {
        totalScore += score * Math.pow(2, doubleWord);
    } else {
        totalScore += score;
    }

    console.log("Total Score:", totalScore);
      // Reset the word score
    doubleWord = 0;

    // Update the displayed score
    updateScore();

    $(".board-space").empty();
    getTile();
    dragAndDrop();
}
