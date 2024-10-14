import * as logic from "./logic";

function createAgendaElement (agenda) {
  const agendaList = document.querySelector("#agenda-list");

  const listItem = document.createElement("li");
  listItem.classList.add("agenda-item");
  
  const elements = [];

  // Get agenda id and set data attribute
  const agendaId = agenda.getId();
  listItem.dataset.agendaId = agendaId;

  const heading = document.createElement("h3");
  heading.classList.add("agenda-name");
  const headingText = document.createTextNode(`${agenda.getName()}`);;
  heading.appendChild(headingText);
  elements.push(heading);

  const editButton = document.createElement("span");
  editButton.classList.add("agenda-edit-button");
  elements.push(editButton);

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("agenda-delete-button");
  elements.push(deleteButton);

  for (let element of elements) {
    listItem.appendChild(element);
  }

  agendaList.appendChild(listItem);
  
}

function createTaskElement (task) {

  // TODO: add id to data attribute
  const taskList = document.querySelector("#task-list");

  const listItem = document.createElement("li");
  listItem.classList.add("task-item");

  let elements = [];

  const priorityIndicator = document.createElement("span");
  const priority = task.getPriority();
  priorityIndicator.classList.add("task-priority", `${priority.toLowerCase()}`);
  const priorityIndicatorText = document.createTextNode(
    `${priority.slice(0,1).toUpperCase()}`
  );
  priorityIndicator.appendChild(priorityIndicatorText)
  elements.push(priorityIndicator);

  const checkContainer = document.createElement("span");
  checkContainer.classList.add("task-check-container");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-check");

  // check complete status
  if (task.getCompletionStatus()) {
    listItem.classList.add("completed");
    checkbox.checked = true;
  }

  checkContainer.appendChild(checkbox);
  elements.push(checkContainer);

  // Split into separate function?

  const title = document.createElement("span");
  title.classList.add("task-title");
  const titleText = document.createTextNode(`${task.getTitle()}`);
  title.appendChild(titleText);
  elements.push(title);

  const dueDate = document.createElement("span");
  dueDate.classList.add("task-due-date");
  const dueDateText = document.createTextNode(`${task.getDueDate()}`);
  dueDate.appendChild(dueDateText);
  elements.push(dueDate);

  const detailsButton = document.createElement("span");
  detailsButton.classList.add("task-details-button");
  const detailsButtonText = document.createTextNode("Details");
  detailsButton.appendChild(detailsButtonText);
  elements.push(detailsButton);

  const editButton = document.createElement("span");
  editButton.classList.add("task-edit-button");
  elements.push(editButton);

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("task-delete-button");
  elements.push(deleteButton);

  const containerDiv = document.createElement("div");

  for (let element of elements) {
    containerDiv.appendChild(element);
  }

  listItem.appendChild(containerDiv);

  taskList.appendChild(listItem);
}

// Switches to an agenda
function viewAgenda (agenda, firstLoad = false) {
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

function startAgendaEdit (agenda) {
  const sidebarElement = document.querySelector(".current-agenda");
  // change sidebar icons
  const firstIcon = sidebarElement.querySelector(".agenda-edit-button");
  const secondIcon = sidebarElement.querySelector(".agenda-delete-button");

  firstIcon.classList.remove("agenda-edit-button");
  firstIcon.classList.add("agenda-edit-save-button");

  secondIcon.classList.remove("agenda-delete-button");
  secondIcon.classList.add("agenda-edit-cancel-button");

  // make agenda properties editable
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


  const agendaHeader = document.querySelector("#agenda-header");
  const heading = agendaHeader.querySelector("h1");
  const description = agendaHeader.querySelector("#agenda-description");

  heading.setAttribute("contenteditable", false);
  heading.classList.remove("agenda-child-editing");
  description.setAttribute("contenteditable", false);
  description.classList.remove("agenda-child-editing");

  if (saving) {
    // need to rethink some of these logic functions, using an agenda function
    // for the purpose of using a logic function to use more agenda functions
    // seems silly. Logic should really be the middle point, ui probably shoudln't
    // be using agenda or task functions at all. 

    // Just need to pass the id throughout ui and let the logic functions do the work
    logic.editAgenda(agenda.getId(), heading.textContent, description.textContent)
    const sidebarAgenda = document.querySelector(".current-agenda");
    const agendaHeading = sidebarAgenda.querySelector("h3");
    agendaHeading.textContent = heading.textContent;
  } else {
    heading.textContent = agenda.getName();
    description.textContent = agenda.getDescription();
  }
}

// TODO: Split loadPage out
function loadPage () {
  // Load agendas

  const agendas = logic.getAgendas();

  for (let agenda of agendas) {
    createAgendaElement(agenda);
  }

  // Event listener to manipulate agendas (view, edit, delete)
  const agendaList = document.querySelector("#agenda-list");
  agendaList.addEventListener("click", (e) => {
    // might not need agenda in some of these functions !!!
    const classes = {
      "agenda-item":() => {
        const agenda = logic.getAgendaFromId(e.target.dataset.agendaId);
        viewAgenda(agenda);
      },
      "agenda-name":() => {
        const agenda = logic.getAgendaFromId(e.target.parentElement.dataset.agendaId);
        viewAgenda(agenda);
      },
      "agenda-edit-button":() => {
        const agenda = logic.getAgendaFromId(e.target.parentElement.dataset.agendaId);
        viewAgenda(agenda);
        startAgendaEdit(agenda);
      },
      "agenda-delete-button":() => {
        const agenda = logic.getAgendaFromId(e.target.parentElement.dataset.agendaId);
        viewAgenda(agenda);
        // show confirmation modal
        // delete if accepted
      },
      "agenda-edit-save-button":() => {
        const agenda = logic.getAgendaFromId(e.target.parentElement.dataset.agendaId);
        finishAgendaEdit(agenda, true);
      },
      "agenda-edit-cancel-button":() => {
        const agenda = logic.getAgendaFromId(e.target.parentElement.dataset.agendaId);
        finishAgendaEdit(agenda);
      }
    };

    for (let specificClass in classes) {
      if (e.target.classList.contains(specificClass)) {
        classes[specificClass]();
        break;
      }
    }
  })

  // Load an agenda (info and tasks)
  // May need to eventually change this to current agenda when storing the info,
  // however viewAgenda will need changed as it doesn't accept current agenda
  viewAgenda(logic.getAgendas()[0], true);

  // Event Listeners

  const addAgendaButton = document.querySelector("#add-agenda");

  addAgendaButton.addEventListener("click", () => {
    // create empty agenda and switch to it

    const newAgenda = logic.createNewAgenda();

    createAgendaElement(newAgenda);
    
    viewAgenda(newAgenda);
  })

  // Add tasks

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

export { loadPage }