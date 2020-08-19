// Global Variables
let player = localStorage.getItem("player");
let difficulty = localStorage.getItem("difficulty");

let difficultyButtons = Array.from($(".btn-difficulty"));

let allCards = Array.from($(".card")); 
let selectedChildren;

let hasFlippedCard = false;

let firstCard, secondCard;
let firstCardType, secondCardType;

let flipsCounted = 0;
let time, defaultTime, minutes, seconds;

let restartIcons = Array.from($(".restart-btn"));

// Open correct modal on page load
$(document).ready(function(){
    if (player == null || player == ""){
        showStartPage("#firstStartPage");
        activateEasyMode();
    } else {
        showStartPage("#repeatStartPage");
        UpdatePlayerName();
        UpdateDifficulty();
        flipsCounted = 0;
    }
});

// Show start page modals
function showStartPage(modalId) {
    $(modalId).modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
};

// Prevent enter key from closing modal
// Disable enter key | source: 'Paulund' (URL: https://paulund.co.uk/how-to-disable-enter-key-on-forms) 
$("form").keypress(function(e) {
  if (e.which == 13) {
    return false;
  }
});

// Play now buttons in modals
$('#firstPlayNow').on("click", function() {
    firstUpdatePlayerName();
    checkDifficultySelection();
    //startTimer();
});

$('#repeatPlayNow').on("click", function() {
    checkForChangedPlayerName();
    checkDifficultySelection();
    //startTimer();
});

// Handle timer
function startTimer() {
    if (difficulty == "easy") {
        time = 90;
        while (time > 0) {
            setTimeout(countDownTime(time), 1000);
        }
    } else if (difficulty == "normal") {
        time = 75;
        while (time > 0) {
            setTimeout(countDownTime(time), 1000);
        }
    } else {
        time = 60;
        while (time > 0) {
            setTimeout(countDownTime(time), 1000);
        }
    };
};

function countDownTime(time) {
    time--;
    minutes = Math.floor(time / 60);
    seconds = Math.floor(time % 60);
    if (time > 9){
        $(".time").text(`${minutes}:${seconds}`);
    } else {
        $(".time").text(`${minutes}:0${seconds}`);
    };   
};

// Update player name
function firstUpdatePlayerName() {
    player = $('#player').val();
    localStorage.setItem("player", player);
    $('.player').text(player);
};

function UpdatePlayerName() {
    $('.player').text(player);    
};

function checkForChangedPlayerName() {
    if (!(($('#otherPlayer').val()) == null || ($('#otherPlayer').val()) == "")) {
        player = $('#otherPlayer').val();
        localStorage.setItem("player", player);
        $('.player').text(player);
    }
}

// Update difficulty
function selectDifficulty() {
    $(".btn-difficulty").removeClass("focus");
    $(this).addClass("focus");
};

function UpdateDifficulty() {
    $('.difficulty').text(difficulty);  
    if (difficulty == "easy") {
        updateGameSettings("easy", "1:30");
    }  else if (difficulty == "normal") {
        updateGameSettings("normal", "1:15");
    } else {
        updateGameSettings("hard", "1:00");
    };
};

// Update game settings (upon page load)
function updateGameSettings(providedDifficulty, time) {
    $('.time').text(time);
    $(".btn-difficulty").removeClass("focus");
    $(".btn-"+providedDifficulty).addClass("focus");
};

// Check which difficulty has been selected
function checkDifficultySelection() {
    if ($(".focus").hasClass("btn-easy")) {
        activateDifficultyMode("easy", "1:30");
    } else if ($(".focus").hasClass("btn-normal")) {
        activateDifficultyMode("normal", "1:15");
    } else {
        activateDifficultyMode("hard", "1:00");
    }
};

// Adapt game to difficulty passed
function activateDifficultyMode(providedDifficulty, time) {
    // Store difficulty
    difficulty = providedDifficulty;
    localStorage.setItem("difficulty", difficulty);
    $('.difficulty').text(difficulty);
    // Change game settings
    $('.time').text(time);
    $(".card").addClass("d-none");
    $("."+providedDifficulty).removeClass("d-none");
};



// Align card-front and card-back on top of each other
allCards.forEach(allCards => {
    allCards.classList.add("card-alignment-parent");
    let children = Array.from(allCards.children);
    children.forEach(children => children.classList.add("card-alignment-child"));
});


// Shuffle Cards
 (function shuffle (){
    // Shuffle Cards | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
    allCards.forEach(allCards => {
        let randomNumber = Math.round(Math.random()*12);
        allCards.style.order = randomNumber;
     })
})();

// Count how often cards were flipped
function countFlips() {
    flipsCounted++;
    $(".flips-counted").text(flipsCounted);
};

function checkCard() {    
    // Check if card is first, same  or second card
    // Define if card is firstCard or secondCard | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
    selectedChildren = Array.from(this.children);
     if (!hasFlippedCard){
        // Click on first card
        hasFlippedCard = true;
        firstCard = this;
        firstCardType = defineCardType(firstCard);
        this.classList.add("flip");
        markChildrenAsSelected();
        countFlips();
    } else if (hasFlippedCard && this.id == firstCard.id){
        // Click on same card again
        hasFlippedCard = true;
    } else {
        // Click on second card 
        hasFlippedCard = false;
        secondCard = this;
        secondCardType = defineCardType(secondCard);
        this.classList.add("flip");
        markChildrenAsSelected();
        countFlips();
    };

    // Check if cards match
    if (firstCardType !== undefined && secondCardType !== undefined) {
        if (firstCardType == secondCardType) {
            // Remove event listener for clicking on further cards while setTimeOut function is executing
            allCards.forEach(allCards => allCards.removeEventListener('click', checkCard));
            setTimeout(cardsMatch, 1000);
        } else {
            allCards.forEach(allCards => allCards.removeEventListener('click', checkCard));
            setTimeout(noMatch, 1000);
        };
    };
    
};

// Define card type
function defineCardType(cardType) {
    // Remove last character from id | source: stackoverflow' (URL: https://stackoverflow.com/questions/1794822/remove-last-character-in-id-attribute) 
    return cardType.id.substr(0, cardType.id.length -1);
}

// Mark children as selected
function markChildrenAsSelected() {
    selectedChildren.forEach(selectedChildren => selectedChildren.classList.add("selected"));
};

// Cards match
function cardsMatch() {
    // Remove highlighted border
    let matchedChildren = Array.from(firstCard.children).concat(Array.from(secondCard.children));
    matchedChildren.forEach(matchedChildren => matchedChildren.classList.remove("selected"));
    // Reset all first and second card variables
    firstCard = secondCard = firstCardType = secondCardType = undefined;
    // Add event listener again
    allCards.forEach(allCards => allCards.addEventListener('click', checkCard));
};

// Cards don't match
function noMatch() {
    // Turn cards back over
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    // Remove highlighted border
    let matchedChildren = Array.from(firstCard.children).concat(Array.from(secondCard.children));
    matchedChildren.forEach(matchedChildren => matchedChildren.classList.remove("selected"));
    // Reset all first and second card variables
    firstCard = secondCard = firstCardType = secondCardType = undefined;
    // Add event listener again
    allCards.forEach(allCards => allCards.addEventListener('click', checkCard));
};

// Restart game
function restartGame() {
    // Reset time & flip counter
    flipsCounted = 0;
    $(".flips-counted").text(flipsCounted);
    time = defaultTime;
    // startTimer();
    // Turn back all cards
    allCards.forEach(allCards => {
        allCards.classList.remove("flip");
        let children = Array.from(allCards.children);
        children.forEach(children => children.classList.remove("selected"));
    });
    // Reset variables
    hasFlippedCard = false;
    firstCard = secondCard = firstCardType = secondCardType = undefined;
};

// Event listeners
allCards.forEach(allCards => allCards.addEventListener('click', checkCard));
difficultyButtons.forEach(difficultyButtons => difficultyButtons.addEventListener('click', selectDifficulty));
restartIcons.forEach(restartIcons => restartIcons.addEventListener('click', restartGame));

