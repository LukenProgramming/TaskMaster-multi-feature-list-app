const submitBtn = document.getElementById('submitBtn');

const getNewItem  = () => {
    let newItemNameField = document.getElementById('itemName')
    let newItemName = newItemNameField.value.trim();
    let newItemQuantityField = document.getElementById('quantity');
    let newItemQuantity = newItemQuantityField.value.trim();
    console.log(newItemName);
    console.log(newItemQuantity);

    if (newItemName !== "" ){
        while ((isNaN(newItemQuantity) && newItemQuantity !== "")||( newItemQuantity <= 0 && newItemQuantity !== "")) {
            newItemQuantity = parseInt(prompt("Please enter a value greater than 0 for the quantity:"), 10);
        }
        if(newItemQuantity == ""){
            newItemQuantity === 1;
        }
        
        const ul = document.getElementById ('list');
        const li = document.createElement('li');
        li.textContent = `${newItemQuantity} x ${newItemName}`;
        ul.appendChild(li).classList.add('strikeable','show');
        newItemNameField = "";
        newItemQuantityField = "";
    }

};

submitBtn.onclick = () => {
    getNewItem();
};

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('strikeable')) {
        event.target.classList.remove('strikeable');
        event.target.classList.add('strike-through');
    }
    else if (event.target.classList.contains('strike-through')) {
        event.target.classList.remove('strike-through');
        event.target.classList.add('strikeable');
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting){
            entry.target.classList.add('show');
        } 
        else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));