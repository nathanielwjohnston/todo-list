import * as logic from "./logic";
import { format } from "date-fns/format";

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

function deleteAgendaElement (agendaId) {
  const sidebarElement = document.querySelector(`[data-agenda-id="${agendaId}"]`);
  sidebarElement.remove();
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
  // Check complete status
  if (task.getCompletionStatus()) {
    listItem.classList.add("completed");
    checkbox.checked = true;
  }

  checkbox.addEventListener("click", e => {
    if (task.getCompletionStatus()) {
      e.preventDefault();
    } else {
      task.completeTask();
      listItem.classList.add("completed");
    }
  })

  addNewElement(["task-title"], "span", containerDiv, `${task.getTitle()}`);
  addNewElement(["task-due-date"], "span", containerDiv, `${task.getDueDate()}`);
  const detailsButton = addNewElement(["task-details-button"], "span", containerDiv, "Details");
  const editButton = addNewElement(["task-edit-button"], "span", containerDiv);
  const deleteButton = addNewElement(["task-delete-button"], "span", containerDiv);

  detailsButton.addEventListener("click", () => {
    const dialog = document.querySelector("#task-details-dialog");
    dialog.showModal()

    const titleElement = dialog.querySelector("#task-details-title");
    const descriptionElement = dialog.querySelector("#task-details-description");
    const priorityElement = dialog.querySelector("#task-details-priority");
    const dateElement = dialog.querySelector("#task-details-due-date");

    const taskPriority = task.getPriority();

    priorityElement.classList.remove("low", "important", "urgent");
    priorityElement.classList.add(`${taskPriority.toLowerCase()}`);

    titleElement.textContent = task.getTitle();
    descriptionElement.textContent = task.getDescription();
    priorityElement.textContent = `Priority: ${taskPriority}`;
    dateElement.textContent = task.getDueDate();
    const elements = [descriptionElement, dateElement];

    for (let element of elements) {
      if (!element.classList.contains("not-set") && element.textContent === "") {
        element.classList.add("not-set");
      } else if (element.classList.contains("not-set") && element.textContent !== "") {
        element.classList.remove("not-set");
      }
    }

    // Set here so the loop can accurately gauge if there is a value set
    dateElement.textContent = "Due Date: " + dateElement.textContent;

    const closeButton = dialog.querySelector("#close-details-dialog");
    closeButton.addEventListener("click", () => {
      dialog.close();
    })
  })

  editButton.addEventListener("click", () => {
    if (task.getCompletionStatus()) {
      return;
    }
    document.querySelector("#form-type-input").value = "edit-task";
    document.querySelector("#form-task-id").value = taskId;
    document.querySelector("#task-name-input").value = task.getTitle();
    document.querySelector("#task-description-input").value = task.getDescription();
    document.querySelector("#task-due-date-input").value = task.getDueDateForInput();
    document.querySelector("#task-priority-input").value = task.getPriority();

    const dialog = document.querySelector("#task-dialog");
    dialog.showModal();
  })

  deleteButton.addEventListener("click", () => {
    const dialog = document.querySelector("#delete-confirmation-dialog");

    const question = dialog.querySelector("#delete-confirmation-question");
    question.textContent = "Are you sure you want to delete this task?";
    dialog.showModal();
    dialog.addEventListener("click", function taskDeletion (e) {
      if (e.target === document.querySelector("#confirm-delete")) {
        logic.removeTaskFromAgenda(logic.getCurrentAgenda().getId(), taskId);
        dialog.close();
        deleteTaskElement(taskId);
        this.removeEventListener("click", taskDeletion);
      } else if (e.target === document.querySelector("#prevent-delete")) {
        dialog.close();
        this.removeEventListener("click", taskDeletion);
      }
    })
  })

  listItem.appendChild(containerDiv);

  taskList.appendChild(listItem);
}

function updateTaskElement (agendaId, taskId) {
  const task =  logic.getTaskFromId(agendaId, taskId);

  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  
  const title = taskElement.querySelector(".task-title");
  const dueDate = taskElement.querySelector(".task-due-date");
  const priority = taskElement.querySelector(".task-priority");

  title.textContent = task.getTitle();
  dueDate.textContent = task.getDueDate();

  const taskPriority = task.getPriority();
  priority.textContent = taskPriority.slice(0,1).toUpperCase();
  priority.classList.remove("low", "important", "urgent");
  priority.classList.add(`${taskPriority.toLowerCase()}`);
}

function deleteTaskElement(taskId) {
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  taskElement.remove();
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
  if (currentAgenda) {
    const currentAgendaElement = document
      .querySelector(`[data-agenda-id="${currentAgenda.getId()}"]`);
    currentAgendaElement.classList.remove("current-agenda");
  }

  logic.updateCurrentAgenda(agenda);
  // Select agenda in sidebar (using CSS)
  const newCurrentAgendaElement = document
    .querySelector(`[data-agenda-id="${agenda.getId()}"]`);
  newCurrentAgendaElement.classList.add("current-agenda");
}

const agendaEditor = (function () {
  const agendaHeader = document.querySelector("#agenda-header");
  const heading = agendaHeader.querySelector("h1");
  const description = agendaHeader.querySelector("#agenda-description");

  function toggleAgendaEdit (heading, description) {
    const sidebarElement = document.querySelector(".current-agenda");
  
    // Change sidebar icons
  
    const firstIcon = sidebarElement.querySelector(".agenda-edit-button") ||
      sidebarElement.querySelector(".agenda-edit-save-button");
    const secondIcon = sidebarElement.querySelector(".agenda-delete-button") ||
      sidebarElement.querySelector(".agenda-edit-cancel-button");
  
    firstIcon.classList.toggle("agenda-edit-button");
    firstIcon.classList.toggle("agenda-edit-save-button");
  
    secondIcon.classList.toggle("agenda-delete-button");
    secondIcon.classList.toggle("agenda-edit-cancel-button");
  
    // Make agenda properties editable
  
    function checkAndSetContentEditable (element) {
      if (element.getAttribute("contenteditable") === "true") {
        element.setAttribute("contenteditable", false);
      } else {
        element.setAttribute("contenteditable", true);
      }
    }
  
    checkAndSetContentEditable(heading);
    heading.classList.toggle("agenda-child-editing");
    if (heading.classList.contains("agenda-child-editing")) {
      heading.focus();
    }
  
    checkAndSetContentEditable(description);
    description.classList.toggle("agenda-child-editing");
  }

  function agendaPropertyTyping(e, element, maxChars) {
    const key = e.key;
    const allowedKeys = [
      "Shift", "End", "Home", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"
    ]

    // As it is being edited, the elements will always technically be selected,
    // but will show up as an empty string, which will be checked

    // If no text is highlighted, the string will be empty and therefore not
    // selected when put against my criteria rather than getSelection()
    const selected = window.getSelection().toString() !== "";

    if (
      element.textContent.length === maxChars &&
       key !== "Backspace" && !allowedKeys.includes(key) && !selected
    ) {
      e.preventDefault();
      element.classList.add("max-characters");
    }

    if (
      element.textContent.length === maxChars &&
      ( key === "Backspace" || selected) &&
      element.classList.contains("max-characters")
    ) {
      element.classList.remove("max-characters");
    } else if (key === "Enter") {
      e.preventDefault();
    }
  }

  const headingListener = function (e) {
    agendaPropertyTyping(e, heading, logic.getMaxCharacters.agendaHeader());
  }

  const descriptionListener = function (e) {
    agendaPropertyTyping(e, description, logic.getMaxCharacters.agendaDescription());
  }

  function editAgenda (agenda) {
    toggleAgendaEdit(heading, description);

    // Prevent other actions
    const newAgendaButton = document.querySelector("#add-agenda");
    newAgendaButton.disabled = true;

    const newTaskButton = document.querySelector("#add-task");
    newTaskButton.disabled = true;

    const sidebarAgendas = document.querySelectorAll(".agenda-item:not(.current-agenda)");
    sidebarAgendas.forEach(sidebarAgenda => {
      sidebarAgenda.classList.add("disabled-agenda-item");
    })
  
    heading.addEventListener("keydown", headingListener);
    description.addEventListener("keydown", descriptionListener);
  }
  
  function finishAgendaEdit (agenda, saving=false) {
    toggleAgendaEdit(heading, description);

    // Allow other actions
    const newAgendaButton = document.querySelector("#add-agenda");
    newAgendaButton.disabled = false;

    const newTaskButton = document.querySelector("#add-task");
    newTaskButton.disabled = false;

    const sidebarAgendas = document.querySelectorAll(".agenda-item:not(.current-agenda)");
    sidebarAgendas.forEach(sidebarAgenda => {
      sidebarAgenda.classList.remove("disabled-agenda-item");
    })
  
    heading.removeEventListener("keydown", headingListener);
    description.removeEventListener("keydown", descriptionListener);
  
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

  return {editAgenda, finishAgendaEdit};
})();

function loadBlankAgenda () {
  const agendaHeading = document.querySelector("#agenda-header");
  const heading = agendaHeading.querySelector("h1");
  heading.replaceChildren();

  const agendaDescription = document.querySelector("#agenda-description");
  agendaDescription.replaceChildren();

  const prioritiesKey = document.querySelector("#priorities-key");
  prioritiesKey.style.display = "none";

  const newTaskButton = document.querySelector("#add-task");
  newTaskButton.disabled = true;

  const newAgendaButton = document.querySelector("#add-agenda");
  newAgendaButton.addEventListener("click", function showElements () {
    prioritiesKey.style.display = "block";
    newTaskButton.disabled = false;
    this.removeEventListener("click", showElements);
  });
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
    viewAgenda(logic.getCurrentAgenda(), true);
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
          agendaEditor.editAgenda(agenda);
        },
        "agenda-delete-button":agenda => {
          viewAgenda(agenda);
          // show confirmation modal
          const dialog = document.querySelector("#delete-confirmation-dialog");
          const question = dialog.querySelector("#delete-confirmation-question");
          question.textContent = "Are you sure you want to delete this agenda?";
          dialog.showModal();
          dialog.addEventListener("click", function agendaDeletion (e) {
            if (e.target === document.querySelector("#confirm-delete")) {
              const previousAgenda = logic.getPreviousAgenda(agenda);
              const nextAgenda = logic.getNextAgenda(agenda);
              const agendaId = agenda.getId();
              // Delete if accepted
              logic.removeAgenda(agendaId);

              if (previousAgenda) {
                viewAgenda(previousAgenda);
              } else if (nextAgenda) {
                viewAgenda(nextAgenda);
              } else {
                // No Agenda Page
                loadBlankAgenda();
              }
              dialog.close();
              deleteAgendaElement(agendaId);
              this.removeEventListener("click", agendaDeletion);
            } else if (e.target === document.querySelector("#prevent-delete")) {
              dialog.close();
              this.removeEventListener("click", agendaDeletion);
            }
          })
        },
        "agenda-edit-save-button":agenda => {
          agendaEditor.finishAgendaEdit(agenda, true);
        },
        "agenda-edit-cancel-button":agenda => {
          agendaEditor.finishAgendaEdit(agenda);
        }
      };
  
      const targetClasses = e.target.classList;

      // Prevents disabled agenda elements from being clicked when editing another agenda
      if (targetClasses.contains("disabled-agenda-item") ||
          e.target.parentElement.classList.contains("disabled-agenda-item")) {
            return;
      }

      targetClasses.forEach(targetClass => {
        if (targetClass in classes) {
          if (targetClass === "agenda-item" ) {
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
      // Create empty agenda and switch to it
  
      const newAgenda = logic.createNewAgenda();
  
      createAgendaElement(newAgenda);
      
      viewAgenda(newAgenda);
    })
  
    const dialog = document.querySelector("#task-dialog");
  
    // Set restrictions to title character length
    const title = dialog.querySelector("#task-name-input");
    title.setAttribute("maxlength", logic.getMaxCharacters.taskTitle());

    title.addEventListener("keydown", e => {
      const maxChars = logic.getMaxCharacters.taskTitle();
      if (title.value.length === maxChars && !title.classList.contains("max-characters")) {
        title.classList.add("max-characters");
      }
      else if (e.key === "Backspace" && title.classList.contains("max-characters")) {
        title.classList.remove("max-characters");
      }
    })

    // Set restrictions on the date input
    const dateInput = dialog.querySelector("#task-due-date-input");
    const currentDate = format(new Date(), "yyyy-MM-dd");
    dateInput.setAttribute("min", currentDate);
    
    const addTaskButton = document.querySelector("#add-task");
  
    addTaskButton.addEventListener("click", () => {
      dialog.showModal();
      document.querySelector("#form-type-input").value = "new-task";
    })

    dialog.addEventListener("submit", e => {
      const form = document.querySelector("#task-form");
      e.preventDefault();
      const title = document.querySelector("#task-name-input").value;
      let description = document.querySelector("#task-description-input").value;
      description = description === "" ? null : description;
      let dueDate = document.querySelector("#task-due-date-input").value;
      dueDate = dueDate === "" ? null : dueDate;
      const priority = document.querySelector("#task-priority-input").value;

      let formType = document.querySelector("#form-type-input").value;

      if (formType === "new-task") {
        let task = logic.createNewTask(title, logic.getCurrentAgenda().getId(),
        {priority, description, dueDate});

        createTaskElement(task);
      } else if (formType === "edit-task") {
        const agendaId = logic.getCurrentAgenda().getId(); 
        const taskId = parseInt(document.querySelector("#form-task-id").value);
        logic.editTask(agendaId, taskId, title, description, dueDate, priority);
        updateTaskElement(agendaId, taskId);
      }
      
      dialog.close(); 
      form.reset();
    })
  
    dialog.addEventListener("click", e => {
      const form = document.querySelector("#task-form");
      if (e.target === document.querySelector("#cancel-task-form")) {
        dialog.close();
        form.reset();
      } else if (e.target === document.querySelector("#clear-task-form")) {
        form.reset();
      }
    })
  }
}

export { loadPage, deleteTaskElement }