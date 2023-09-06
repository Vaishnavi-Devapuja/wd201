/* eslint-disable no-undef */
const todoList = () => {
  const all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    const today = new Date().toISOString().split("T")[0];
    return all.filter((todo) => todo.dueDate < today);
  };

  const dueToday = () => {
    const today = new Date().toISOString().split("T")[0];
    return all.filter((todo) => todo.dueDate === today);
  };

  const dueLater = () => {
    const today = new Date().toISOString().split("T")[0];
    return all.filter((todo) => todo.dueDate > today);
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    let displayList = "";
    list.forEach((todo) => {
      const { title, dueDate, completed } = todo;

      if (dueDate < today) {
        displayList += `[ ] ${title} ${dueDate}\n`;
      } else if (dueDate === today) {
        displayList += `[${completed ? "x" : " "}] ${title}\n`;
      } else {
        displayList += `[ ] ${title} ${dueDate}\n`;
      }
    });
    displayList = displayList.trim();

    return displayList;
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
