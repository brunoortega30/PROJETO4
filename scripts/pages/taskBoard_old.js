import { API_BASE_URL } from "../../config/apiConfig.js";
import { getFromLocalStorage } from "../utils/storage.js";

const boardsList = document.getElementById("boardsList");
const userNameSpan = document.getElementById("userName");
const logoutButton = document.getElementById("logoutButton");
const boardTitle = document.getElementById("boardTitle");
const boardLayout = document.getElementById("board");

async function loadBoards() {
    try {
        const response = await fetch(`${API_BASE_URL}/Boards`);
        if (!response.ok) {
            throw new Error("Erro ao carregar boards");
        }
        const boards = await response.json();
        populateBoardsDropdown(boards);
    } catch (error) {
        console.error("Erro ao carregar boards:", error);
    }
}

function populateBoardsDropdown(boards) {
    
    boards.forEach((board) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a class="dropdown-item" id="dropdown-item" value="${board.Id}">${board.Name}</a>`;
        listItem.addEventListener("click", (event) => {
            // console.log(board.Id)
            boardTitle.innerHTML = event.target.innerHTML;
            loadBoard(board.Id);
        })
        boardsList.appendChild(listItem);
    });
}

async function loadBoard(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${id}`)
        if(!response.ok) {
            throw new Error("Erro ao carregar colunas");
        }
        const columns = await response.json();
        populateColumns(columns);
    } catch (error) {
        console.error("Erro ao carregar colunas:", error);
    }
}

function populateColumns(columns) {

    boardLayout.innerHTML = ""; 

    columns.forEach((column) => {

        const columnItem = document.createElement("article");
        columnItem.className = "column-item";

        const columnHeader = document.createElement("header");
        columnHeader.className = "column-header";
        columnHeader.innerHTML = `<h5>${column.Name}</h5>`;

        const columnBody = document.createElement("div");
        columnBody.className = "column-body";
        columnBody.id = `tasks-${column.Id}`;


        columnItem.appendChild(columnHeader);
        columnItem.appendChild(columnBody);


        boardLayout.appendChild(columnItem);

        fetchTasksByColumn(column.Id).then((res)=>{
            addTasksToColumn(column.Id, res)
        });


    });
}

function fetchTasksByColumn(columnId) {
    const endpoint = `${API_BASE_URL}/TasksByColumnId?ColumnId=${columnId}`;
    return fetch(endpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar tasks para ColumnId ${columnId}: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error(error);
            return [];
        });
}

function addTasksToColumn(columnId, tasks) {
    const columnBody = document.getElementById(`tasks-${columnId}`);

    tasks.forEach((task) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        taskItem.innerHTML = `
            <h6>${task.Title || "Sem título"}</h6>
            <p>${task.Description || "Sem descrição"}</p>
        `;

        
        columnBody.appendChild(taskItem);

        

    });
}

function loadUserName() {
    const userName = getFromLocalStorage("user");
    console.log(userName)
    if (userName.name) {
        userNameSpan.textContent = `Olá, ${userName.name.split(' ')[0]}`;
    } else {
        userNameSpan.textContent = "Usuário não identificado";
    }
}

/* //AQUI VAI SER UM CÓDIGO NOVO PARA TESTE

// Seleciona os elementos do DOM
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Função para adicionar uma nova tarefa
function addTask() {
    const taskText = taskInput.value.trim(); // Obtém o texto e remove espaços extras

    if (taskText === "") {
        alert("Por favor, insira uma tarefa válida.");
        return;
    }

    // Cria um novo elemento para a tarefa
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.textContent = taskText;

    const columnBody = document.getElementById(`tasks-${columnId}`);

    // Adiciona o novo item à lista de tarefas
    taskList.appendChild(taskItem);

    // Limpa o campo de entrada
    taskInput.value = "";
}

// Adiciona o evento de clique ao botão
addTaskBtn.addEventListener("click", addTask);

// Permite adicionar tarefas ao pressionar Enter
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
}); */


logoutButton.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
});


function init() {
    loadUserName();
    loadBoards();
}

init();