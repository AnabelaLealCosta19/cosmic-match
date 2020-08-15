

// Align card-front and card-back on top of each other
for (let n=1; n<13; n++) {
    // Add alignment to parent div of each card
    let parent = document.getElementsByClassName(`card-${n}`)[0];
    console.log(parent);
    parent.classList.add("card-alignment-parent");
    // Add alignment to card-front and card-back
    let childFront = document.getElementsByClassName(`card-front-${n}`)[0]; 
    console.log(childFront);
    childFront.classList.add("card-alignment-child");
    let childBack = document.getElementsByClassName(`card-back-${n}`)[0];
    console.log(childBack);
    childBack.classList.add("card-alignment-child");
}

