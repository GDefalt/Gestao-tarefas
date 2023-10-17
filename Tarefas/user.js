document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const taskForm = document.getElementById('task-form');
    const pendingTasksList = document.getElementById('pending-tasks');
    const completedTasksList = document.getElementById('completed-tasks');
    const logoutButton = document.getElementById('logout-button');

    if (!loggedInUser) {
        alert('Você precisa fazer login para acessar esta área.');
        window.location.href = '../Registrar/index.html';
    }

    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser');
        window.location.href = '../home.html';
    });

    function restoreTaskDetails(taskId) {
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        const taskItem = userTasks[taskId];

        const listItem = taskItem.status === 'pendente' ?
            pendingTasksList.querySelector(`[data-id="${taskId}"]`) :
            completedTasksList.querySelector(`[data-id="${taskId}"]`);

        listItem.innerHTML = `
            <strong>Nome:</strong> ${taskItem.name}<br>
            <strong>Descrição:</strong> ${taskItem.description}<br>
            <strong>Prazo:</strong> ${taskItem.dueDate}<br>
            <strong>Status:</strong> ${taskItem.status}<br>
            <div class="espace"></div>
            <button data-id="${taskId}" class="edit-button">Editar</button>
            <button data-id="${taskId}" class="delete-button">Excluir</button>
            <button data-id="${taskId}" class="complete-button">Marcar como Concluída</button>
        `;

        const completeButton = listItem.querySelector('.complete-button');
        completeButton.addEventListener('click', function () {
            completeTask(taskId);
        });

        const editButton = listItem.querySelector('.edit-button');
        editButton.addEventListener('click', function () {
            editTask(taskId);
        });

        const deleteButton = listItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', function () {
            deleteTask(taskId);
        });
    }

    function cancelEdit(taskId) {
        restoreTaskDetails(taskId);
    }

    function editTask(taskId) {
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        const taskItem = userTasks[taskId];

        const listItem = taskItem.status === 'pendente' ?
            pendingTasksList.querySelector(`[data-id="${taskId}"]`) :
            completedTasksList.querySelector(`[data-id="${taskId}"]`);

        const editTaskName = document.createElement('input');
        editTaskName.type = 'text';
        editTaskName.value = taskItem.name;
        editTaskName.setAttribute('class', 'edit-input');

        const editTaskDescription = document.createElement('input');
        editTaskDescription.type = 'text';
        editTaskDescription.value = taskItem.description;
        editTaskDescription.setAttribute('class', 'edit-input');

        const editTaskDueDate = document.createElement('input');
        editTaskDueDate.type = 'date';
        editTaskDueDate.value = taskItem.dueDate;
        editTaskDueDate.setAttribute('class', 'edit-input');

        const saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.setAttribute('data-id', taskId);
        saveButton.textContent = 'Salvar';

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel-button');
        cancelButton.setAttribute('data-id', taskId);
        cancelButton.textContent = 'Cancelar';

        const editForm = document.createElement('div');
        editForm.classList.add('edit-form');
        editForm.appendChild(editTaskName);
        editForm.appendChild(editTaskDescription);
        editForm.appendChild(editTaskDueDate);
        editForm.appendChild(saveButton);
        editForm.appendChild(cancelButton);

        // Remove o conteúdo atual do item da lista
        listItem.innerHTML = '';
        // Adiciona o formulário de edição ao item da lista
        listItem.appendChild(editForm);

        saveButton.addEventListener('click', function () {
            const editedName = editTaskName.value;
            const editedDescription = editTaskDescription.value;
            const editedDueDate = editTaskDueDate.value;
            saveTask(taskId, editedName, editedDescription, editedDueDate);
        });

        cancelButton.addEventListener('click', function () {
            cancelButtonAction(taskId);
        });

        activateInputs();
    }

    function cancelButtonAction(taskId) {
        const confirmed = confirm('Deseja cancelar a edição?');
        if (confirmed) {
            restoreTaskDetails(taskId);
        }
    }

    function activateInputs() {
        const editInputs = document.querySelectorAll('.edit-input');
        editInputs.forEach(input => {
            input.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        });
    }

    function saveTask(taskId, editedName, editedDescription, editedDueDate) {
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        const editedTask = userTasks[taskId];

        editedTask.name = editedName;
        editedTask.description = editedDescription;
        editedTask.dueDate = editedDueDate;

        localStorage.setItem(loggedInUser, JSON.stringify(userTasks));
        loadTasks();
    }

    function deleteTask(taskId) {
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        userTasks.splice(taskId, 1);
        localStorage.setItem(loggedInUser, JSON.stringify(userTasks));
        loadTasks();
    }

    function clearTaskForm() {
        document.getElementById('task-name').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-due-date').value = '';
    }

    function completeTask(taskId) {
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        userTasks[taskId].status = 'feita';
        localStorage.setItem(loggedInUser, JSON.stringify(userTasks));
        loadTasks();
    }

    function loadTasks() {
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];

        userTasks.sort((a, b) => (a.dueDate > b.dueDate) ? 1 : -1);

        userTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Nome:</strong> ${task.name}<br>
                <strong>Descrição:</strong> ${task.description}<br>
                <strong>Prazo:</strong> ${task.dueDate}<br>
                <strong>Status:</strong> ${task.status}<br>
                <div class="espace"></div>
                <button data-id="${index}" class="edit-button">Editar</button>
                <button data-id="${index}" class="delete-button">Excluir</button>
                <button data-id="${index}" class="complete-button">Marcar como Concluída</button>
            `;

            const completeButton = listItem.querySelector('.complete-button');
            completeButton.addEventListener('click', function () {
                completeTask(index);
            });

            const editButton = listItem.querySelector('.edit-button');
            editButton.addEventListener('click', function () {
                editTask(index);
            });

            const deleteButton = listItem.querySelector('.delete-button');
            deleteButton.addEventListener('click', function () {
                deleteTask(index);
            });

            if (task.status === 'pendente') {
                pendingTasksList.appendChild(listItem);
            } else {
                completedTasksList.appendChild(listItem);
            }
        });

        activateInputs();
    }

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDescription = document.getElementById('task-description').value;
        const taskDueDate = document.getElementById('task-due-date').value;
        const taskStatus = 'pendente'; 

        const currentDate = new Date().toISOString().split('T')[0];
        if (taskDueDate < currentDate) {
            alert('Não é possível criar tarefas com datas anteriores à data atual.');
            return;
        }

        if (!taskName || !taskDueDate) {
            alert('Nome da Tarefa e Prazo são campos obrigatórios.');
            return;
        }

        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        const newTask = {
            name: taskName,
            description: taskDescription,
            dueDate: taskDueDate,
            status: taskStatus,
        };
        userTasks.push(newTask);
        localStorage.setItem(loggedInUser, JSON.stringify(userTasks));

        clearTaskForm();
        loadTasks();
    });

    loadTasks();
});

function moveTaskToPending(taskId) {
    const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
    userTasks[taskId].status = 'pendente';
    localStorage.setItem(loggedInUser, JSON.stringify(userTasks));
    loadTasks();
}

function moveTaskToCompleted(taskId) {
    const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
    userTasks[taskId].status = 'feita';
    localStorage.setItem(loggedInUser, JSON.stringify(userTasks));
    loadTasks();
}

function organizeTasks() {
    const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
    const pendingTasks = userTasks.filter(task => task.status === 'pendente');
    const completedTasks = userTasks.filter(task => task.status === 'feita');

    pendingTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';

    pendingTasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Nome:</strong> ${task.name}<br>
            <strong>Descrição:</strong> ${task.description}<br>
            <strong>Prazo:</strong> ${task.dueDate}<br>
            <strong>Status:</strong> ${task.status}<br>
            <div class="espace"></div>
            <button data-id="${index}" class="edit-button">Editar</button>
            <button data-id="${index}" class="delete-button">Excluir</button>
            <button data-id="${index}" class="complete-button">Marcar como Concluída</button>
        `;

        const completeButton = listItem.querySelector('.complete-button');
        completeButton.addEventListener('click', function () {
            completeTask(index);
        });

        const editButton = listItem.querySelector('.edit-button');
        editButton.addEventListener('click', function () {
            editTask(index);
        });

        const deleteButton = listItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', function () {
            deleteTask(index);
        });

        pendingTasksList.appendChild(listItem);
    });

    completedTasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Nome:</strong> ${task.name}<br>
            <strong>Descrição:</strong> ${task.description}<br>
            <strong>Prazo:</strong> ${task.dueDate}<br>
            <strong>Status:</strong> ${task.status}<br>
            <div class="espace"></div>
            <button data-id="${index}" class="edit-button">Editar</button>
            <button data-id="${index}" class="delete-button">Excluir</button>
            <button data-id="${index}" class="pending-button">Mover para Pendente</button>
        `;

        const pendingButton = listItem.querySelector('.pending-button');
        pendingButton.addEventListener('click', function () {
            moveTaskToPending(index);
        });

        const editButton = listItem.querySelector('.edit-button');
        editButton.addEventListener('click', function () {
            editTask(index);
        });

        const deleteButton = listItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', function () {
            deleteTask(index);
        });

        completedTasksList.appendChild(listItem);
    });
}

function loadTasks() {
    organizeTasks();
}
