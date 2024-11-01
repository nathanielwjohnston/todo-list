import { format } from "date-fns/format";
import { completeTask as storageCompleteTask }  from "./storage";

export const priorities = {lowPriority: "Low Priority", important: "Important", 
  urgent: "Urgent"};

let currentTaskId = 0;

export function createTask ({title, description=null, dueDate=null,
  priority=priorities.lowPriority, completionStatus=false}) {

  // Set id to next available and then increment for next task
  const id = currentTaskId++;

  const getId = () => id;

  const getTitle = () => title;
  const updateTitle = (newTitle) => title = newTitle;

  const getDescription = () => description === null ? "" : description; 
  const updateDescription = (newDescription) => description = newDescription;

  const getDueDate = () => {
    return (dueDate === null || dueDate === "") ? "" : format(new Date(dueDate), "dd/MM/yyyy");
  } 
  const getDueDateForInput = () => {
    return (dueDate === null || dueDate === "") ? "" : format(new Date(dueDate), "yyyy-MM-dd");
  }
  const updateDueDate = (newDueDate) => dueDate = format(new Date(newDueDate), "dd/MM/yyyy");

  const getPriority = () =>  priority;
  const updatePriority = (newPriority) => priority = newPriority;

  let completed = completionStatus;

  const getCompletionStatus = () => completed; 
  const completeTask = () => {
    completed = true;
    storageCompleteTask(id);
  };

  return { getId, getTitle, updateTitle, getDescription, updateDescription,
    getDueDate, getDueDateForInput, updateDueDate, getPriority, updatePriority,
    getCompletionStatus, completeTask
   };
}