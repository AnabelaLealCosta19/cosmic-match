// Global Variables
let player = localStorage.getItem("player");
let usedDifficulty = localStorage.getItem("usedDifficulty");

let activeCards = Array.from(document.getElementsByClassName("card"));

let selectedChildren;

let hasFlippedCard = false;

let firstCard, secondCard;
let firstCardType, secondCardType;

// Open correct modal on page load
$(document).ready(function(){
    if (player == null || player == ""){
        $("#firstStartPage").modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
        $("#repeatStartPage").modal('hide');
        console.log("No player name saved");
    } else {
        $("#firstStartPage").modal('hide');
        $("#repeatStartPage").modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
        RepeatUpdatePlayerName()
        console.log("Player name has been saved and is");
        console.log(player);
    }
});


// Update player name
// Start page modal: first
$('#firstPlayNow').on("click", function() {
    firstUpdatePlayerName();
});

function firstUpdatePlayerName() {
    console.log("Click button works");
    player = $('#player').val();
    localStorage.setItem("player", player);
    $('.player').text(player);
    console.log(player);
};

function RepeatUpdatePlayerName() {
    console.log("Repeated player is being updated...");
    $('.player').text(player);
    console.log(player);
};



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
            setTimeout(cardsMatch, 750);
        } else {
            activeCards.forEach(activeCards => activeCards.removeEventListener('click', checkCard));
            setTimeout(noMatch, 750);
        };
    };
    
};

 // Define card type
function defineCardType(cardtype) {
    // Remove last character from id | source: stackoverflow' (URL: https://stackoverflow.com/questions/1794822/remove-last-character-in-id-attribute) 
    return cardtype.id.substr(0, cardtype.id.length -1);
}

// Mark children as selected
function markChildrenAsSelected() {
    selectedChildren.forEach(selectedChildren => selectedChildren.classList.add("selected"));
};

function cardsMatch() {
    // Remove highlighted border
    let matchedChildren = Array.from(firstCard.children).concat(Array.from(secondCard.children));
    matchedChildren.forEach(matchedChildren => matchedChildren.classList.remove("selected"));
    // Reset all first and second card variables
    firstCard = secondCard = firstCardType = secondCardType = undefined;
    // Add event listener again
    activeCards.forEach(activeCards => activeCards.addEventListener('click', checkCard));
};

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

// Event listener for click on cards
activeCards.forEach(activeCards => activeCards.addEventListener('click', checkCard));


