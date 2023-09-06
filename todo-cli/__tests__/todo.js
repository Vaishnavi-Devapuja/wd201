const { default: expect } = require("expect")
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

describe('Todolist Test Suite', () => {
  beforeAll(() => {
    const today = new Date();
    const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
    expect(all.length).toBe(0);
    add({
      title: "Pay electricity bill",
      dueDate: tomorrow.toISOString().slice(0, 10),
      completed: false,
    });
    expect(all.length).toBe(1);
  });

  test("should add new todo", () => {
    const todoItemCount = all.length;
    add({
      title: "Run errands",
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
    });

    expect(all.length).toBe(todoItemCount + 1);
  });

  test("should mark a task as complete", () => {
    expect(all[0].completed).toBe(false);

    markAsComplete(0);

    expect(all[0].completed).toBe(true);
  });

  test("should have overdue tasks", () => {
    const today = new Date();
    const yesterday = new Date(new Date().setDate(today.getDate() - 1));
    const overdueCount = overdue().length;
    add({
      title: "Project submission",
      dueDate: yesterday.toISOString().slice(0, 10),
      completed: false,
    });
    expect(overdue().length).toBe(overdueCount + 1);
  });

  test("should have tasks due later", () => {
    const today = new Date();
    const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
    const dueLaterCount = dueLater().length;
    add({
      title: "Buy groceries",
      dueDate: tomorrow.toISOString().slice(0, 10),
      completed: false,
    });
    expect(dueLater().length).toBe(dueLaterCount + 1);
  });

  test("should have tasks due today and displayable list", () => {
    const today = new Date();
    const dueTodayCount = dueToday().length;
    add({
      title: "Pay rent",
      dueDate: today.toISOString().slice(0, 10),
      completed: true,
    });
    expect(dueToday().length).toBe(dueTodayCount + 1);
  });
});
