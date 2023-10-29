//todoList script

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('listaTehtava');
    const addTaskButton = document.getElementById('listaLisaa');
    const errorMessage = document.getElementById('virheViesti');
    const todoList = document.getElementById('listaLista');
    const filter = document.getElementById('listaFiltteri');
    const clearCompletedButton = document.getElementById('listaTyhjenna');
    const clearAllButton = document.getElementById('listaTyhjennaKaikki');
    const counter = document.getElementById('listaLaskin');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask() {
        const listaTeksti = taskInput.value.trim();
        if (listaTeksti === '') {
            errorMessage.textContent = 'cannot be empty';
            taskInput.style.borderColor = 'red';
            taskInput.style.borderWidth = '2px';
            return;
        }
        if (listaTeksti.length < 3) {
            errorMessage.textContent = 'must be longer than 3 characters';
            taskInput.style.borderColor = 'red';
            taskInput.style.borderWidth = '2px';
            return;
        }
        if (listaTeksti.length > 100) {
            errorMessage.textContent = 'must be shorter than 100 characters';
            taskInput.style.borderColor = 'red';
            taskInput.style.borderWidth = '2px';
            return;
        }
        if (!tarkastaUTF8(listaTeksti)) {
            errorMessage.textContent = 'contains invalid characters';
            taskInput.style.borderColor = 'red';
            taskInput.style.borderWidth = '2px';
            return;
        }

        errorMessage.textContent = '';
        
        const task = { text: listaTeksti, done: false };
        tasks.push(task);
        saveTasks();
        
        taskInput.value = '';
        taskInput.style.borderColor = '';
        taskInput.style.borderWidth = '';
        displayTasks();
    }

    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    function displayTasks() {
        todoList.innerHTML = '';
        const selectedFilter = filter.value;
        let activeTasks = 0;

        tasks.forEach((task, index) => {
            if ((selectedFilter === 'active' && task.done) || (selectedFilter === 'completed' && !task.done)) {
                return;
            }

            const taskItem = document.createElement('div');
            taskItem.classList.add('listtaskItem');

            if (task.done) {
                taskItem.classList.add('completed');
            }

            taskItem.innerHTML = `
                <input type="checkbox" class="taskCheckbox" ${task.done ? 'checked' : ''}>
                <span class="taskText">${task.text}</span>
                <button class="deleteButton">X</button>
            `;

            taskItem.querySelector('.taskCheckbox').addEventListener('change', () => {
                task.done = !task.done;
                saveTasks();
                displayTasks();
            });

            taskItem.querySelector('.deleteButton').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                displayTasks();
            });

            todoList.appendChild(taskItem);

            if (!task.done) {
                activeTasks++;
            }
        });

        counter.textContent = `${activeTasks} item${activeTasks === 1 ? '' : 's'} left`;
    }

    addTaskButton.addEventListener('click', addTask);

    filter.addEventListener('change', displayTasks);

    clearCompletedButton.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.done);
        saveTasks();
        displayTasks();
    });

    clearAllButton.addEventListener('click', () => {
        tasks = [];
        saveTasks();
        displayTasks();
    });

    displayTasks();
    
    function tarkastaUTF8(input) {
        const pattern = /^[A-Za-z0-9\såäöÅÄÖ]*$/;
        return pattern.test(input);
    }



});
