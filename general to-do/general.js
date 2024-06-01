const submitBtn = document.getElementById('submitBtn');
const wooshSound = new Audio("/audio/Untitled video - Made with Clipchamp.mp3");
const dateElement = document.getElementById('date');
let currentDate = new Date();

const radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('click', () => {
        const value = radioButton.value === 'true';
        if (value) {
            dateElement.classList.remove('hidden');
            dateElement.classList.add('show');
        } else {
            dateElement.classList.remove('show');
            dateElement.classList.add('hidden');
        }
    });
});

const saveTasksToLocalStorage = () => {
    const notDoneTasks = [];
    const doneTasks = [];

    document.querySelectorAll('#notDoneTaskList li').forEach(li => {
        notDoneTasks.push({ text: li.textContent, className: li.className });
    });
    document.querySelectorAll('#doneTasksList li').forEach(li => {
        doneTasks.push({ text: li.textContent, className: li.className });
    });

    localStorage.setItem('notDoneTasks', JSON.stringify(notDoneTasks));
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks));
};

const loadTasksFromLocalStorage = () => {
    const notDoneTasks = JSON.parse(localStorage.getItem('notDoneTasks')) || [];
    const doneTasks = JSON.parse(localStorage.getItem('doneTasks')) || [];

    notDoneTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.className = task.className;
        document.getElementById('notDoneTaskList').appendChild(li);
    });

    doneTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.className = task.className;
        document.getElementById('doneTasksList').appendChild(li);
    });
};

const getNewTask = () => {
    let newTaskField = document.getElementById('newTask');
    let newTask = newTaskField.value.trim();

    if (newTask !== "") {
        const ul = document.getElementById('notDoneTaskList');
        const li = document.createElement('li');
        const dateToAdd = new Date(document.getElementById('date').value);
        li.textContent = `${newTask} - ${dateToAdd.toLocaleDateString()}`;
        if (currentDate > dateToAdd) {
            li.style.color = 'red';
        }
        ul.appendChild(li).classList.add('strikeable', 'notDoneTask');
        saveTasksToLocalStorage();
        newTaskField.value = "";
        dateElement.value = ""; // Clear date input
        radioButtons.forEach(radio => radio.checked = false); // Clear radio buttons
        dateElement.classList.add('hidden');
        dateElement.classList.remove('show');
    }
};

submitBtn.onclick = () => {
    getNewTask();
};

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('strikeable')) {
        event.target.classList.remove('strikeable');
        event.target.classList.add('strike-through');
    } else if (event.target.classList.contains('strike-through')) {
        event.target.classList.remove('strike-through');
        event.target.classList.add('strikeable');
    }
    saveTasksToLocalStorage();
});

const moveTask = (movingElement) => {
    const ul = document.getElementById('notDoneTaskList');
    const ol = document.getElementById('doneTasksList');
    ol.appendChild(movingElement).classList.add('doneTask');
    wooshSound.play();
    saveTasksToLocalStorage();
};

document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('strikeable') || target.classList.contains('strike-through')) {
        const movingElement = target.parentNode.removeChild(target);
        moveTask(movingElement);
    }
});

// Load tasks from localStorage when the page is loaded
window.onload = loadTasksFromLocalStorage;