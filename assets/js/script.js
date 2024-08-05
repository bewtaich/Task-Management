
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const today = dayjs();

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const rand = crypto.randomUUID();
    return rand
}

// Todo: create a function to create a task card
function createTaskCard(task){

  const cardSkel=`<div class="card task ui-state-default" id="${task.id}">
  <div class="card-header"><h2>${task.Title}</h2></div>
  <div class="card-body">
  <p>Due: ${task.Date}</p>
  <p>${task.Desc}</p>
  <button class="deleter">Delete</button>
  </div>
  </div>
  `
  $('#todo-cards').prepend(cardSkel);
 
}

const dialog = 
$("#task-dialog-form").dialog({
autoOpen: false,
height: 400,
width: 350,
modal: true,
buttons: {
  "Add Task":handleAddTask,
  Cancel: function() {
    dialog.dialog("close");
    }
}
})



// Todo: create a function to render the task list and make cards draggable
function makeDraggable () {
  $("#todo-cards").sortable({
    connectWith:"#in-progress-cards, #done-cards",
    dropOnEmpty:true,
    items:"> .task",
    helper:'clone'
    
  })
  $("#done-cards").sortable({
    connectWith:"#in-progress-cards, #todo-cards",
    dropOnEmpty:true,
    items:"> .task",
    helper:'clone'
    
  })
  $("#in-progress-cards").sortable({
    connectWith:"#todo-cards, #done-cards",
    dropOnEmpty:true,
    items:"> .task",
    helper:"clone"
  })
}

// Todo: create a function to handle adding a new task
function handleAddTask(){
  
  const title = $('#taskTitle')
  const date = $('#taskDate')
  const desc = $('#taskDesc')
  let currenttaskid = generateTaskId();
  const task = {
    Title:title.val(),
    Date:date.val(),
    Desc:desc.val(),
    id:currenttaskid
  }

  console.log(task)
  createTaskCard(task);
  handleDeleteTask()
  makeDraggable();
  handleDrop(task);
  dialog.dialog('close')
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  $('.deleter').on('click', function(){
    $(this).parent().parent().remove();
     })
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(task, ui) {
  const due = dayjs(task.Date);
  if (today.isAfter(due)){
    $(`#${task.id}`).attr('class',"card task ui-state-default late")
  } else if ((today<due)&&(today>=(due.subtract(3,'day')))){
    $(`#${task.id}`).attr('class',"card task ui-state-default soon")
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

$(document).ready(function () {

$("#add-task-button").on("click", function() {
    dialog.dialog("open");
  });
});

$('#taskDate').datepicker();

const form = dialog.find( "form" ).on( "submit", function( event ) {
  event.preventDefault();
  handleAddTask();
  handleDeleteTask()
  makeDraggable();

});
