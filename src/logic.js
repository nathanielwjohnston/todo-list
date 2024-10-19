import { createTask, priorities } from "./tasks";
import { createAgenda } from "./agendas";

/* The display controller will be using these functions for information.
   Therefore, the input will be mostly id-based */

const defaultAgenda = createAgenda();

const agendas = [defaultAgenda];

let currentAgenda = agendas[0];

function getAgendas () {
  return agendas;
} 

function createNewAgenda (name, description=null) {
  // Add 9 agenda limit

  const agenda = createAgenda(name, description);

  agendas.push(agenda);

  return agenda;
}

function removeAgenda (agendaId) {
  // get specified agenda
  const agenda = getAgendaFromId(agendaId);
  // remove from agendas array
  agendas.splice(agendas.indexOf(agenda), 1);
}

function getCurrentAgenda () {
  // check current agenda still exists
  if (agendas.includes(currentAgenda)) {
    return currentAgenda;
  } else {
    return null;
  }
}

function updateCurrentAgenda (newCurrentAgenda) {
  currentAgenda = newCurrentAgenda;
}

function getAgendaFromId (agendaId) {
  const id = parseInt(agendaId);
  return agendas.find((agenda) => agenda.getId() === id);
}

// to edit the base parameters of an agenda i.e. name and description
function editAgenda (agendaId, name, description) {
  const agenda = getAgendaFromId(agendaId);

  // submitting a form and therefore all values will be submitted even if not new
  agenda.updateName(name);
  agenda.updateDescription(description);
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
}

function removeTaskFromAgenda (agendaId, taskId) {
  const agenda = getAgendaFromId(agendaId);
  
  const task = getTaskFromId(agendaId, taskId)

  agenda.removeTask(task);
}

export { getAgendas, createNewAgenda, removeAgenda, getCurrentAgenda,
  updateCurrentAgenda, getAgendaFromId, editAgenda, getPreviousAgenda, 
  createNewTask, getTaskFromId, editTask, removeTaskFromAgenda
 }