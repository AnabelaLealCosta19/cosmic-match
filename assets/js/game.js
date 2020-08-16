// Global Variables

let activeCards = Array.from(document.getElementsByClassName("card"));

let hasFlippedCard = false;
let firstCard = undefined;
let secondCard = undefined;

let firstCardType;
let secondCardType;


// Align card-front and card-back on top of each other

activeCards.forEach(activeCards => {
    activeCards.classList.add("card-alignment-parent");
    let children = Array.from(activeCards.children);
    children.forEach(children => children.classList.add("card-alignment-child"));
});


// Shuffle Cards

// Shuffle Cards | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
 (function shuffle (){
    activeCards.forEach(activeCards => {
        let randomNumber = Math.round(Math.random()*12);
        activeCards.style.order = randomNumber;
     })
})();


// Flip and select Cards

// Flip Cards | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
function selectCard () {
    // Flip and add selected styling to card
    let selectedChildren = Array.from(this.children);
    if (selectedChildren[0].classList.contains("selected")) {
        console.log("Already selected!");
    } else {
        console.log("New selection!");
        this.classList.add("flip");
        selectedChildren.forEach(selectedChildren => selectedChildren.classList.add("selected"));
    }
    // Define if card is firstCard or secondCard
    // Define if card is firstCard or secondCard | source: 'Memory Card Game - JavaScript Tutorial - freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
    if (!hasFlippedCard){
        // First click
        hasFlippedCard = true;
        firstCard = this;
        // Remove last character from id | source: stackoverflow' (URL: https://stackoverflow.com/questions/1794822/remove-last-character-in-id-attribute) 
        firstCardType = firstCard.id.substr(0, this.id.length -1);
        console.log({hasFlippedCard, firstCard, firstCardType});
    } else {
        secondCard = this;
        secondCardType = secondCard.id.substr(0, this.id.length -1);
        console.log({hasFlippedCard, secondCard, secondCardType});
    };

    // Check if cards match
    if (firstCardType !== undefined && secondCardType !== undefined) {
        if (firstCardType == secondCardType) {
            console.log("We have a match!")
        } else {
            console.log("Try again!")
        };
        console.log("We can start checking if cards match! :)");
    };
    
};

activeCards.forEach(activeCards => activeCards.addEventListener('click', selectCard));


