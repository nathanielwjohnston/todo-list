import "./styles.css";
import { priorities, createTask } from "./tasks";
import { createAgenda } from "./agendas";
import * as logic from "./logic";

logic.createNewAgenda("New Agenda", "This is a new agenda");

console.log(logic.getAgendas());

logic.removeAgenda(logic.getAgendas()[0].getId());

console.log(logic.getAgendas());

logic.createNewAgenda("New Agenda", "This is a new agenda");

console.log(logic.getAgendaFromId(1));

logic.editAgenda(1, "New Agenda Name", "New description");

console.log(logic.getAgendaFromId(1).getName());

console.log(logic.getAgendaFromId(1).getDescription());

logic.createNewTask("Task", 1, {priority:priorities.urgent})

const task = logic.getTaskFromId(1, 0);

console.log(task.getPriority());

logic.editTask(1, 0, "This is a new title", "and a new description",
  "99", priorities.important
);

console.log(task.getPriority());
