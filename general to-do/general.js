const submitBtn = document.getElementById('submitBtn');
const wooshSound = new Audio("/audio/Untitled video - Made with Clipchamp.mp3")
const dateElement = document.getElementById('date');
let currentDate = new Date();

const radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('click', () => {
        const value = radioButton.value === 'true';
        if (value) {
            console.log("User wants to add a due date to their task.");
            dateElement.classList.remove('hidden');
            dateElement.classList.add('show');
        }
        else {
            dateElement.classList.remove('show');
            dateElement.classList.add('hidden');
        }
    });
});


const getNewTask = () => {
    let newTaskField = document.getElementById('newTask');
    let newTask = newTaskField.value.trim();
    console.log(newTask);

    if (newTask !== "") {
        const ul = document.getElementById('notDoneTaskList');
        const li = document.createElement('li');
        const dateToAdd = new Date(document.getElementById('date').value);
        li.textContent = `${newTask} - ${dateToAdd.toLocaleDateString()}`;
        if(currentDate > dateToAdd){
            li.style.color = 'red';
        }
        ul.appendChild(li).classList.add('strikeable','notDoneTask');
        newTaskField.value = "";
    }
};

submitBtn.onclick = () => {
    getNewTask();
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

const moveTask = (movingElement) => {
    const ul = document.getElementById('notDoneTaskList');
    const ol = document.getElementById('doneTasksList');
    ol.appendChild(movingElement).classList.add('doneTask');
    wooshSound.play();
}

document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('strikeable') || target.classList.contains('strike-through')) {
        const movingElement = target.parentNode.removeChild(target);
        moveTask(movingElement);
    }
});

