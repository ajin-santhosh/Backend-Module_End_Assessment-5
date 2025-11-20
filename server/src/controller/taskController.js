const express = require("express");
const Tasks = require("../models/taskModels");

const getTask = async (req, res) => {
  try {
    const tasks = await Tasks.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { userId, title, description, status } = req.body;
    const newTask = new Tasks({ userId, title, description, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const updates = req.body;

    const updatedTask = await Tasks.findOneAndUpdate(
      { _id: taskId, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    const deletedTask = await Tasks.findOneAndDelete({ _id: taskId, userId });
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getTask, createTask, updateTask, deleteTask };
