//buttons
const openBtn = document.querySelector(".btn-open-window");
const closeBtn = document.querySelector(".btn-close-window");
const submitBtn = document.querySelector(".btn-submit");

//elements
const formWindow = document.querySelector(".form-window");
const nameInput = document.querySelector("#name");
const taskInput = document.querySelector("#task");
const dateInput = document.querySelector("#date");

openBtn.addEventListener("click", () => {
  formWindow.classList.toggle("open");
});

closeBtn.addEventListener("click", () => {
  formWindow.classList.remove("open");
});

const tasks = [];

function handleSubmit(e) {
  e.preventDefault();
  const name = nameInput.value;
  const task = taskInput.value;
  const date = dateInput.value;

  if (name && task && date) {
    console.log(name);
    tasks.push({ id: tasks.length + 1, name, task, date });
  }
  console.log(tasks);
}

submitBtn.addEventListener("click", handleSubmit);
