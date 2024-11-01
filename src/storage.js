import * as logic from "./logic";
import { format } from "date-fns/format";

const agendaStorage = (function () {
  const agendas = JSON.parse(localStorage.getItem("agendas"));

  function getAgenda (id) {
    return agendas.find(agenda => agenda.id === id);
  }

  // Returns array of agendas WITHOUT the agenda linked to the provided id
  function getUpdatedAgendas (id) {
    return agendas.filter(agenda => agenda.id !== id);
  }

  return { agendas, getAgenda, getUpdatedAgendas }
})();

const taskStorage = (function () {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  function getTask (id) {
    return tasks.find(task => task.id === id);
  }

  // Returns array of tasks WITHOUT the task linked to the provided id
  function getUpdatedTasks (id) {
    return tasks.filter(task => task.id !== id);
  }

  return { tasks, getTask, getUpdatedTasks }
})();

export function saveAgenda (id, name, description) {
  let agendas;

  if (localStorage.getItem("agendas")) {
    agendas = agendaStorage.agendas;
  } else {
    agendas = [];
  }

  agendas.push({id, name, description, taskIds: []});

  localStorage.setItem("agendas", JSON.stringify(agendas));
}

export function removeAgenda (id) {
  const updatedAgendas = agendaStorage.getUpdatedAgendas(id);

  localStorage.setItem("agendas", JSON.stringify(updatedAgendas));
}

export function saveTask (id, title, description, dueDate, priority,
  completionStatus) {
  let tasks;

  if (localStorage.getItem("tasks")) {
    tasks = taskStorage.tasks;
  } else {
    tasks = [];
  }

  tasks.push({id, title, description, dueDate, priority, completionStatus});

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function saveTaskToAgenda (taskId, agendaId) {
  const agenda = agendaStorage.getAgenda(agendaId);

  const updatedAgendas = agendaStorage.getUpdatedAgendas(agendaId);

  updatedAgendas.push({id: agenda.id, name: agenda.name,
    description: agenda.description, taskIds: [...agenda.taskIds, taskId]});

  localStorage.setItem("agendas", JSON.stringify(updatedAgendas));
}

export function removeTask (id) {
  const updatedTasks = taskStorage.getUpdatedTasks();

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

export function removeTaskFromAgenda (taskId, agendaId) {
  const agenda = agendaStorage.getAgenda(agendaId);

  const updatedAgendas = agendaStorage.getUpdatedAgendas(agendaId);

  const updatedTasks = taskStorage.getUpdatedTasks(taskId);

  updatedAgendas.push({id: agenda.id, name: agenda.name,
    description: agenda.description, taskIds: updatedTasks});

  localStorage.setItem("agendas", JSON.stringify(updatedAgendas));
}

export function editAgenda (id, name, description) {
  const agenda = agendaStorage.getAgenda(id);

  const updatedAgendas = agendaStorage.getUpdatedAgendas(id);

  updatedAgendas.push({id, name, description, taskIds: agenda.taskIds});

  localStorage.setItem("agendas", JSON.stringify(updatedAgendas));
}

export function editTask (id, title, description, dueDate, priority) {
  const updatedTasks = taskStorage.getUpdatedTasks(id);

  const formattedDate = format(new Date(dueDate), "dd/MM/yyyy");

  // If editing, completion status will have to be false (otherwise editing is
  // not allowed)
  updatedTasks.push({id, title, description, formattedDate, priority,
    completionStatus: false});

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

export function completeTask (id) {
  const task = taskStorage.getTask(id);

  const updatedTasks = taskStorage.getUpdatedTasks(id);

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
  const agendas = agendaStorage.agendas;

  if (!agendas) {
    return;
  }

  // Clear agendas from local storage
  localStorage.setItem("agendas", JSON.stringify([]));

  for (let agenda of agendas) {
    logic.createNewAgenda(agenda.name, agenda.description);
  }

  // Load Tasks
  const tasks = taskStorage.tasks;

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