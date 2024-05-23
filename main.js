const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editID = "";

const setBackToDefault = () => {
  submitBtn.textContent = "Ekle";
  editFlag = false;
  grocery.value = "";
  editID = "";
};
// Create Alert
const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};
// Delete element
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  displayAlert("Öğe Kaldırıldı", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);

};
// Edit element
const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerText;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Düzenle";
};
// Add element
const addItem = (e) => {
  e.preventDefault();
  const value = grocery.value;
  // Unique id
  const id = new Date().getTime().toString();
 // Not in edit mode
  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
    displayAlert("Başarıyla Eklenildi", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } 
  // Edit mode
  else if (value !== "" && editFlag) {
    editElement.innerText = value;
    displayAlert("Başarıyla Güncellendi", "warning");
    editLocalStorage(editID, value);
    setBackToDefault();
  }
};
const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }
  container.classList.remove("show-container");
  displayAlert("Liste Silindi.", "danger");
  setBackToDefault();
  removeListFromLocalStorage();
};
// List element
const createListItem = (id, value) => {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element);
  container.classList.add("show-container");
};
// Loading
const setupItems = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};
// Local storage - Add element
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
};
// Local storage - List element
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
// Local storage - Delete element
const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
  if(items.length === 0){
    container.classList.remove("show-container");
  }
};
// Local storage - Edit element
const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};
// Local storage - Delete - List element
const removeListFromLocalStorage = () => {
    localStorage.setItem("list", []);
  };

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
