import { createTask, priorities } from "./tasks";
import { createAgenda } from "./agendas";
import { deleteTaskElement } from "./ui";
import * as storage from "./storage";

const agendas = [];

let currentAgenda;

function load () {
  // Loads agendas and tasks, pushing them into the agendas array above
  storage.loadStorage();

  // Check if there any agendas have been loaded from storage
  if (agendas.length === 0) {
    agendas.push(createAgenda());
  }

  // Use the last current agenda before page reload or the default agenda
  currentAgenda = getAgendaFromId(storage.getSavedCurrentAgendaId()) || agendas[0];
}

function getAgendas () {
  return agendas;
} 

function createNewAgenda (name, description=null) {
  const agenda = createAgenda(name, description);

  agendas.push(agenda);

  return agenda;
}

function removeAgenda (agendaId) {
  // Get specified agenda
  const agenda = getAgendaFromId(agendaId);

  const tasks = agenda.getTasks();
  for (let task of tasks) {
    agenda.removeTask(task);
    deleteTaskElement(task.getId());
  }

  // Remove from agendas array
  agendas.splice(agendas.indexOf(agenda), 1);

  // Remove from storage
  storage.removeAgenda(agendaId);
}

function getCurrentAgenda () {
  // Check current agenda still exists
  if (agendas.includes(currentAgenda)) {
    return currentAgenda;
  } else {
    return null;
  }
}

function updateCurrentAgenda (newCurrentAgenda) {
  currentAgenda = newCurrentAgenda;

  storage.saveCurrentAgenda(currentAgenda.getId());
}

function getAgendaFromId (agendaId) {
  const id = parseInt(agendaId);
  return agendas.find((agenda) => agenda.getId() === id);
}

// To edit the base parameters of an agenda i.e. name and description
function editAgenda (agendaId, name, description) {
  const agenda = getAgendaFromId(agendaId);

  // Submitting a form and therefore all values will be submitted even if not new
  agenda.updateName(name);
  agenda.updateDescription(description);

  storage.editAgenda(agendaId, name, description);
}

function getPreviousAgenda (agenda) {  
  const agendaIndex = agendas.indexOf(agenda);
  const previousIndex = agendaIndex - 1;
  if (previousIndex < 0) {
    // No more agendas
    return null;
  } else {
    return agendas[previousIndex];
  }
}

function createNewTask (title, agendaId, {description=null, dueDate=null,
  priority=priorities.lowPriority}) {

    const task = createTask({title, description, dueDate,
      priority});
    
    const agenda = getAgendaFromId(agendaId);
    agenda.addTask(task);
    
  return task;
}

function getTaskFromId (agendaId, taskId) {
  const agenda = getAgendaFromId(agendaId);
  return agenda.getTasks().find((task) => task.getId() === taskId);
}

function editTask (agendaId, taskId, title, description, dueDate,
  priority) {
  
    const task = getTaskFromId(agendaId, taskId);

    task.updateTitle(title);
    task.updateDescription(description);
    task.updateDueDate(dueDate);
    task.updatePriority(priority);

    storage.editTask(taskId, title, description, dueDate, priority);
}

function removeTaskFromAgenda (agendaId, taskId) {
  const agenda = getAgendaFromId(agendaId);
  
  const task = getTaskFromId(agendaId, taskId)

  agenda.removeTask(task);
}

const getMaxCharacters = (function () {
  function agendaHeader () {
    return 14;
  }

  function agendaDescription () {
    return 50;
  }

  function taskTitle () {
    return 35;
  }

  return { agendaHeader, agendaDescription, taskTitle }
})();

export { load, getAgendas, createNewAgenda, removeAgenda, getCurrentAgenda,
  updateCurrentAgenda, getAgendaFromId, editAgenda, getPreviousAgenda, 
  createNewTask, getTaskFromId, editTask, removeTaskFromAgenda,
  getMaxCharacters
 }