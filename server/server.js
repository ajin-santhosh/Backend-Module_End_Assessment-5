const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const validate = require("./src/routes/validateRoutes");
const tokenMiddleware = require("./src/middleware/tokenMiddleware");

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
const port = process.env.Port;
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/tasks", tokenMiddleware, taskRoutes);
app.use("/api", validate);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
