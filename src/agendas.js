export function createAgenda (name, description=null) {
  const getName = () => name;
  const updateName = (newName) => name = newName;
  
  const getDescription = () => description === null ? "" : description;
  const updateDescription = (newDescription) => description = newDescription;

  // Create general sub agenda for all tasks without sub agenda explicitly set
  let subAgendas = [createSubAgenda("general")];

  const getSubAgendas = () => subAgendas;
  const addSubAgenda = (name) => {
    subAgendas.push(createSubAgenda(name))
  };
  const removeSubAgenda = (subAgenda) => {
    subAgendas.splice(subAgendas.indexOf(subAgenda), 1)
  };
  
  let tasks = [];

  const getTasks = () => tasks;
  const addTask = (task, subAgenda=null) => {
    tasks.push(task);
    // Add to sub agenda, general or otherwise
    subAgenda === null ? subAgendas[0].addTask(task) : subAgenda.addTask(task);
  };
  const removeTask = (task) => {
    tasks.splice(tasks.indexOf(task), 1)
    const subAgenda = subAgendas
                        .find((subAgenda) => subAgenda
                                              .getTasks()
                                              .includes(task));
    subAgenda.removeTask(task);                                              
  };
  
  return { getName, updateName, getDescription, updateDescription, 
    getTasks, addTask, removeTask, getSubAgendas, addSubAgenda,
    removeSubAgenda
   };
}

function createSubAgenda (name) {
  const getName = () => name;
  const updateName = (newName) => name = newName;

  let tasks = [];

  const getTasks = () => tasks;
  const addTask = (task) => {
    tasks.push(task);
  };
  const removeTask = (task) => {
    tasks.splice(tasks.indexOf(task), 1);                                             
  };

  return { getName, updateName, getTasks, addTask, removeTask } ;
}

// Is there an alternative here? A lot of functionality is repeated, however
// using object destructuring doesn't work as it continuously tries to create
// new agendas and sub agendas. Composition?