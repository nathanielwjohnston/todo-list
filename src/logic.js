import { createTask, priorities } from "./tasks";
import { createAgenda } from "./agendas";

/* The display controller will be using these functions for information.
   Therefore, the input will be mostly id-based */

agendas = [];

function createNewAgenda ({name, description=null, subAgendas}) {
  const agenda = createAgenda(name, description);
  // sub agenda names in array
  for (let subAgendaName of subAgendas) {
    agenda.addSubAgenda(subAgendaName);
  }

  agendas.push(agenda);
}

function removeAgenda (agendaId) {
  // get specified agenda
  const agenda = agendas.find((agenda) => agenda.getId() === agendaId);
  // remove from agendas array
  agendas.splice(agendas.indexOf(agenda), 1);
}

function getAgendaFromId (agendaId) {
  return agendas.find((agenda) => agenda.getId() === agendaId);
}

// to edit the base parameters of an agenda i.e. name and description
function editAgenda (agendaId, name, description) {
  const agenda = getAgendaFromId(agendaId);

  // submitting a form and therefore all values will be submitted even if not new
  agenda.updateName(name);
  agenda.updateDescription(description);
}

function getSubAgendaFromId (agendaId, subAgendaId) {
  return getAgendaFromId(agendaId)
          .getSubAgendas()
            .find((subAgenda) => subAgenda.getId() === subAgendaId);
}

function editSubAgenda (agendaId, subAgendaId, name) {
  const subAgenda = getSubAgendaFromId(agendaId, subAgendaId);

  subAgenda.updateName(name);
}

function createNewTask ({title, description=null, dueDate=null,
  priority=priorities.lowPriority, agendaId=null, subAgendaId=null}) {

    const task = createTask({title, description, dueDate,
      priority});
    
    if (agendaId !== null) {
      const agenda = getAgendaFromId(agendaId);
      agenda.addTask(task);

      if (subAgendaId !== null) {
        const subAgenda = getSubAgendaFromId(agendaId, subAgendaId);
        subAgenda.addTask(task);
      }
    }
    
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