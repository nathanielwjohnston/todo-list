import * as logic from "./logic";
import { format } from "date-fns/format";


export function saveAgenda (id, name, description) {
  let agendas;

  if (localStorage.getItem("agendas")) {
    agendas = JSON.parse(localStorage.getItem("agendas"));
  } else {
    agendas = [];
  }

  agendas.push({id, name, description, taskIds: []});

  localStorage.setItem("agendas", JSON.stringify(agendas));
}

export function removeAgenda (id) {
  const agendas = JSON.parse(localStorage.getItem("agendas"));

  const updatedAgendas = agendas.filter(agenda => agenda.id !== id);

  localStorage.setItem("agendas", JSON.stringify(updatedAgendas));
}

export function saveTask (id, title, description, dueDate, priority,
  completionStatus) {
  let tasks;

  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  } else {
    tasks = [];
  }

  tasks.push({id, title, description, dueDate, priority, completionStatus});

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function saveTaskToAgenda (taskId, agendaId) {
  const agendas = JSON.parse(localStorage.getItem("agendas"));

  const agenda = agendas.find(agenda => agenda.id === agendaId);

  const updatedAgendas = agendas.filter(agenda => agenda.id !== agendaId);

  updatedAgendas.push({id: agenda.id, name: agenda.name,
    description: agenda.description, taskIds: [...agenda.taskIds, taskId]});

  localStorage.setItem("agendas", JSON.stringify(updatedAgendas));
}

export function removeTask (id) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  const updatedTasks = tasks.filter(task => task.id !== id);

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

export function removeTaskFromAgenda (taskId, agendaId) {
  const agendas = JSON.parse(localStorage.getItem("agendas"));

  const agenda = agendas.find(agenda => agenda.id === agendaId);

  const updatedAgendas = agendas.filter(agenda => agenda.id !== agendaId);

  const updatedTasks = agenda.taskIds.filter(id => id !== taskId);

  updatedAgendas.push({id: agenda.id, name: agenda.name,
    description: agenda.description, taskIds: updatedTasks});

  localStorage.setItem("agendas", JSON.stringify(updatedAgendas));
}

export function editAgenda (id, name, description) {
  const agendas = JSON.parse(localStorage.getItem("agendas"));

  const agenda = agendas.find(agenda => agenda.id === id);

  const updatedAgendas = agendas.filter(agenda => agenda.id !== id);

  updatedAgendas.push({id, name, description, taskIds: agenda.taskIds});

  localStorage.setItem("agendas", JSON.stringify(updatedAgendas));
}

export function editTask (id, title, description, dueDate, priority) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  const updatedTasks = tasks.filter(task => task.id !== id);

  const formattedDate = format(new Date(dueDate), "dd/MM/yyyy");

  // If editing, completion status will have to be false (otherwise editing is
  // not allowed)
  updatedTasks.push({id, title, description, formattedDate, priority,
    completionStatus: false});

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

export function completeTask (id) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  
  const task = tasks.find(task => task.id === id);

  const updatedTasks = tasks.filter(task => task.id !== id);

  updatedTasks.push({id: task.id, title: task.title,
    description: task.description, dueDate: task.dueDate,
    priority: task.priority, completionStatus: true});

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

export function saveCurrentAgenda (id) {
  localStorage.setItem("currentAgenda", JSON.stringify({id}));
}

export function getSavedCurrentAgendaId () {
  const agenda = JSON.parse(localStorage.getItem("currentAgenda"));
  return agenda.id;
}

export function loadStorage () {
  // Load Agendas
  const agendas = JSON.parse(localStorage.getItem("agendas"));

  if (!agendas) {
    return;
  }

  // Clear agendas from local storage
  localStorage.setItem("agendas", JSON.stringify([]));

  for (let agenda of agendas) {
    logic.createNewAgenda(agenda.name, agenda.description);
  }

  // Load Tasks
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (!tasks) {
    return;
  }

  // Clear tasks from local storage
  localStorage.setItem("tasks", JSON.stringify([]));

  for (let task of tasks) {
    const agenda = agendas.find(agenda => agenda.taskIds.includes(task.id));
    // This function will also add the task to the required agenda
    logic.createNewTask(task.title, agenda.id, {description:task.description,
      dueDate:task.dueDate, priority:task.priority,
      completionStatus: task.completionStatus}
    )
  }
}