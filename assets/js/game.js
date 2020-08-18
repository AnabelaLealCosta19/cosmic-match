// Global Variables
let player = localStorage.getItem("player");
let difficulty = localStorage.getItem("difficulty");

let difficultyButtons = Array.from($(".btn-difficulty"));

let activeCards = Array.from(document.getElementsByClassName("card"));
let selectedChildren;

let hasFlippedCard = false;

let firstCard, secondCard;
let firstCardType, secondCardType;

// Open correct modal on page load
$(document).ready(function(){
    if (player == null || player == ""){
        showStartPage("#firstStartPage");
    } else {
        showStartPage("#repeatStartPage");
        UpdatePlayerName();
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

function checkDifficultySelection() {
    console.log("setting difficuly works"); 
    if ($(".focus").hasClass("btn-easy")) {
        console.log("easy selected");
    } else if (($(".focus").hasClass("btn-normal"))) {
        console.log("normal selected");
    } else {
        console.log("hard selected");
    }
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