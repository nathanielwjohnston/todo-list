import * as logic from "./logic";

function createAgendaElement (agenda) {
  const agendaList = document.querySelector("#agenda-list");

  const listItem = document.createElement("li");
  listItem.classList.add("agenda-item");

  // Get agenda id and set data attribute
  const agendaId = agenda.getId();
  listItem.dataset.agendaId = agendaId;

  function addNewElement (className, tag, text=undefined) {
    const element = document.createElement(tag);
    element.classList.add(className);
    if (text) {
      const node = document.createTextNode(text);
      element.appendChild(node);
    }
    listItem.appendChild(element);
  }

  addNewElement("agenda-name", "h3", `${agenda.getName()}`);
  addNewElement("agenda-edit-button", "span");
  addNewElement("agenda-delete-button", "span");

  agendaList.appendChild(listItem);
}

function createTaskElement (task) {
  const taskList = document.querySelector("#task-list");

  const listItem = document.createElement("li");
  listItem.classList.add("task-item");

  const containerDiv = document.createElement("div");

  const taskId = task.getId();
  listItem.dataset.taskId = taskId;

  // Add task elements

  function addNewElement (classNames, tag, parentElement, text=undefined) {
    const element = document.createElement(tag);
    element.classList.add(...classNames);
    if (text) {
      const node = document.createTextNode(text);
      element.appendChild(node);
    }
    parentElement.appendChild(element);

    return element;
  }
  
  const priority = task.getPriority();
  addNewElement(["task-priority", `${priority.toLowerCase()}`],
    "span", containerDiv, `${priority.slice(0,1).toUpperCase()}`);


  const checkContainer = addNewElement(["task-check-container"], "span", containerDiv);

  const checkbox = addNewElement(["task-check"], "input", checkContainer);
  checkbox.type = "checkbox";
  // check complete status
  if (task.getCompletionStatus()) {
    listItem.classList.add("completed");
    checkbox.checked = true;
  }

  addNewElement(["task-title"], "span", containerDiv, `${task.getTitle()}`);
  addNewElement(["task-due-date"], "span", containerDiv, `${task.getDueDate()}`);
  addNewElement(["task-details-button"], "span", containerDiv, "Details");
  addNewElement(["task-edit-button"], "span", containerDiv);
  addNewElement(["task-delete-button"], "span", containerDiv);

  listItem.appendChild(containerDiv);

  taskList.appendChild(listItem);
}

// Switches to an agenda
function viewAgenda (agenda, firstLoad=false) {
  // Check agenda is not already showing
  if (agenda === logic.getCurrentAgenda() && firstLoad === false) {
    return;
  }

  const header = document.querySelector("#agenda-header");
  // Change header title
  const headerTitle = header.querySelector("h1");
  headerTitle.textContent = agenda.getName();
  // Change description
  const headerDescription = header.querySelector("#agenda-description");
  headerDescription.textContent = agenda.getDescription();

  // Change tasks

  const taskList = document.querySelector("#task-list");
  // Clear tasks
  taskList.replaceChildren();
  const tasks = agenda.getTasks();
  for (let task of tasks) {
    // Creates task and appends it to task list
    createTaskElement(task);
  }

  // Update current agenda

  // Deselect agenda in sidebar
  const currentAgenda = logic.getCurrentAgenda();
  const currentAgendaElement = document
    .querySelector(`[data-agenda-id="${currentAgenda.getId()}"]`);
  currentAgendaElement.classList.remove("current-agenda");

  logic.updateCurrentAgenda(agenda);
  // Select agenda in sidebar (using CSS)
  const newCurrentAgendaElement = document
    .querySelector(`[data-agenda-id="${agenda.getId()}"]`);
  newCurrentAgendaElement.classList.add("current-agenda");
}

function startAgendaEdit () {
  const sidebarElement = document.querySelector(".current-agenda");

  // Change sidebar icons

  const firstIcon = sidebarElement.querySelector(".agenda-edit-button");
  const secondIcon = sidebarElement.querySelector(".agenda-delete-button");

  firstIcon.classList.remove("agenda-edit-button");
  firstIcon.classList.add("agenda-edit-save-button");

  secondIcon.classList.remove("agenda-delete-button");
  secondIcon.classList.add("agenda-edit-cancel-button");

  // Make agenda properties editable

  const agendaHeader = document.querySelector("#agenda-header");
  const heading = agendaHeader.querySelector("h1");
  const description = agendaHeader.querySelector("#agenda-description");

  heading.setAttribute("contenteditable", true);
  heading.classList.add("agenda-child-editing");
  heading.focus();
  description.setAttribute("contenteditable", true);
  description.classList.add("agenda-child-editing");

  function agendaPropertyTyping(e, element, maxChars) {
    const key = e.key;

    if (
      element.textContent.length === maxChars &&
      key !== "Backspace"
    ) {
      e.preventDefault();
      element.classList.add("max-characters");
    }

    if (
      element.textContent.length === maxChars &&
      key === "Backspace" &&
      element.classList.contains("max-characters")
    ) {
      element.classList.remove("max-characters");
    } else if (key === "Enter") {
      e.preventDefault();
    }
  }

  heading.addEventListener("keydown", e => agendaPropertyTyping(e, heading, 14))
  description.addEventListener("keydown", e => agendaPropertyTyping(e, description, 50))
}

function finishAgendaEdit (agenda, saving=false) {
  const sidebarElement = document.querySelector(".current-agenda");

  // change sidebar icons


  const firstIcon = sidebarElement.querySelector(".agenda-edit-save-button");
  const secondIcon = sidebarElement.querySelector(".agenda-edit-cancel-button");

  firstIcon.classList.remove("agenda-edit-save-button");
  firstIcon.classList.add("agenda-edit-button");

  secondIcon.classList.remove("agenda-edit-cancel-button");
  secondIcon.classList.add("agenda-delete-button");

  // Stop agenda property editing

  const agendaHeader = document.querySelector("#agenda-header");
  const heading = agendaHeader.querySelector("h1");
  const description = agendaHeader.querySelector("#agenda-description");

  heading.setAttribute("contenteditable", false);
  heading.classList.remove("agenda-child-editing");
  description.setAttribute("contenteditable", false);
  description.classList.remove("agenda-child-editing");

  if (saving) {
    logic.editAgenda(agenda.getId(), heading.textContent, description.textContent)
    const sidebarAgenda = document.querySelector(".current-agenda");
    const agendaHeading = sidebarAgenda.querySelector("h3");
    agendaHeading.textContent = heading.textContent;
  } else {
    heading.textContent = agenda.getName();
    description.textContent = agenda.getDescription();
  }
}

function loadPage () {
  loadAgendas();

  loadEventListeners();

  function loadAgendas () {
    const agendas = logic.getAgendas();
  
    for (let agenda of agendas) {
      createAgendaElement(agenda);
    }
  
    // Load an agenda (info and tasks)
    // TODO: May need to eventually change this to current agenda when storing info
    viewAgenda(logic.getAgendas()[0], true);
  }

  function loadEventListeners () {  
    // Event listener to manipulate agendas (view, edit, delete)
    const agendaList = document.querySelector("#agenda-list");
    agendaList.addEventListener("click", (e) => {
      const classes = {
        "agenda-item":agenda => {
          viewAgenda(agenda);
        },
        "agenda-name":agenda => {
          viewAgenda(agenda);
        },
        "agenda-edit-button":agenda => {
          viewAgenda(agenda);
          startAgendaEdit();
        },
        "agenda-delete-button":agenda => {
          viewAgenda(agenda);
          // show confirmation modal
          // delete if accepted
        },
        "agenda-edit-save-button":agenda => {
          finishAgendaEdit(agenda, true);
        },
        "agenda-edit-cancel-button":agenda => {
          finishAgendaEdit(agenda);
        }
      };
  
      const targetClasses = e.target.classList;
      targetClasses.forEach(targetClass => {
        if (targetClass in classes) {
          if (targetClass === "agenda-item") {
            classes[targetClass](logic.getAgendaFromId(e.target.dataset.agendaId));
          } else {
            classes[targetClass](logic.getAgendaFromId(e.target.parentElement.dataset.agendaId));
          }
          return;
        }
      })
    })
  
    const addAgendaButton = document.querySelector("#add-agenda");
  
    addAgendaButton.addEventListener("click", () => {
      // create empty agenda and switch to it
  
      const newAgenda = logic.createNewAgenda();
  
      createAgendaElement(newAgenda);
      
      viewAgenda(newAgenda);
    })
  
    const dialog = document.querySelector("#createTaskDialog");
  
    // TODO: set restrictions on the date input i.e. not before the current date etc.
    // probably using that npm libary as shown on the project page
    const dateInput = dialog.querySelector("#createTaskDueDate");
  
  
    const addTaskButton = document.querySelector("#add-task");
  
    addTaskButton.addEventListener("click", () => {
      dialog.showModal();
    })
  
    dialog.addEventListener("click", (e) => {
      if (e.target === document.querySelector("#submitTaskForm")) {
        const title = document.querySelector("#createTaskName").value;
        let description = document.querySelector("#createTaskDescription").value;
        description = description === "" ? null : description;
        let dueDate = document.querySelector("#createTaskDueDate").value;
        dueDate = dueDate === "" ? null : dueDate;
        const priority = document.querySelector("#createTaskPriority").value;
  
        let task = logic.createNewTask(title, logic.getCurrentAgenda().getId(),
          {priority, description, dueDate});
  
        createTaskElement(task);
  
        dialog.close();
      } else if (e.target === document.querySelector("#cancelTaskForm")) {
        dialog.close();
      } else if (e.target === document.querySelector("#clearTaskForm")) {
        const form = document.querySelector("#createTaskForm");
        form.reset();
      }
    })
  }
}

export { loadPage }