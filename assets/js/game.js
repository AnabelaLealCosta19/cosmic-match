let activeCards = Array.from(document.getElementsByClassName("card"));


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
    let selectedChildren = Array.from(this.children);
    if (selectedChildren[0].classList.contains("selected")) {
        console.log("Already selected!");
    } else {
        console.log("New selection!");
        this.classList.add("flip");
        selectedChildren.forEach(selectedChildren => selectedChildren.classList.add("selected"));
    }
    
}

activeCards.forEach(activeCards => activeCards.addEventListener('click', selectCard));


