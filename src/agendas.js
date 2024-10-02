let currentAgendaId = 0

export function createAgenda (name, description=null) {
  // set id to next available and then increment for next agenda
  const id = currentAgendaId++;

  const getId = () => id;

  const getName = () => name;
  const updateName = (newName) => name = newName;
  
  const getDescription = () => description === null ? "" : description;
  const updateDescription = (newDescription) => description = newDescription;
  
  let tasks = [];

  const getTasks = () => tasks;
  const addTask = (task) => {
    tasks.push(task);
  };
  const removeTask = (task) => {
    tasks.splice(tasks.indexOf(task), 1)                                              
  };
  
  return { getId, getName, updateName, getDescription, updateDescription, 
    getTasks, addTask, removeTask
   };
}
