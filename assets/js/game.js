let activeCards = Array.from(document.getElementsByClassName("card"));

// Align card-front and card-back on top of each other
for (let n=1; n<13; n++) {
    // Add alignment to parent div of each card
    let parent = document.getElementsByClassName(`card-${n}`)[0];
    parent.classList.add("card-alignment-parent");
    // Add alignment to card-front and card-back
    let childFront = document.getElementsByClassName(`card-front-${n}`)[0]; 
    childFront.classList.add("card-alignment-child");
    let childBack = document.getElementsByClassName(`card-back-${n}`)[0];
    childBack.classList.add("card-alignment-child");
};

// Shuffle Cards
 (function shuffle (){
    for (let n=1; n<13; n++) {
        let randomNumber = Math.round(Math.random()*12);
        let currentCard = document.getElementsByClassName(`card-${n}`)[0];
        console.log(currentCard);
        currentCard.style.order = randomNumber;
    };
})();


// Flip Cards

// Flip Cards | source: 'freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
function flipcard () {
    this.classList.toggle("flip");
}

activeCards.forEach(activeCards => activeCards.addEventListener('click', flipcard));