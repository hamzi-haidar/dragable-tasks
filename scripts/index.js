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

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

openBtn.addEventListener("click", () => {
  formWindow.classList.toggle("open");
});

closeBtn.addEventListener("click", () => {
  formWindow.classList.remove("open");
});

function addTasks() {
  tasks &&
    tasks.forEach((task) => {
      const newTask = document.createElement("li");

      newTask.setAttribute("draggable", "true");
      newTask.setAttribute("data-id", task.id);
      newTask.setAttribute("class", "draggable");
      newTask.setAttribute("data-status", task.status);

      newTask.innerHTML = `<div class="list-item">
              <p><span>Name:</span> ${task.name}</p>
              <p><span>Task:</span> ${task.task}</p>
              <p><span>Due date:</span> ${task.date}</p>
            </div>`;

      if (task.status === "pending" && new Date(task.date) >= new Date()) {
        pendingList.append(newTask);
      } else if (task.status === "complete") {
        completeList.append(newTask);
      } else {
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
    tasks.push({ id: tasks.length + 1, name, task, date, status: "pending" });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

submitBtn.addEventListener("click", handleSubmit);

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
      const taskStatus = draggingTask.dataset.status;

      const taskToUpdate = tasks.find((task) => task.id === parseInt(taskId));
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
