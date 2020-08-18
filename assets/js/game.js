// Global Variables
let player = localStorage.getItem("player");
let difficulty = localStorage.getItem("difficulty");

let difficultyButtons = Array.from($(".btn-difficulty"));

let activeCards = Array.from($(".easy")); // Default setting is easy, therefore easy cards are used at start
let selectedChildren;

let hasFlippedCard = false;

let firstCard, secondCard;
let firstCardType, secondCardType;

// Open correct modal on page load
$(document).ready(function(){
    if (player == null || player == ""){
        showStartPage("#firstStartPage");
        activateEasyMode();
    } else {
        showStartPage("#repeatStartPage");
        UpdatePlayerName();
        UpdateDifficulty();
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


// Play now buttons in modals
$('#firstPlayNow').on("click", function() {
    firstUpdatePlayerName();
    checkDifficultySelection();
});

$('#repeatPlayNow').on("click", function() {
    checkForChangedPlayerName();
    checkDifficultySelection();
});

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
    console.log("Eventlistener works");
    $(".btn-difficulty").removeClass("focus");
    $(this).addClass("focus");
};

function UpdateDifficulty() {
    $('.difficulty').text(difficulty);  
    if (difficulty == "easy") {
        $('.time').text("1:30");
        $(".btn-difficulty").removeClass("focus");
        $(".btn-easy").addClass("focus");
    }  else if (difficulty == "normal") {
        $('.time').text("1:15");
        $(".btn-difficulty").removeClass("focus");
        $(".btn-normal").addClass("focus");
    } else {
        $('.time').text("1:00");
        $(".btn-difficulty").removeClass("focus");
        $(".btn-hard").addClass("focus");
    };
};

function checkDifficultySelection() {
    console.log("setting difficuly works"); 
    if ($(".focus").hasClass("btn-easy")) {
        console.log("easy selected");
        activateEasyMode();
    } else if (($(".focus").hasClass("btn-normal"))) {
        console.log("normal selected");
        activateNormalMode();
    } else {
        console.log("hard selected");
        activateHardMode();
    }
};

function activateEasyMode() {
    // Store difficulty
    difficulty = "easy";
    localStorage.setItem("difficulty", difficulty);
    $('.difficulty').text(difficulty);
    // Change game settings
    $('.time').text("1:30");
    activeCards = Array.from($(".easy"));
    console.log(activeCards);
};

function activateNormalMode() {
    // Store difficulty
    difficulty = "normal";
    localStorage.setItem("difficulty", difficulty);
    $('.difficulty').text(difficulty);
    // Change game settings
    $('.time').text("1:15");
    activeCards = Array.from($(".normal"));
    console.log(activeCards);
};

function activateHardMode() {
    // Store difficulty
    difficulty = "hard";
    localStorage.setItem("difficulty", difficulty);
    $('.difficulty').text(difficulty);
    // Change game settings
    $('.time').text("1:00");
    activeCards = Array.from($(".hard"));
    console.log(activeCards);
};

// Prevent enter key from closing modal
// Disable enter key | source: 'Paulund' (URL: https://paulund.co.uk/how-to-disable-enter-key-on-forms) 
$("form").keypress(function(e) {
  if (e.which == 13) {
    return false;
  }
});

// Align card-front and card-back on top of each other
activeCards.forEach(activeCards => {
    activeCards.classList.add("card-alignment-parent");
    let children = Array.from(activeCards.children);
    children.forEach(children => children.classList.add("card-alignment-child"));
});


// Shuffle Cards
 (function shuffle (){
    // Shuffle Cards | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
    activeCards.forEach(activeCards => {
        let randomNumber = Math.round(Math.random()*12);
        activeCards.style.order = randomNumber;
     })
})();


// Check what card it is and if it matches other card
function checkCard() {    
    // Check if card is first, same  or second card
    selectedChildren = Array.from(this.children);
    // Define if card is firstCard or secondCard | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
    if (!hasFlippedCard){
        // Click on first card
        hasFlippedCard = true;
        firstCard = this;
        firstCardType = defineCardType(firstCard);
        this.classList.add("flip");
        markChildrenAsSelected();
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
    };

    // Check if cards match
    if (firstCardType !== undefined && secondCardType !== undefined) {
        if (firstCardType == secondCardType) {
            // Remove event listener (see line 63) for clicking on further cards while code setTimeOut function is executing
            activeCards.forEach(activeCards => activeCards.removeEventListener('click', checkCard));
            setTimeout(cardsMatch, 1000);
        } else {
            activeCards.forEach(activeCards => activeCards.removeEventListener('click', checkCard));
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
    activeCards.forEach(activeCards => activeCards.addEventListener('click', checkCard));
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
    activeCards.forEach(activeCards => activeCards.addEventListener('click', checkCard));
};

// Event listeners
activeCards.forEach(activeCards => activeCards.addEventListener('click', checkCard));
difficultyButtons.forEach(difficultyButtons => difficultyButtons.addEventListener('click', selectDifficulty));