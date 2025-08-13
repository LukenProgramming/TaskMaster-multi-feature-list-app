// Button references
const nStartedBtn = document.getElementById('nStartedBtn');
const doingBtn = document.getElementById('doingBtn');

// Helper function to create a task <li> with delete button
const createTaskElement = (taskText, className, clickHandler) => {
    const li = document.createElement('li');
    li.className = className;

    // Task text span
    const span = document.createElement('span');
    span.textContent = taskText;
    li.appendChild(span);

    // Trash can button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️'; // Can replace with icon or SVG if desired
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent moving task when deleting
        li.remove();
        saveTasksToLocalStorage();
    });
    li.appendChild(deleteBtn);

    // Add click handler for moving tasks
    span.addEventListener('click', clickHandler);

    return li;
};

// Save tasks to localStorage
const saveTasksToLocalStorage = () => {
    const notStartedTasksArray = [];
    const doingTasksArray = [];
    const doneTasksArray = [];

    document.querySelectorAll('#notStartedUl li').forEach(li => {
        notStartedTasksArray.push({ text: li.querySelector('span').textContent, className: li.className });
    });
    document.querySelectorAll('#doingUl li').forEach(li => {
        doingTasksArray.push({ text: li.querySelector('span').textContent, className: li.className });
    });
    document.querySelectorAll('#doneUl li').forEach(li => {
        doneTasksArray.push({ text: li.querySelector('span').textContent, className: li.className });
    });

    localStorage.setItem('notStartedTasksArray', JSON.stringify(notStartedTasksArray));
    localStorage.setItem('doingTasksArray', JSON.stringify(doingTasksArray));
    localStorage.setItem('doneTasksArray', JSON.stringify(doneTasksArray));
};

// Load tasks from localStorage
const loadTasksFromLocalStorage = () => {
    const notStartedTasksArray = JSON.parse(localStorage.getItem('notStartedTasksArray')) || [];
    const doingTasksArray = JSON.parse(localStorage.getItem('doingTasksArray')) || [];
    const doneTasksArray = JSON.parse(localStorage.getItem('doneTasksArray')) || [];

    notStartedTasksArray.forEach(task => {
        document.getElementById('notStartedUl').appendChild(
            createTaskElement(task.text, task.className, moveTaskToDoing)
        );
    });

    doingTasksArray.forEach(task => {
        document.getElementById('doingUl').appendChild(
            createTaskElement(task.text, task.className, moveTaskToDone)
        );
    });

    doneTasksArray.forEach(task => {
        // Done tasks don’t move, but can still be deleted
        document.getElementById('doneUl').appendChild(
            createTaskElement(task.text, task.className, () => {})
        );
    });
};

// Add new not started task
const getNewNotStarted = () => {
    const field = document.getElementById('newNotStarted');
    const value = field.value.trim();
    if (value !== "") {
        const ul = document.getElementById('notStartedUl');
        const li = createTaskElement(value, 'moveable notStarted', moveTaskToDoing);
        ul.appendChild(li);
        field.value = "";
        saveTasksToLocalStorage();
    }
};

// Add new doing task
const getNewDoing = () => {
    const field = document.getElementById('newDoing');
    const value = field.value.trim();
    if (value !== "") {
        const ul = document.getElementById('doingUl');
        const li = createTaskElement(value, 'moveable doing', moveTaskToDone);
        ul.appendChild(li);
        field.value = "";
        saveTasksToLocalStorage();
    }
};

// Button click handlers
nStartedBtn.onclick = () => {
    getNewNotStarted();
    console.log("New not started task added");
};

doingBtn.onclick = () => {
    getNewDoing();
    console.log("New doing task added");
};

// Move task to Doing
const moveTaskToDoing = (event) => {
    const movingElement = event.target.parentElement;
    const newUl = document.getElementById('doingUl');
    movingElement.classList.remove('notStarted');
    movingElement.classList.add('doing');
    newUl.appendChild(movingElement);
    // Update click handlers
    movingElement.querySelector('span').removeEventListener('click', moveTaskToDoing);
    movingElement.querySelector('span').addEventListener('click', moveTaskToDone);
    saveTasksToLocalStorage();
};

// Move task to Done
const moveTaskToDone = (event) => {
    const movingElement = event.target.parentElement;
    const newUl = document.getElementById('doneUl');
    movingElement.classList.remove('doing');
    movingElement.classList.add('done');
    newUl.appendChild(movingElement);
    saveTasksToLocalStorage();
};

// Load tasks on page load
window.onload = loadTasksFromLocalStorage;