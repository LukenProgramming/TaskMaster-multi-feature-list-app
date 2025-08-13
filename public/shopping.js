const submitBtn = document.getElementById('submitBtn');
const ul = document.getElementById('list');

// Helper function to create an <li> with strikeable span and delete button
const createItemElement = (quantity, name) => {
    const li = document.createElement('li');

    // Item text span
    const span = document.createElement('span');
    span.textContent = `${quantity} x ${name}`;
    span.classList.add('strikeable');
    li.appendChild(span);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering strike/move
        li.style.transition = 'opacity 0.5s';
        li.style.opacity = '0';
        setTimeout(() => {
            li.remove();
            saveItemsToLocalStorage();
        }, 500);
    });
    li.appendChild(deleteBtn);

    return li;
};

// Save items to localStorage
const saveItemsToLocalStorage = () => {
    const items = [];
    ul.querySelectorAll('li').forEach(li => {
        items.push({ text: li.querySelector('span').textContent, className: li.className });
    });
    localStorage.setItem('shoppingListItems', JSON.stringify(items));
};

// Load items from localStorage
const loadItemsFromLocalStorage = () => {
    const items = JSON.parse(localStorage.getItem('shoppingListItems')) || [];
    items.forEach(item => {
        const [quantity, name] = item.text.split(' x ');
        const li = createItemElement(quantity, name);
        ul.appendChild(li);
    });
};

// Add new item
const getNewItem = () => {
    let newItemNameField = document.getElementById('itemName');
    let newItemName = newItemNameField.value.trim();
    let newItemQuantityField = document.getElementById('quantity');
    let newItemQuantity = newItemQuantityField.value.trim();

    if (newItemName !== "") {
        while ((isNaN(newItemQuantity) && newItemQuantity !== "") || (newItemQuantity <= 0 && newItemQuantity !== "")) {
            newItemQuantity = parseInt(prompt("Please enter a value greater than 0 for the quantity:"), 10);
        }
        if (newItemQuantity === "") {
            newItemQuantity = 1;
        }

        const li = createItemElement(newItemQuantity, newItemName);
        ul.appendChild(li);
        saveItemsToLocalStorage();

        newItemNameField.value = "";
        newItemQuantityField.value = "";
    }
};

// Submit button click
submitBtn.onclick = () => {
    getNewItem();
};

// Strike-through logic
document.addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN' && (event.target.classList.contains('strikeable') || event.target.classList.contains('strike-through'))) {
        const span = event.target;
        if (span.classList.contains('strikeable')) {
            span.classList.remove('strikeable');
            span.classList.add('strike-through');
        } else {
            span.classList.remove('strike-through');
            span.classList.add('strikeable');
        }
        saveItemsToLocalStorage();
    }
});

// Intersection Observer for show/hide animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Load items on page load
window.onload = loadItemsFromLocalStorage;