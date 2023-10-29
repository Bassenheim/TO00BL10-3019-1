//todoList script

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('listaTehtava');
    const addTaskButton = document.getElementById('listaLisaa');
    const errorMessage = document.getElementById('virheViesti');
    const todoList = document.getElementById('listaLista');
    const filter = document.getElementById('listaFiltteri');
    const clearCompletedButton = document.getElementById('listaTyhjenna');
    const counter = document.getElementById('listaLaskin');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask() {
        const listaTeksti = taskInput.value.trim();
        if (listaTeksti === '') {
            errorMessage.textContent = 'cannot be empty';
            return;
        }
        if (!tarkastaUTF8(listaTeksti)) {
            errorMessage.textContent = 'contains invalid characters';
            return;
        }
        errorMessage.textContent = '';
        
        const task = { text: listaTeksti, done: false };
        tasks.push(task);
        saveTasks();
        
        taskInput.value = '';
        displayTasks();
    }

    function displayTasks() {
        todoList.innerHTML = '';
        const selectedFilter = filter.value;
        let activeTasks = 0;

        tasks.forEach((task, index) => {
            if ((selectedFilter === 'active' && task.done) || (selectedFilter === 'completed' && !task.done)) {
                return;
            }

            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');

            if (task.done) {
                taskItem.classList.add('completed');
            }

            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-button">X</button>
            `;

            taskItem.querySelector('.task-checkbox').addEventListener('change', () => {
                task.done = !task.done;
                saveTasks();
                displayTasks();
            });

            taskItem.querySelector('.delete-button').addEventListener('click', () => {
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

    displayTasks();
    
    function tarkastaUTF8(input) {
        const pattern = /^[\x00-\x7F]*$/;
        return pattern.test(input);
    }
});
