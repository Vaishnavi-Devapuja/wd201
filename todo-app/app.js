/* eslint-disable no-undef */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.get("/", async (req, res)=> {
  const allTodos= await Todo.getTodos();
  if(req.accepts("html")){
    res.render("index",{
      allTodos,
    });
  }else{
    res.json({
      allTodos,
    })
  }
});

app.get("/todos", async (req, res) => {
  console.log("We have the list of all todos ...");
  try {
    const todosList = await Todo.findAll();
    return res.json(todosList);
  } catch (error) {
    console.error(error);
    return res.status(422).json({ error: "Server error" });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.json(todo);
  } catch (error) {
    console.error(error);
    return res.status(422).json({ error: "Server error" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    return res.json(todo);
  } catch (error) {
    console.error(error);
    return res.status(422).json({ error: "Invalid data" });
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(422).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.update({ completed: true });
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Server error" });
  }
});

// DELETE /todos/:id endpoint
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);

    if (!todo) {
      // If the todo with the given ID does not exist, respond with false
      return res.json(false);
    }

    // If the todo exists, delete it
    await todo.destroy();

    // Respond with true to indicate successful deletion
    return res.json(true);
  } catch (error) {
    // If there's an error during the process, respond with false
    console.error(error);
    return res.json(false);
  }
});


module.exports = app;
