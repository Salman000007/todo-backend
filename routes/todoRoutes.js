const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers/todoController');
const router = express.Router();

router.post('/todos', verifyToken, createTodo);
router.get('/todos', verifyToken, getTodos);
router.put('/todos/:id', verifyToken, updateTodo);
router.delete('/todos/:id', verifyToken, deleteTodo);

module.exports = router;
