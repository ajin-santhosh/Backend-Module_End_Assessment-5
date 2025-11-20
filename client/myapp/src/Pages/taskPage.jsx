import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5002/api/tasks";

const TaskPage = () => {
  const userId = sessionStorage.getItem("id");
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`${API_URL}/getTask/${userId}`, {
        withCredentials: true,
      });
      setTasks(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching tasks");
    }
  };

  // Create new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/addTask`,
        {
          userId,
          title: formData.title,
          description: formData.description,
          status: formData.status,
        },
        { withCredentials: true }
      );
      setFormData({
        ...formData,
        title: "",
        description: "",
        status: "pending",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error adding task");
    }
  };

  // Update existing task
  const handleUpdateTask = async (taskId) => {
    try {
      await axios.put(
        `${API_URL}/updateTask/${userId}/${taskId}`,
        {
          title: formData.title,
          description: formData.description,
          status: formData.status,
        },
        { withCredentials: true }
      );
      setEditingTask(null);
      setFormData({
        ...formData,
        title: "",
        description: "",
        status: "pending",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error updating task");
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/deleteTask/${userId}/${taskId}`, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error deleting task");
    }
  };

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-lg font-bold mb-4 text-center text-indigo-600">
        📝 Task Manager
      </h2>

      {/* User ID Input */}
      {/* <input
        type="text"
        placeholder="Enter User ID"
        value={formData.userId}
        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-indigo-400"
      /> */}

      {/* Add / Update Task Form */}
      <form
        onSubmit={
          editingTask ? () => handleUpdateTask(editingTask._id) : handleAddTask
        }
        className="space-y-3"
      >
        <input
          type="text"
          placeholder="Task Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          placeholder="Task Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>

      <hr className="my-6 border-gray-200" />

      {/* Task List */}
      <h3 className="text-lg font-semibold mb-3 text-gray-700">📋 Task List</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found for this user.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{task.title}</h4>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium text-gray-700">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        task.status === "completed"
                          ? "bg-green-500"
                          : task.status === "in-progress"
                          ? "bg-yellow-500"
                          : task.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {task.status}
                    </span>
                  </p>
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setFormData({
                        ...formData,
                        title: task.title,
                        description: task.description,
                        status: task.status,
                      });
                    }}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskPage;
