let activeCards = Array.from(document.getElementsByClassName("card"));


// Align card-front and card-back on top of each other

activeCards.forEach(activeCards => {
    activeCards.classList.add("card-alignment-parent");
    let children = Array.from(activeCards.children);
    children.forEach(children => children.classList.add("card-alignment-child"));
});


// Shuffle Cards

// Shuffle Cards | source: 'freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
 (function shuffle (){
    activeCards.forEach(activeCards => {
        let randomNumber = Math.round(Math.random()*12);
        activeCards.style.order = randomNumber;
     })
})();


// Flip Cards

// Flip Cards | source: 'freecodecamp' (URL: https://www.youtube.com/watch?v=ZniVgo8U7ek&t=298s) 
function flipcard () {
    this.classList.toggle("flip");
}

activeCards.forEach(activeCards => activeCards.addEventListener('click', flipcard));


