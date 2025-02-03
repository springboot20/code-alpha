let data = localStorage.getItem("todo-list")
  ? JSON.parse(localStorage.getItem("todo-list"))
  : {
      todos: [],
      completed: [],
    };

const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"> <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"/> </svg>`;
const editSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z"/></svg>`;
const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"> <path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/></svg>`;

const addTodoBtn = document.getElementById("add-btn");
const saveTodoBtn = document.getElementById("save-btn");
let currentEditIndex = null;

renderToList();

let todo = document.getElementById("todo-input");

function updateDataObject() {
  localStorage.setItem("todo-list", JSON.stringify(data));
}

function removeItem() {
  let list_item = this.parentNode.parentNode;
  let list_container = list_item.parentNode;
  let list_item_text = list_item.querySelector("span").innerText;

  const parent_id = list_container.id;

  if (parent_id === "display-list") {
    data.todos = data.todos.filter((todo) => todo !== list_item_text);
  } else if (parent_id === "completed-list") {
    data.completed = data.completed.filter((todo) => todo !== list_item_text);
  }

  updateDataObject();
  list_container.removeChild(list_item);
}

function checkCompleted() {
  const list_item = this.parentNode.parentNode;
  const list_container = list_item.parentNode;
  const parent_id = list_container.id;

  let list_item_text = list_item.querySelector("span").innerText;

  if (parent_id === "display-list") {
    data.todos = data.todos.filter((todo) => todo !== list_item_text);
    data.completed.push(list_item_text);
    updateDataObject();
    list_item.remove();
    addItemTodo(list_item_text, true);
  } else if (parent_id === "completed-list") {
    uncheckTodo.call(this);
  }
}

function uncheckTodo() {
  const list_item = this.parentNode.parentNode;
  let list_item_text = list_item.querySelector("span").innerText;

  data.completed = data.completed.filter((todo) => todo !== list_item_text);
  data.todos.push(list_item_text);

  updateDataObject();
  list_item.remove();
  addItemTodo(list_item_text, false);
}

const handleAddTodo = () => {
  if (todo.value) {
    if (currentEditIndex !== null) {
      data.todos[currentEditIndex] = todo.value;
      currentEditIndex = null;
    } else {
      data.todos.push(todo.value);
      addItemTodo(todo.value);
    }

    todo.value = "";
    updateDataObject();
    renderToList();
    saveTodoBtn.style.display = "none";
    addTodoBtn.style.display = "block";
  }
};

function renderToList() {
  document.getElementById("display-list").innerHTML = "";
  document.getElementById("completed-list").innerHTML = "";

  data.todos.forEach((todo) => addItemTodo(todo));
  data.completed.forEach((todo) => addItemTodo(todo, true));
}

function editTodo() {
  const listItem = this.parentNode.parentNode;
  const listItemText = listItem.querySelector("span").innerText;

  currentEditIndex = data.todos.indexOf(listItemText);
  todo.value = listItemText;

  saveTodoBtn.style.display = "block";
  addTodoBtn.style.display = "none";
}

saveTodoBtn.addEventListener("click", handleAddTodo);
addTodoBtn.addEventListener("click", handleAddTodo);

/**
 *
 * @param {string} text
 */
function addItemTodo(text, completed) {
  let list = completed
    ? document.getElementById("completed-list")
    : document.getElementById("display-list");

  let list_item = document.createElement("li");

  let todo_text = document.createElement("span");
  todo_text.innerText = text;
  todo_text.classList.add("todo-text");

  let text_and_completed = document.createElement("div");

  const completed_btn = document.createElement("button");
  completed_btn.innerHTML = checkSvg;
  completed_btn.classList.add("check");
  completed_btn.addEventListener("click", checkCompleted);

  text_and_completed.appendChild(completed_btn);
  text_and_completed.appendChild(todo_text);

  text_and_completed.classList.add("text_and_completed");

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const trash_btn = document.createElement("button");
  trash_btn.innerHTML = trashSvg;
  trash_btn.classList.add("remove");
  trash_btn.addEventListener("click", removeItem);

  const edit_btn = document.createElement("button");
  edit_btn.innerHTML = editSvg;
  edit_btn.classList.add("edit");
  edit_btn.addEventListener("click", editTodo);

  buttons.appendChild(trash_btn);
  buttons.appendChild(edit_btn);

  list_item.insertBefore(text_and_completed, list_item.childNodes[0]);
  list_item.appendChild(buttons);

  list.insertBefore(list_item, list.childNodes[0]);
}
