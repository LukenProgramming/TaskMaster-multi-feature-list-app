const nStartedBtn = document.getElementById('nStartedBtn');
const doingBtn = document.getElementById('doingBtn');

const saveTasksToLocalStorage = () => {
    const notStartedTasksArray = [];
    const doingTasksArray = [];
    const doneTasksArray = [];

    document.querySelectorAll('#notStartedUl li').forEach(li => {
        notStartedTasksArray.push({ text: li.textContent, className: li.className });
    });
    document.querySelectorAll('#doingUl li').forEach(li => { // Fixed selector here
        doingTasksArray.push({ text: li.textContent, className: li.className });
    });
    document.querySelectorAll('#doneUl li').forEach(li => {
        doneTasksArray.push({ text: li.textContent, className: li.className });
    });

    localStorage.setItem('notStartedTasksArray', JSON.stringify(notStartedTasksArray));
    localStorage.setItem('doingTasksArray', JSON.stringify(doingTasksArray));
    localStorage.setItem('doneTasksArray', JSON.stringify(doneTasksArray));
};

const loadTasksFromLocalStorage = () => {
    const notStartedTasksArray = JSON.parse(localStorage.getItem('notStartedTasksArray')) || [];
    const doingTasksArray = JSON.parse(localStorage.getItem('doingTasksArray')) || [];
    const doneTasksArray = JSON.parse(localStorage.getItem('doneTasksArray')) || [];

    notStartedTasksArray.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.className = task.className;
        document.getElementById('notStartedUl').appendChild(li);
        li.addEventListener('click', moveTaskToDoing); // Add event listener here
    });

    doingTasksArray.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.className = task.className;
        document.getElementById('doingUl').appendChild(li);
        li.addEventListener('click', moveTaskToDone); // Add event listener here
    });

    doneTasksArray.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.className = task.className;
        document.getElementById('doneUl').appendChild(li);
    });
};

const getNewNotStarted = () => {
    let newNotStartedTaskField = document.getElementById('newNotStarted');
    let newNotStartedTask = newNotStartedTaskField.value.trim();

    if (newNotStartedTask !== "") {
        const ul = document.getElementById('notStartedUl');
        const li = document.createElement('li');
        li.textContent = `${newNotStartedTask}`;
        ul.appendChild(li).classList.add('moveable', 'notStarted');
        li.addEventListener('click', moveTaskToDoing);
        newNotStartedTaskField.value = "";
        saveTasksToLocalStorage(); // Save tasks after adding
    }
};

const getNewDoing = () => {
    let newDoingTaskField = document.getElementById('newDoing');
    let newDoingTask = newDoingTaskField.value.trim();

    if (newDoingTask !== "") {
        const ul = document.getElementById('doingUl');
        const li = document.createElement('li');
        li.textContent = `${newDoingTask}`;
        ul.appendChild(li).classList.add('moveable', 'doing');
        li.addEventListener('click', moveTaskToDone);
        newDoingTaskField.value = "";
        saveTasksToLocalStorage(); // Save tasks after adding
    }
};

nStartedBtn.onclick = () => {
    getNewNotStarted();
    console.log("New not started task added");
};

doingBtn.onclick = () => {
    getNewDoing();
    console.log("New doing task added");
};

const moveTaskToDoing = (event) => {
    const movingElement = event.target;
    const newUl = document.getElementById('doingUl');
    movingElement.classList.remove('notStarted');
    movingElement.classList.add('doing');
    newUl.appendChild(movingElement);
    movingElement.removeEventListener('click', moveTaskToDoing);
    movingElement.addEventListener('click', moveTaskToDone);
    saveTasksToLocalStorage(); // Save tasks after moving
};

const moveTaskToDone = (event) => {
    const movingElement = event.target;
    const newUl = document.getElementById('doneUl');
    movingElement.classList.remove('doing');
    movingElement.classList.add('done');
    newUl.appendChild(movingElement);
    saveTasksToLocalStorage(); // Save tasks after moving
};

window.onload = loadTasksFromLocalStorage;