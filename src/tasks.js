export const priorities = {lowPriority: "Low Priority", important: "Important", 
  urgent: "Urgent"};

let currentTaskId = 0;

export function createTask ({title, description=null, dueDate=null,
  priority=priorities.lowPriority, checklist=[]}) {

  // set id to next available and then increment for next task
  const id = currentTaskId++;

  const getId = () => id;

  const getTitle = () => title;
  const updateTitle = (newTitle) => title = newTitle;

  const getDescription = () => description === null ? "" : description; 
  const updateDescription = (newDescription) => description = newDescription;

  // Should this be an empty string?
  const getDueDate = () => dueDate === null ? "" : dueDate;
  const updateDueDate = (newDueDate) => dueDate = newDueDate;

  const getPriority = () =>  priority;
  const updatePriority = (newPriority) => priority = newPriority;

  const getChecklist = () => checklist;
  const addToChecklist = (itemTitle) => checklist.push({title: itemTitle, completed: false});
  const removeFromChecklist = (item) => checklist.splice(checklist.indexOf(item), 1);
  const completeChecklistItem = (item) => item.completed = true;

  let completed = false;

  const getCompletionStatus = () => completed; 
  const completeTask = () => completed = true;

  return { getId, getTitle, updateTitle, getDescription, updateDescription,
    getDueDate, updateDueDate, getPriority, updatePriority, getChecklist,
    addToChecklist, removeFromChecklist, completeChecklistItem,
    getCompletionStatus, completeTask
   };
}