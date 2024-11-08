import * as storage from "./storage";

let currentAgendaId = 0

export function createAgenda (name=null, description=null) {
  // Set id to next available and then increment for next agenda
  const id = currentAgendaId++;

  const getId = () => id;

  const getName = () => name === null ? "New Agenda" : name;
  const updateName = (newName) => name = newName;
  
  const getDescription = () => description === null ? "Placeholder Description" : description;
  const updateDescription = (newDescription) => description = newDescription;
  
  let tasks = [];

  const getTasks = () => tasks;
  const addTask = (task) => {
    tasks.push(task);
    storage.saveTask(task.getId(), task.getTitle(), task.getDescription(),
      task.getDueDateForInput(), task.getPriority(), task.getCompletionStatus());
    storage.saveTaskToAgenda(task.getId(), id);
  };
  const removeTask = (task) => {
    tasks.splice(tasks.indexOf(task), 1);
    storage.removeTaskFromAgenda(task.getId(), id);  
    storage.removeTask(task.getId());                                         
  };

  storage.saveAgenda(id, name, description);
  
  return { getId, getName, updateName, getDescription, updateDescription, 
    getTasks, addTask, removeTask
   };
}
