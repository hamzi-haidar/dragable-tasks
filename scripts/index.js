//buttons
const openBtn = document.querySelector(".btn-open-window");
const closeBtn = document.querySelector(".btn-close-window");
const submitBtn = document.querySelector(".btn-submit");

//elements
const formWindow = document.querySelector(".form-window");
const nameInput = document.querySelector("#name");
const taskInput = document.querySelector("#task");
const dateInput = document.querySelector("#date");

//lists
const pendingList = document.querySelector(".pending-list");
const completeList = document.querySelector(".complete-list");
const pastDueList = document.querySelector(".past-due-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const today = new Date();

const day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
const month =
  today.getMonth() < 10 ? "0" + (+today.getMonth() + 1) : +today.getMonth() + 1;
const year = today.getFullYear();

const formatedDate = year + "-" + month + "-" + day;

console.log(formatedDate);

dateInput.setAttribute("min", formatedDate);

//close and open add task window
openBtn.addEventListener("click", () => {
  formWindow.classList.toggle("open");
});

closeBtn.addEventListener("click", () => {
  formWindow.classList.remove("open");
});

//gets tasks from local storage and add them to the dom
function addTasks() {
  tasks &&
    tasks.forEach((task) => {
      const newTask = document.createElement("li");

      newTask.innerHTML = `<div class="list-item">
             <button class="btn-delete">❌</button>
              <p><span>Name:</span> ${task.name}</p>
              <p><span>Task:</span> ${task.task}</p>
              <p><span>Due date:</span> ${task.date}</p>
            </div>`;

      if (task.status === "pending" && new Date(task.date) > today) {
        newTask.setAttribute("draggable", "true");
        newTask.setAttribute("data-id", task.id);
        newTask.setAttribute("class", "draggable");
        newTask.setAttribute("data-status", task.status);
        pendingList.append(newTask);
      } else if (task.status === "complete") {
        newTask.setAttribute("draggable", "true");
        newTask.setAttribute("data-id", task.id);
        newTask.setAttribute("class", "draggable");
        newTask.setAttribute("data-status", task.status);
        completeList.append(newTask);
      } else {
        newTask.setAttribute("data-id", task.id);
        newTask.setAttribute("data-status", task.status);
        pastDueList.append(newTask);
      }
    });
}

addTasks();

function handleSubmit(e) {
  const name = nameInput.value;
  const task = taskInput.value;
  const date = dateInput.value;

  if (name && task && date) {
    tasks.push({
      id: tasks.length + 1,
      name,
      task,
      date,
      status: new Date(date) > today ? "pending" : "past-due",
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

submitBtn.addEventListener("click", handleSubmit);

//To set a pending task to complete task by dragging it to the complete list
document.addEventListener("DOMContentLoaded", () => {
  const draggables = document.querySelectorAll(".draggable");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  const lists = document.querySelectorAll(".pending-list, .complete-list");

  lists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingTask = document.querySelector(".dragging");
      list.appendChild(draggingTask);
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggingTask = document.querySelector(".dragging");
      const taskId = draggingTask.dataset.id;

      const taskToUpdate = tasks.find((task) => task.id === Number(taskId));
      if (taskToUpdate) {
        taskToUpdate.status = list.classList.contains("complete-list")
          ? "complete"
          : "pending";
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }

      list.appendChild(draggingTask);
    });
  });
});

//To delete a list Item
const lists = document.querySelectorAll("ul");

lists.forEach((list) =>
  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const listItem = e.target.closest("li");

      const id = Number(listItem.dataset.id);

      list.removeChild(listItem);

      tasks = tasks.filter((task) => task.id !== id);

      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  })
);
