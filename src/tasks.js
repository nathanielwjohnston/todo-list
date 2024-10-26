import { format } from "date-fns/format";

export const priorities = {lowPriority: "Low Priority", important: "Important", 
  urgent: "Urgent"};

let currentTaskId = 0;

export function createTask ({title, description=null, dueDate=null,
  priority=priorities.lowPriority}) {

  // Set id to next available and then increment for next task
  const id = currentTaskId++;

  const getId = () => id;

  const getTitle = () => title;
  const updateTitle = (newTitle) => title = newTitle;

  const getDescription = () => description === null ? "" : description; 
  const updateDescription = (newDescription) => description = newDescription;

  const getDueDate = () => dueDate === null ? "" : format(new Date(dueDate), "dd/MM/yyyy");
  const getDueDateForInput = () => dueDate === null ? "" : format(new Date(dueDate), "yyyy-MM-dd");
  const updateDueDate = (newDueDate) => dueDate = newDueDate;

  const getPriority = () =>  priority;
  const updatePriority = (newPriority) => priority = newPriority;

  let completed = false;

  const getCompletionStatus = () => completed; 
  const completeTask = () => completed = true;

  return { getId, getTitle, updateTitle, getDescription, updateDescription,
    getDueDate, getDueDateForInput, updateDueDate, getPriority, updatePriority,
    getCompletionStatus, completeTask
   };
}