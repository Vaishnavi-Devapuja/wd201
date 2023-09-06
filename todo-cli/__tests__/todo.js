const { default: expect } = require("expect")
const todoList = require ("../todo")
const { all , markAsComplete, add, overdue, dueToday, dueLater} = todoList()
describe("todolist test suite", () => {
    beforeAll(() => {
        const today = new Date()
        const tomorrow = new Date(new Date().setDate(today.getDate() + 1))
        expect(all.length).toBe(0)
        add({ title: 'File taxes', dueDate: tomorrow.toISOString().slice(0, 10), completed: false })
        expect(all.length).toBe(1)
    })
    test("should add new todo", () => {
        const todoItemCount = all.length
        add({ title: 'Service Vehicle', dueDate: new Date().toISOString().slice(0, 10), completed: false })
        expect(all.length).toBe(todoItemCount + 1)
    })
    test("should mark a todo as complete", () => {
        expect(all[0].completed).toBe(false)
        markAsComplete(0)
        expect(all[0].completed).toBe(true)
    })
    test("should retrieve overdue items", () => {
        const today = new Date()
        const yesterday = new Date(new Date().setDate(today.getDate() - 1))
        const overdueCount = overdue().length
        add({ title: 'Submit assignment', dueDate: yesterday.toISOString().slice(0, 10), completed: false })
        expect(overdue().length).toBe(overdueCount + 1)
    })
    test("should retrieve due today items", () => {
        const today = new Date()
        const dueTodayCount = dueToday().length
        add({ title: 'Pay rent', dueDate: today.toISOString().slice(0, 10), completed: true })
        expect(dueToday().length).toBe(dueTodayCount + 1)
    })
    test("should retrieve due later items", () => {
        const today = new Date()
        const tomorrow = new Date(new Date().setDate(today.getDate() + 1))
        const dueLateCount = dueLater().length
        add({ title: 'Pay electric bill', dueDate: tomorrow.toISOString().slice(0, 10), completed: false })
        expect(dueLater().length).toBe(dueLateCount + 1)
    })
})
