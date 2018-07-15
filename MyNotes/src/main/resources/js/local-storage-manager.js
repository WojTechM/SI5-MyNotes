var table = document.getElementById("task-table");
var tasks = {};
const defaultTitle = 'title';
const defaultDesc = 'description';

loadTasksFromLocalStorage();
addTasksToTable();
addButtonFunctionality();


function loadTasksFromLocalStorage() {
    for (var key in localStorage){
        if (isNumeric(key)) {
            tasks[key] = JSON.parse(localStorage.getItem(key));
        }
    }
}

function addTasksToTable() {
    if (tasks) {
        for (var key in tasks) {
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = key;
            cell2.innerHTML = getAsSpan(tasks[key].title);
            cell3.innerHTML = getAsSpan(tasks[key].description);
            cell4.innerHTML = "<button onclick=\"deleteTask(" + key + ")\">DELETE</button>";
            addEditionToCell(cell2, key);
            addEditionToCell(cell3, key);
        }
    } else {
        addNewRow(1);
    }
}


function addButtonFunctionality() {
    var button = document.getElementById("add-button");
    button.addEventListener("click",
        function() {
            var newId = addToLocalStorage();
            addNewRow(newId);
        }
    );
}

function addToLocalStorage() {
    let newId = Math.floor(Math.random() * 100000) + 1;
    localStorage.setItem(newId, JSON.stringify({
        title: defaultTitle,
        description: defaultDesc}));
    return newId;
}

function addNewRow(newId) {
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = newId;
    cell2.innerHTML = getAsSpan(defaultTitle);
    cell3.innerHTML = getAsSpan(defaultDesc);
    cell4.innerHTML = "<button onclick=\"deleteTask(" + newId + ")\">DELETE</button>";
    addEditionToCell(cell2, newId);
    addEditionToCell(cell3, newId);
}

function deleteTask(taskId) {
    var rowIndex = getRowIndexByTaskId(taskId);
    if(rowIndex != -1) {
        table.deleteRow(rowIndex);
        localStorage.removeItem(taskId);
    }
}

function getRowIndexByTaskId(taskId) {
    var cells;
    const idIndex = 0;
    for(let i = 0; i < table.rows.length; i++) {
        cells = table.rows.item(i).cells;
        if(cells.item(idIndex).innerHTML == taskId) {
            return i;
        }
    }
    return -1;
}

function addEditionToCell(cell, taskId) {
    var id = taskId;
    cell.addEventListener("dblclick",
    function(event) {
        handleClick(cell, id);
    });
}

function handleClick(cell, id) {
    var childNode = cell.childNodes[0];
    if(childNode.tagName == "SPAN") {
        convertToInput(childNode, cell, id);
    } else {
        convertToSpan(childNode, cell);
    }
}

function convertToInput(childNode, cell, taskId) {
    var newChildNode = document.createElement("input");
    newChildNode.setAttribute("value", childNode.innerHTML);
    childNode = cell.replaceChild(newChildNode, childNode);
    newChildNode.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            var spanChildNode = document.createElement("span");
            spanChildNode.innerHTML = newChildNode.value;
            childNode = cell.replaceChild(spanChildNode, newChildNode);
            updateLocalStorage(taskId);
        }});
}

function convertToSpan(childNode, cell) {
    var spanChildNode = document.createElement("span");
    spanChildNode.innerHTML = childNode.value;
    childNode = cell.replaceChild(spanChildNode, newChildNode);
    updateLocalStorage(taskId);
}

function updateLocalStorage(taskId) {
    var rowIndex = getRowIndexByTaskId(taskId);
    if (rowIndex != -1) {
        var rowCells = table.rows.item(rowIndex).cells;
        localStorage.setItem(taskId, JSON.stringify({
        title: rowCells.item(1).childNodes[0].innerHTML,
        description: rowCells.item(2).childNodes[0].innerHTML
        }))
    }
}

function getAsSpan(text) {
    return "<span>" + text + "</span>";
}

function isNumeric(value) {
    let regex = /^\d+$/;
    return regex.test(value);
}
