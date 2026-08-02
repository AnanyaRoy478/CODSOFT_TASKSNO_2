// const express = require("express");
// const cors = require("cors");

// const routes = require("./routes/insight.routes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/insights", routes);

// module.exports = app;

const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/activities", require("./routes/activityRoutes"));

// Error Middleware (Always Last)
app.use(errorMiddleware);

module.exports = app;