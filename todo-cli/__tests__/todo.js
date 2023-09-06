/* eslint-disable no-undef */
const todoList = require("../todo")
const {
  all,
  markAsComplete,
  add,
  overdue,
  dueToday,
  dueLater,
  toDisplayableList,
} = todoList()

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Pay electricity bill",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
    });
  });

  beforeEach(() => {
    // Add a clean slate for each test
    all.length = 0;
  });

  test("should initially have an empty todo list", () => {
    expect(all.length).toBe(1);

    add({
      title: "Project submission",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
    });

    expect(all.length).toBe(2);
  });

  test("should mark a task as complete", () => {
    expect(all[0].completed).toBe(false);

    markAsComplete(0);

    expect(all[0].completed).toBe(true);
  });

  test("should have overdue tasks", () => {
    let todayDate = new Date();
    add({
      title: "overdue check",
      dueDate: new Date(todayDate.setDate(todayDate.getDate() - 1))
        .toISOString()
        .split("T")[0],
      completed: false,
    });

    let overdueTasks = overdue();

    expect(overdueTasks.length).toBe(1);
  });

  test("should have tasks due later", () => {
    let todayDate = new Date();
    add({
      title: "due later check",
      dueDate: new Date(todayDate.setDate(todayDate.getDate() + 1))
        .toISOString()
        .split("T")[0],
      completed: false,
    });

    let dueLaterTasks = dueLater();

    expect(dueLaterTasks.length).toBe(1);
  });

  test("should have tasks due today and displayable list", () => {
    let dueTodayTasks = dueToday();

    expect(dueTodayTasks.length).toBe(2);

    let displayableList = toDisplayableList(dueTodayTasks);

    expect(displayableList).toBe("[x] Pay electricity bill\n[ ] Project submission");
  });
});
