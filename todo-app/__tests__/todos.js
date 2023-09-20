/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("POST /todos should create a todo and respond with JSON", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy groceries",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe("application/json; charset=utf-8");

    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("PUT /todos/:id/markAsCompleted should mark a todo as complete", async () => {
    const createResponse = await agent.post("/todos").send({
      title: "Buy groceries",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    const parsedCreateResponse = JSON.parse(createResponse.text);
    const todoID = parsedCreateResponse.id;

    expect(parsedCreateResponse.completed).toBe(false);

    const markCompleteResponse = await agent.put(`/todos/${todoID}/markAsCompleted`).send();

    expect(markCompleteResponse.statusCode).toBe(200);

    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("GET /todos should fetch all todos in the database", async () => {
    await agent.post("/todos").send({
      title: "Pay rent",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Return books ",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    const response = await agent.get("/todos");

    //expect(response.statusCode).toBe(200);

    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.length).toBe(4); 
    expect(parsedResponse[3].title).toBe("Return books");
  });

  test("DELETE /todos/:id should delete a todo and respond with true", async () => {
  const agent = request.agent(server);

  // Create a new todo
  let res = await agent.post("/todos").send({
    title: "Buy Choklate",
    dueDate: new Date().toISOString(),
    completed: false,
  });

  const parsedResponse = JSON.parse(res.text);
  const todoID = parsedResponse.id;

  // Delete the todo
  res = await agent.delete(`/todos/${todoID}`);

  // Assert that the response is true (indicating successful deletion)
  expect(res.body).toBe(true);
});

