// // Define the time range for the scheduler
// const startTime = moment().set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
// const endTime = moment().set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

// // Define the task data structure as an array of objects
// let tasks = [];

// // Function to display the current date in the header
// function displayCurrentDate() {
//   const currentDate = moment().format('dddd, MMMM Do');
//   $('#currentDay').text(currentDate);
// }

// // Function to display a single task row
// function displayTaskRow(task) {
//   const time = moment(task.time, 'HH:mm');
//   const taskRow = $(`
//     <tr class="task-row">
//       <td class="hour">${time.format('h A')}</td>
//       <td class="description"><textarea>${task.description}</textarea></td>
//       <td class="save-btn"><button>Save</button></td>
//     </tr>
//   `);
//   if (time.isBefore(moment())) {
//     taskRow.addClass('past');
//   } else if (time.isSame(moment(), 'hour')) {
//     taskRow.addClass('present');
//   } else {
//     taskRow.addClass('future');
//   }
//   $('.task-table').append(taskRow);
// }

// // Function to render all the tasks in the scheduler
// function renderTasks() {
//   tasks.forEach(task => displayTaskRow(task));
// }

// // Function to save the tasks to local storage
// function saveTasks() {
//   localStorage.setItem('tasks', JSON.stringify(tasks));
// }

// // Function to add a new task to the scheduler
// function addTask() {
//   const newTask = {
//     time: $(this).data('time'),
//     description: ''
//   };
//   tasks.push(newTask);
//   displayTaskRow(newTask);
//   saveTasks();
// }

// // Function to update a task in the scheduler
// function updateTask() {
//   const taskIndex = $(this).closest('.task-row').index();
//   tasks[taskIndex].description = $(this).siblings('textarea').val();
//   saveTasks();
// }

// // Function to delete a task from the scheduler
// function deleteTask() {
//   const taskIndex = $(this).closest('.task-row').index();
//   tasks.splice(taskIndex, 1);
//   $(this).closest('.task-row').remove();
//   saveTasks();
// }

// // Initialize the scheduler
// function initScheduler() {
//   // Display the current date
//   displayCurrentDate();
  
//   // Load the tasks from local storage
//   const storedTasks = JSON.parse(localStorage.getItem('tasks'));
//   if (storedTasks) {
//     tasks = storedTasks.filter(task => moment(task.time, 'HH:mm').isBetween(startTime, endTime));
//   }
  
//   // Render the tasks in the scheduler
//   renderTasks();
  
//   // Add event listeners for the save and delete buttons
//   $('.task-table').on('click', '.save-btn button', updateTask);
//   $('.task-table').on('click', '.add-btn button', addTask);
//   $('.task-table').on('click', '.delete-btn button', deleteTask);
// }

// $(initScheduler);


//  DOM elements
var currentDayEl = $('#currentDay');
var timeBlock = $('#time-block');

// create  variables
var currentHour = moment().set({minutes: 0, seconds: 0, milliseconds: 0});

// create empty  object
var taskArr = {};
taskArr = JSON.parse(localStorage.getItem('storedTaskArr'));

// function to show current date
function currentDate() {
    var today = moment().format('dddd, MMMM Do');
    currentDayEl.text(today);
}

// function to display a row at a specific hour
function displayTask(time) {
    
    // create a single row in the table
    var taskRowEl = $('<tr>').addClass('row');
    var hourEl = $('<td>').addClass('hour col-2').text(time.format('h A'));
    var toDoEl = $('<td>').addClass('col-8 p-0');
    var toDoInput = $('<textarea>').addClass('defination');
    toDoInput.attr('id', time.format('H')).text(taskArr[time.format('H')]);
    var saveBtnEl = $('<td>').addClass('saveBtn col-2').text('Save 💾');
    saveBtnEl.attr('data-attrtime', time.format('H'));

    // appending elements to the table row and table
    toDoEl.append(toDoInput);
    taskRowEl.append(hourEl, toDoEl, saveBtnEl);
    timeBlock.append(taskRowEl);

    // check the task slot color 
    switch (true) {
        case time.isBefore(currentHour):
            toDoInput.addClass('past');
            break;
        case time.isSame(currentHour):
            toDoInput.addClass('present');
            break;
        default:
            toDoInput.addClass('future');
            break;
    }
    
}

function completeTasks() {
//     for (var i = 9; i < 18; i++) {
//         var timeSlot = moment().set({hour: i});
//         displayTask(timeSlot);
//     }

Array.from({ length: 9 }).forEach((_, i) => {
    const timeSlot = moment({ hour: i + 9 });
    displayTask(timeSlot);
  });
  
 }

// function to manage the tasks in local storage. The user can add, edit or delete a task
function taskManager(event) {
    event.preventDefault();
    // get the target element, hour and task 
    var targetEl = event.target;
    var targetHour = $(targetEl).attr('data-time');  
    var taskToSave = $('#' + targetHour).val();

    if (taskArr === null || taskArr.date != moment().format('DD/MM/YYYY')) {
        taskArr = {};
        taskArr.date = moment().format('DD/MM/YYYY');
        taskArr[targetHour] = taskToSave; 
    } else {
        taskArr[targetHour] = taskToSave; 
    }
    localStorage.setItem('storedTaskArr', JSON.stringify(taskArr));

//     const today = moment().format('DD/MM/YYYY');
// const taskArr = localStorage.getItem(today) ? JSON.parse(localStorage.getItem(today)) : {};

// taskArr[targetHour] = taskToSave;
// localStorage.setItem(today, JSON.stringify(taskArr));

}

$(function() {
    // display current date
    currentDate();

    // check the local storage. If it's null or not the same day, clear the tasks in local storage and reset a new date
    if (taskArr === null || taskArr.date != moment().format('DD/MM/YYYY')) {
        taskArr = {};
        taskArr.date = moment().format('DD/MM/YYYY');
        localStorage.setItem('storedTaskArr', JSON.stringify(taskArr));
    } 
 
    // render all the time blocks based on the local storage
    completeTasks();
    // event listener for the save button
    timeBlock.on('click', '.saveBtn', taskManager);
});
