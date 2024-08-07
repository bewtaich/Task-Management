
const today = dayjs();
let history = [];

//Generates a unique task id
function generateTaskId() {
  const rand = crypto.randomUUID();
  return rand
}

//Creates a task card
function createTaskCard(task) {

  const cardSkel = `<div class="card task ui-state-default" id="${task.id}">
  <div class="card-header"><h2>${task.Title}</h2></div>
  <div class="card-body">
  <p>Due: ${task.Date}</p>
  <p>${task.Desc}</p>
  <button class="deleter">Delete</button>
  </div>
  </div>
  `
  if (task.status === 'todo'){
    $('#todo-cards').prepend(cardSkel);
  } else if (task.status === 'done') {
    $('#done-cards').prepend(cardSkel);
  } else {
    $('#in-progress-cards').prepend(cardSkel);
  }
  const due = dayjs(task.Date);
  if (today.isAfter(due)) {
    $(`#${task.id}`).attr('class', "card task ui-state-default late")
  } else if ((today < due) && (today >= (due.subtract(3, 'day')))) {
    $(`#${task.id}`).attr('class', "card task ui-state-default soon")
  }

}

//Settings for Modal Dialog
const dialog =
  $("#task-dialog-form").dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      "Add Task": handleAddTask,
      Cancel: function () {
        dialog.dialog("close");
      }
    }
  })



// Makes draggable and updates status
function makeDraggable() {
  $("#todo-cards").sortable({
    connectWith: "#in-progress-cards, #done-cards",
    dropOnEmpty: true,
    items: "> .task",
    helper: 'clone',
    update: function (event, ui) {
      let column = ui.item.parent()
      let status = column.attr('class').split(' ')[0];
      let currentid = ui.item.attr('id')

      let historyIndex = history.findIndex(history => history.id === currentid)
      history[historyIndex].status = status
      localStorage.setItem('tasks', JSON.stringify(history));
    }
  })

  $("#done-cards").sortable({
    connectWith: "#in-progress-cards, #todo-cards",
    dropOnEmpty: true,
    items: "> .task",
    helper: 'clone',
    update: function (event, ui) {
      let column = ui.item.parent()
      let status = column.attr('class').split(' ')[0];
      let currentid = ui.item.attr('id')

      let historyIndex = history.findIndex(history => history.id === currentid)
      history[historyIndex].status = status
      localStorage.setItem('tasks', JSON.stringify(history));
    }
  })
  $("#in-progress-cards").sortable({
    connectWith: "#todo-cards, #done-cards",
    dropOnEmpty: true,
    items: "> .task",
    helper: "clone",
    update: function (event, ui) {
      let column = ui.item.parent()
      let status = column.attr('class').split(' ')[0];
      let currentid = ui.item.attr('id')

      let historyIndex = history.findIndex(history => history.id === currentid)
      history[historyIndex].status = status
      localStorage.setItem('tasks', JSON.stringify(history));
    }
  })
}

// Deletes task from page and local storage
function handleDeleteTask(event) {
  $('.deleter').on('click', function () {
    const card = $(this).parent().parent();
    let currentid = card.attr('id')
    let historyIndex = history.findIndex(history => history.id === currentid)
    history.splice(historyIndex,1)
    localStorage.setItem('tasks', JSON.stringify(history));

    card.remove();
  })
}

//Adds new tasks to local storage
function addToLocalStorage(task) {
  const taskObj = task;
  history.push(taskObj)
  localStorage.setItem('tasks', JSON.stringify(history));
}

// Creates Task Object
function handleAddTask() {

  const title = $('#taskTitle')
  const date = $('#taskDate')
  const desc = $('#taskDesc')
  let currenttaskid = generateTaskId();
  const task = {
    Title: title.val(),
    Date: date.val(),
    Desc: desc.val(),
    id: currenttaskid,
    status: 'todo'
  }
    createTaskCard(task);
    handleDeleteTask();
    makeDraggable();
    addToLocalStorage(task);
    dialog.dialog('close');
}



function loadUp() {
  if (JSON.parse(localStorage.getItem('tasks'))) {
    history = JSON.parse(localStorage.getItem('tasks'))

    for (i = 0; i < history.length; i++) {
      createTaskCard(history[i]);
      makeDraggable();
    }
    handleDeleteTask();
  }
}


$(document).ready(function () {

  loadUp();

  $("#add-task-button").on("click", function () {
    dialog.dialog("open");
  });


  $('#taskDate').datepicker();

  dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    handleAddTask();    
  })
});


