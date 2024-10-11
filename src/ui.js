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
  const headingText = document.createTextNode(`${agenda.getName()}`);
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

  elements = [];

  const priorityIndicator = document.createElement("span");
  const priority = task.getPriority();
  priorityIndicator.classList.add("task-priority", `${priority}`);
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

  const title = document.createElememt("span");
  title.classList.add("task-title");
  const titleText = document.createTextNode(`${task.getTitle()}`);
  title.appendChild(titleText);
  elements.push(title);

  const dueDate = document.createElememt("span");
  dueDate.classList.add("task-due-date");
  const dueDateText = document.createTextNode(`${task.getDueDate()}`);
  dueDate.appendChild(dueDateText);
  elements.push(dueDate);

  const detailsButton = document.createElememt("span");
  detailsButton.classList.add("task-details-button");
  const detailsButtonText = document.createTextNode("details");
  detailsButton.appendChild(detailsButtonText);
  elements.push(detailsButton);

  const editButton = document.createElememt("span");
  editButton.classList.add("task-edit-button");
  elements.push(editButton);

  const deleteButton = document.createElememt("span");
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

function loadPage () {
  // Load agendas

  const agendas = logic.getAgendas();

  for (let agenda of agendas) {
    createAgendaElement(agenda);
  }

  // Event listener to manipulate agendas (view, edit, delete)
  const agendaList = document.querySelector("#agenda-list");
  agendaList.addEventListener("click", (e) => {
    if (e.target.classList.contains("agenda-item")) {
      const agenda = logic.getAgendaFromId(e.target.dataset.agendaId);
      console.log(e.target.dataset.agendaId);
      viewAgenda(agenda);
    } else if (e.target.nodeName === "H3") {
      const agenda = logic.getAgendaFromId(e.target.parentElement.dataset.agendaId);
      viewAgenda(agenda);
    } else if (e.target.classList.contains("agenda-edit-button")) {
      // view and edit agenda
    } else if (e.target.classList.contains("agenda-delete-button")) {
      // show confirmation modal
      // delete if accepted
    }
  })

  // Load an agenda (info and tasks)
  // May need to eventually change this to current agenda when storing the info,
  // however viewAgenda will need changed as it doesn't accept current agenda
  viewAgenda(logic.getAgendas()[0], true);

  // Event Listeners for task and agenda creation buttons

  const addAgendaButton = document.querySelector("#add-agenda");

  addAgendaButton.addEventListener("click", () => {
    // create empty agenda and switch to it

    const newAgenda = logic.createNewAgenda();

    createAgendaElement(newAgenda);
    
    viewAgenda(newAgenda);
  })

  const addTaskButton = document.querySelector("#add-task");

  addTaskButton.addEventListener("click", () => {
    // TODO: show modal to add task details
  })
}

export { loadPage }