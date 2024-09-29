import "./styles.css";
import { priorities, createTask } from "./tasks";
import { createAgenda } from "./agendas";

const agenda = createAgenda("agenda1");
console.log(agenda.getId());

const subAgenda = agenda.getSubAgendas().find((subAgenda) => subAgenda.getId() === 0);

console.log(subAgenda.getName());