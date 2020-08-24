// NOTES
// "// TEXT" >> overall topic of following code block(s)
// CODE  "// TEXT" >> summary of current code block
// CODE  "// - TEXT" >> subcategories of code block that have certain effect
// CODE  "// * TEXT" >> external code source
// CODE  "// ~ TEXT" >> additional notes from developer


// Global Variables
let newPlayer;
let player = localStorage.getItem("player");
let difficulty = localStorage.getItem("difficulty");

let difficultyButtons = Array.from($(".btn-difficulty"));

let allCards = Array.from($(".card")); 
let activeCards, matchedCards;
let selectedChildren;

let hasFlippedCard = false;

let firstCard, secondCard;
let firstCardType, secondCardType;

let flipsCounted = 0;

let timer;
let time, minutes, seconds;
let pausedTime, newTime;

let restartIcons = Array.from($(".restart-icon"));
let instructionIcons = Array.from($(".instruction-icon"));
let settingsIcons = Array.from($(".settings-icon"));

let pauseIcons = Array.from($(".pause-icon"));
let pauseContainer = Array.from($(".pause-icon-container"));
let resumeIcons = Array.from($(".resume-icon"));
let resumeContainer = Array.from($(".resume-icon-container"));


// Display modals
$(document).ready(function(){  // Load page correctly (first-time visitor vs. familiar player)
    if (player == null || player == ""){
        showModal("#firstStartPage");
        activateDifficultyMode("easy");
    } else {
        showModal("#repeatStartPage");
        UpdatePlayerName();
        UpdateDifficulty();
    }
});

function showModal(modalId) {  // Show start page modals
    $(modalId).modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
};

function showInstructionsModal() {  // Open instructions modal + pause timer
    showModal("#instructions");
    clearInterval(timer);
};

function dismissInstructionsModal() {
    continueTime();
    resetResumeButton();
};

function showSettingsModal() {
    console.log("Open settings modal");
    showModal("#settings");
    clearInterval(timer);
};

$("form").keypress(function(e) {  // Prevent enter key from closing modal
  if (e.which == 13) { // * Disable enter key | source: 'Paulund' (URL: https://paulund.co.uk/how-to-disable-enter-key-on-forms) 
    return false;
  }
});


// Align cards
allCards.forEach(allCards => {  // Align card-front and card-back on top of each other
    allCards.classList.add("card-alignment-parent");
    let children = Array.from(allCards.children);
    children.forEach(children => children.classList.add("card-alignment-child"));
});


// Shuffle Cards
 function shuffle (){ // * Shuffle Cards | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s)
    allCards.forEach(allCards => {
        let randomNumber = Math.round(Math.random()*12);
        allCards.style.order = randomNumber;
     })
};


// Functionality for play buttons
$('#firstPlayNow').on("click", function() {  // When clicking first play now button (modal: first start page [first-time visitor])
    shuffle();
    firstPlayerName();
    checkDifficultySelection();
    startTimer();
});

$('#repeatPlayNow').on("click", function() {  // When clicking repeat play now button (modals: repeat start page [familiar player])
    shuffle();
    checkDifficultySelection();
    startTimer();
    flipsCounted = 0;
    checkForChangedPlayerName("#otherPlayer");
});

$('.btn-play-again').on("click", function() {  // When clicking new game button (modals: repeat start page [familiar player], settings, game over, congratulations)
    checkDifficultySelection();
    startTimer();
    $(".time-detail").removeClass("last-seconds");
    flipsCounted = 0;
    $(".flips-counted").text(flipsCounted);
    turnCardsBack();
    shuffle();
    if (this.id == "settingsPlayNow") {
        checkForChangedPlayerName("#settingsPlayer");
    };
});


// Handle player name
function firstPlayerName() {  // Set player name for first-time visitor
    player = $('#player').val();
    localStorage.setItem("player", player);
    $('.player').text(player);
};

function UpdatePlayerName() {  // Update saved player name [familiar player] on page load
    $('.player').text(player);    
};

function checkForChangedPlayerName(newPlayer) {  // Check if player changed name and update player name accordingly (modals: repeat start page, settings)
    if (!(($(newPlayer).val()) == null || ($(newPlayer).val()) == "")) {
        player = $(newPlayer).val();
        localStorage.setItem("player", player);
        $('.player').text(player);
    }
}


// Handle difficulty
function selectDifficulty() {  // Display clicked button as "focused"
    $(".btn-difficulty").removeClass("focus");
    $(this).addClass("focus");
};

function UpdateDifficulty() {  // Update difficulty and "focus" correct button (page load: familiar player)
    $('.difficulty').text(difficulty);  
    if (difficulty == "easy") {
        updateButton("easy");
    }  else if (difficulty == "normal") {
        updateButton("normal");
    } else {
        updateButton("hard");
    };
};

function updateButton(providedDifficulty) {  // Display button as "focused" (nested in function above)
    $(".btn-difficulty").removeClass("focus");
    $(".btn-"+providedDifficulty).addClass("focus");
};

function checkDifficultySelection() {  // Check which difficulty has been selected by player
    if ($(".focus").hasClass("btn-easy")) {
        activateDifficultyMode("easy");
    } else if ($(".focus").hasClass("btn-normal")) {
        activateDifficultyMode("normal");
    } else {
        activateDifficultyMode("hard");
    }
};

function activateDifficultyMode(providedDifficulty) {  // Adapt game to difficulty
    difficulty = providedDifficulty; // - Store difficulty
    localStorage.setItem("difficulty", difficulty);
    $('.difficulty').text(difficulty);
    $(".card").addClass("d-none"); // - Change cards
    $("."+providedDifficulty).removeClass("d-none");
    activeCards = Array.from($("."+providedDifficulty));
    console.log(activeCards);
};


// Handle Timer
function startTimer() {  // Set time limit according to difficulty
    if (difficulty == "easy") {
        countDownTime(75);
    } else if (difficulty == "normal") {
        countDownTime(60);
    } else {
        countDownTime(45);
    };
};

function countDownTime(time) {  // Count down time limit
    displayTime(time);
    timer = setInterval(function() {
        time--;
        displayTime(time);
        pausedTime = time;  // ~ Store time in variable to be accessed by pause function later
        if (minutes == 0 && seconds == 0) {
            clearInterval(timer);
            showModal("#gameOver");
            UpdateDifficulty();
        };
    }, 1000); 
};

function displayTime(time){  // Display time correctly in minutes and seconds
    minutes = Math.floor(time / 60);
    seconds = Math.floor(time % 60);
    if (seconds > 9){
        $(".time").text(`${minutes}:${seconds}`);
    } else {
        $(".time").text(`${minutes}:0${seconds}`);
    };  
    if (minutes == 0 && seconds < 10) {
        $(".time-detail").addClass("last-seconds");
    };
};


// Flip counter
function countFlips() {  // Counts how often cards were flipped
    flipsCounted++;
    $(".flips-counted").text(flipsCounted);
};


// Check and match cards
function checkCard() {  // Check if card is first, same  or second card 
    selectedChildren = Array.from(this.children);
     if (!hasFlippedCard){  // * Define if card is firstCard or secondCard | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
        hasFlippedCard = true;  // - Click on first card
        firstCard = this;
        firstCardType = defineCardType(firstCard);
        this.classList.add("flip");
        markChildrenAsSelected();
        countFlips();
    } else if (hasFlippedCard && this.id == firstCard.id){  // - Click on same card again
        hasFlippedCard = true;
    } else {  // - Click on second card 
        hasFlippedCard = false;
        secondCard = this;
        secondCardType = defineCardType(secondCard);
        this.classList.add("flip");
        markChildrenAsSelected();
        countFlips();
    };

    if (firstCardType !== undefined && secondCardType !== undefined) {  // Check if cards match
        if (firstCardType == secondCardType) {
            allCards.forEach(allCards => allCards.removeEventListener('click', checkCard));  // - Remove event listener for clicking on further cards while setTimeOut function is executing
            setTimeout(cardsMatch, 1000);
        } else {
            allCards.forEach(allCards => allCards.removeEventListener('click', checkCard));
            setTimeout(noMatch, 1000);
        };
    };
};


// Supporting functions for checking and matching cards
function defineCardType(cardType) { // Define card type
    return cardType.id.substr(0, cardType.id.length -1);  // * Remove last character from id | source: stackoverflow' (URL: https://stackoverflow.com/questions/1794822/remove-last-character-in-id-attribute)
}

function markChildrenAsSelected() {  // Mark children as selected
    selectedChildren.forEach(selectedChildren => selectedChildren.classList.add("selected"));
};

function cardsMatch() {  // Cards match
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    let matchedChildren = Array.from(firstCard.children).concat(Array.from(secondCard.children));  // - Remove highlighted border
    matchedChildren.forEach(matchedChildren => matchedChildren.classList.remove("selected"));
    firstCard = secondCard = firstCardType = secondCardType = undefined;  // - Reset all first and second card variables
    allCards.forEach(allCards => allCards.addEventListener('click', checkCard));  // - Add event listener again
    allCardsMatch();
};

function noMatch() {  // Cards don't match
    firstCard.classList.remove("flip");  // - Turn cards back over
    secondCard.classList.remove("flip");
    let matchedChildren = Array.from(firstCard.children).concat(Array.from(secondCard.children));  // - Remove highlighted border
    matchedChildren.forEach(matchedChildren => matchedChildren.classList.remove("selected"));
    firstCard = secondCard = firstCardType = secondCardType = undefined;  // - Reset all first and second card variables
    allCards.forEach(allCards => allCards.addEventListener('click', checkCard));  // - Add event listener again
};

function allCardsMatch() {
    matchedCards = Array.from($($(".matched")));
    if (matchedCards.length == activeCards.length) {  // * Check if all elements in array have specific class | source: 'stack overflow' (URL: https://stackoverflow.com/questions/31962074/jquery-how-to-check-if-all-element-in-array-have-specific-class) 
        console.log("Congrats!");
        showModal("#congrats");
        clearInterval(timer);
    };
};


// Restart game
function restartGame() {
    resetResumeButton();  // - Reset resume button
    flipsCounted = 0;  // - Reset flip counter
    $(".flips-counted").text(flipsCounted);
    clearInterval(timer);    // - Reset time
    startTimer();
    $(".time-detail").removeClass("last-seconds");
    turnCardsBack();
    allCards.forEach(allCards => allCards.removeEventListener('click', checkCard));  // - Shuffle cards
    setTimeout(function(){ // ~ TimeOut set to allow cards to be flipped first before being shuffled (flipping takes ~ 1000ms)
        shuffle();
        allCards.forEach(allCards => allCards.addEventListener('click', checkCard));
    }, 1000); 
    hasFlippedCard = false; // - Reset variables
    firstCard = secondCard = firstCardType = secondCardType = undefined;
};

// Turn back all cards
function turnCardsBack() {
    allCards.forEach(allCards => {  // - Turn back all cards
        allCards.classList.remove("flip");
        let children = Array.from(allCards.children);
        children.forEach(children => children.classList.remove("selected"));
    });
};


// Pause 
function pauseTime() {  // Pause timer
    clearInterval(timer);
    pauseContainer.forEach(pauseIcons => pauseIcons.classList.add("d-none"));
    resumeContainer.forEach(resumeIcons => resumeIcons.classList.remove("d-none"));
    allCards.forEach(allCards => allCards.removeEventListener('click', checkCard));
};

function continueTime() {  // Resume timer
    newTime = pausedTime;
    pausedTime = 0;  // ~ Reset paused time variable to allow repeated use of pause function
    countDownTime(newTime)
    allCards.forEach(allCards => allCards.addEventListener('click', checkCard));
};

function resumeTime() {
    continueTime();
    pauseContainer.forEach(pauseContainer => pauseContainer.classList.remove("d-none"));
    resumeContainer.forEach(resumeContainer => resumeContainer.classList.add("d-none"));
    allCards.forEach(allCards => allCards.addEventListener('click', checkCard));
};

function resetResumeButton() {
    if (!$(".resume-icon").hasClass("d-none")) {
        pauseContainer.forEach(pauseContainer => pauseContainer.classList.remove("d-none"));
        resumeContainer.forEach(resumeContainer => resumeContainer.classList.add("d-none"));
    };
};


// Event listeners: on click
allCards.forEach(allCards => allCards.addEventListener('click', checkCard));  // Click card >> cards are checked and matched
difficultyButtons.forEach(difficultyButtons => difficultyButtons.addEventListener('click', selectDifficulty));  // Click difficulty button >> buttons are displayed as "focused" 
restartIcons.forEach(restartIcons => restartIcons.addEventListener('click', restartGame));  // Click restart icon >> game restarts
pauseIcons.forEach(pauseIcons => pauseIcons.addEventListener('click', pauseTime));  // Click pause icon >> timer pauses
resumeIcons.forEach(resumeIcons => resumeIcons.addEventListener('click', resumeTime));  // Click resume icon >> timer resumes
instructionIcons.forEach(instructionIcons => instructionIcons.addEventListener('click', showInstructionsModal));  // Click instructions icon >> instructions modal opens
document.getElementById("instructions-dismiss-btn").addEventListener('click', dismissInstructionsModal);  // Click instructions dismiss button >> instructions modal closes
settingsIcons.forEach(settingsIcons => settingsIcons.addEventListener('click', showSettingsModal));  // Click settings icon >> settings modal opens
