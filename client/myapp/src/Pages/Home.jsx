import React from "react";
import TaskPage from "./taskPage";
import axios from "axios";

function Home() {
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5002/api/users/logout",
        {},
        { withCredentials: true }
      );
      sessionStorage.removeItem("idr"); // or localStorage if you used that
      alert("Logged out successfully!");
      window.location.href = "/login"; // redirect to login page
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <div className="flex-row items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-blue-600 p-5">
        Welcome to the Home Page!
      </h1>

      <TaskPage />

      <button
        onClick={handleLogout}
        className="mx-96 my-5 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
