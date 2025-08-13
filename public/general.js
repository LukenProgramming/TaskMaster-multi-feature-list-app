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

// Helper function to create task <li> with delete button
const createTaskElement = (taskText, className) => {
    const li = document.createElement('li');
    li.className = className;

    // Task text span
    const span = document.createElement('span');
    span.textContent = taskText;
    span.classList.add('strikeable');
    li.appendChild(span);

    // Trash can button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering strike/move
        li.remove();
        saveTasksToLocalStorage();
    });
    li.appendChild(deleteBtn);

    // Click event to strike or move task
    span.addEventListener('click', () => {
        if (span.classList.contains('strikeable')) {
            span.classList.remove('strikeable');
            span.classList.add('strike-through');
        } else if (span.classList.contains('strike-through')) {
            span.classList.remove('strike-through');
            span.classList.add('strikeable');
        }
        saveTasksToLocalStorage();
    });

    return li;
};

// Save tasks to localStorage
const saveTasksToLocalStorage = () => {
    const notDoneTasks = [];
    const doneTasks = [];

    document.querySelectorAll('#notDoneTaskList li').forEach(li => {
        notDoneTasks.push({ text: li.querySelector('span').textContent, className: li.className });
    });
    document.querySelectorAll('#doneTasksList li').forEach(li => {
        doneTasks.push({ text: li.querySelector('span').textContent, className: li.className });
    });

    localStorage.setItem('notDoneTasks', JSON.stringify(notDoneTasks));
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks));
};

// Load tasks from localStorage
const loadTasksFromLocalStorage = () => {
    const notDoneTasks = JSON.parse(localStorage.getItem('notDoneTasks')) || [];
    const doneTasks = JSON.parse(localStorage.getItem('doneTasks')) || [];

    notDoneTasks.forEach(task => {
        document.getElementById('notDoneTaskList').appendChild(
            createTaskElement(task.text, task.className)
        );
    });

    doneTasks.forEach(task => {
        document.getElementById('doneTasksList').appendChild(
            createTaskElement(task.text, task.className)
        );
    });
};

// Add new task
const getNewTask = () => {
    let newTaskField = document.getElementById('newTask');
    let newTask = newTaskField.value.trim();

    if (newTask !== "") {
        const ul = document.getElementById('notDoneTaskList');
        const dateValue = dateElement.value.trim();
        let taskText = newTask;

        if (dateValue) {
            const dateToAdd = new Date(dateValue);
            taskText += ` - ${dateToAdd.toLocaleDateString()}`;
        }

        // Create the <li> element using your helper
        const li = createTaskElement(taskText, 'notDoneTask');

        // If date is in the past, make text red
        if (dateValue && currentDate > new Date(dateValue)) {
            li.querySelector('span').style.color = 'red';
        }

        ul.appendChild(li);
        saveTasksToLocalStorage();

        // Reset input and radio
        newTaskField.value = "";
        dateElement.value = "";
        radioButtons.forEach(radio => radio.checked = false);
        dateElement.classList.add('hidden');
        dateElement.classList.remove('show');
    }
};

submitBtn.onclick = () => {
    getNewTask();
};

// Move task to done (plays woosh)
const moveTask = (movingElement) => {
    const ol = document.getElementById('doneTasksList');
    ol.appendChild(movingElement).classList.add('doneTask');
    wooshSound.play();
    saveTasksToLocalStorage();
};

// Click event to move tasks from not done to done
document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'SPAN' && (target.classList.contains('strikeable') || target.classList.contains('strike-through'))) {
        const movingElement = target.parentNode;
        moveTask(movingElement);
    }
});

// Load tasks on page load
window.onload = loadTasksFromLocalStorage;
