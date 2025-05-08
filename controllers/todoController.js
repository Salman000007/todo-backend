const Todo = require("../models/Todo");
const { handleServerError, isOwner } = require("../utils/helper");

// Create new todo
const createTodo = async (req, res) => {
  const { title, description, dueDate, status } = req.body;

  try {
    const newTodo = await new Todo({
      title,
      description,
      dueDate,
      status,
      userId: req.user,
    }).save();

    return res.status(201).json({ status: "success", data: newTodo });
  } catch (err) {
    return handleServerError(res, err);
  }
};

// Get all todos for a user
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user });
    return res.status(200).json({ status: "success", data: todos });
  } catch (err) {
    return handleServerError(res, err);
  }
};

// Update a todo
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;

  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ status: "fail", msg: "Todo not found" });
    if (!isOwner(todo, req.user))
      return res.status(403).json({ status: "fail", msg: "Unauthorized" });

    todo.title = title ?? todo.title;
    todo.description = description ?? todo.description;
    todo.dueDate = dueDate ?? todo.dueDate;
    todo.status = status ?? todo.status;

    await todo.save();
    return res.status(200).json({ status: "success", data: todo });
  } catch (err) {
    return handleServerError(res, err);
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ status: "fail", msg: "Todo not found" });
    if (!isOwner(todo, req.user))
      return res.status(403).json({ status: "fail", msg: "Unauthorized" });

    await Todo.deleteOne({ _id: id });
    return res.status(200).json({ status: "success", msg: "Todo deleted" });
  } catch (err) {
    return handleServerError(res, err);
  }
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
