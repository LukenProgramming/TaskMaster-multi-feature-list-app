const submitBtn = document.getElementById('submitBtn');
const ul = document.getElementById('list');

const saveItemsToLocalStorage = () => {
    const items = [];
    ul.querySelectorAll('li').forEach(li => {
        items.push({ text: li.textContent, className: li.className });
    });
    localStorage.setItem('shoppingListItems', JSON.stringify(items));
};

const loadItemsFromLocalStorage = () => {
    const items = JSON.parse(localStorage.getItem('shoppingListItems')) || [];
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.text;
        li.className = item.className;
        ul.appendChild(li);
    });
};

const getNewItem  = () => {
    let newItemNameField = document.getElementById('itemName');
    let newItemName = newItemNameField.value.trim();
    let newItemQuantityField = document.getElementById('quantity');
    let newItemQuantity = newItemQuantityField.value.trim();
    console.log(newItemName);
    console.log(newItemQuantity);

    if (newItemName !== "" ){
        while ((isNaN(newItemQuantity) && newItemQuantity !== "") || (newItemQuantity <= 0 && newItemQuantity !== "")) {
            newItemQuantity = parseInt(prompt("Please enter a value greater than 0 for the quantity:"), 10);
        }
        if (newItemQuantity === "") {
            newItemQuantity = 1;
        }
        
        const li = document.createElement('li');
        li.textContent = `${newItemQuantity} x ${newItemName}`;
        ul.appendChild(li).classList.add('strikeable', 'show');
        saveItemsToLocalStorage();
        newItemNameField.value = "";
        newItemQuantityField.value = "";
    }
};

submitBtn.onclick = () => {
    getNewItem();
};

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('strikeable')) {
        event.target.classList.remove('strikeable');
        event.target.classList.add('strike-through');
    } else if (event.target.classList.contains('strike-through')) {
        event.target.classList.remove('strike-through');
        event.target.classList.add('strikeable');
    }
    saveItemsToLocalStorage();
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Load items from localStorage when the page is loaded
window.onload = loadItemsFromLocalStorage;
