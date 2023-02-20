const TodoModel = require('../models/TodoModel');

const createList = async (req, res) => {
  const { text, user } = req.body;
  const todo = new TodoModel({
    text,
    completed: false,
    User: user
  })
  const newTodo = await todo.save();

  if (newTodo) { // Created 
    return res.status(201).json({ message: 'New todo created' })
} else {
    return res.status(400).json({ message: 'Invalid todo data received' })
}
};

const deleteList = async (req, res) => {
    const {id} = req.params;
    const todo = await TodoModel.findById(id);
    await todo.remove();

    const reply = `Note '${todo.text}' with ID ${todo._id} deleted`
    res.status(204).json({reply,id});
  }

const getAllList = async (req, res) => {
    const todos = await TodoModel.find();
    res.json(todos);
  }

const getListByCreator = async (req, res) => {
    const { userId } = req.params
    console.log(userId)
    const todos = await TodoModel.find({ userId });
    
    res.json(todos);
  }

const updateList = async (req, res) => {
    const {id} = req.params;
    const {text, completed} = req.body
    if(!id || !text || typeof completed !== 'boolean') {
      return res.status(404).json({ message: " all fields are required "})
    }

    const todo = await TodoModel.findById(id);

    if (!todo) {
      return res.status(400).json({ message: 'todo not found' })
  }
    
    todo.completed = completed
    todo.text = text
    await todo.save();
    res.json(todo);
  }

  module.exports = {
    createList,
    getAllList,
    getListByCreator,
    updateList,
    deleteList
}