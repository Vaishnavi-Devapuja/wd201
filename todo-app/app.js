/* eslint-disable no-undef */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

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
    res.json(todosList);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Server error" });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Server error" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Invalid data" });
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(422).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.update({ completed: true });
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Server error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  console.log("To delete a TODO with ID: ", request.params.id);
  try {
    const deletedTodoCount = await Todo.destroy({
      where: { id: req.params.id },
    });
    if (deletedTodoCount === 0) {
      return res.status(422).json({ error: "Todo not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
