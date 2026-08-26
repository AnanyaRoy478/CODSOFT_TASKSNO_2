/**
=========================================================
* PROJECT MANAGEMENT - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*/

// React
import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
// PROJECT MANAGEMENT components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// PROJECT MANAGEMENT example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// API
import { getTasks } from "api/taskApi";

// Data
import tasksTableData from "layouts/tables/data/tasksTableData";
import { getProjects } from "api/projectApi";
import { createTask } from "api/taskApi";
import { getAllUsers } from "api/userApi";
import { updateTask } from "api/taskApi";
import { getTaskById } from "api/taskApi";
import { deleteTask } from "api/taskApi";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    project: "",
    priority: "Medium",
    dueDate: "",
  });
  const [menu, setMenu] = useState(null);
  const isAdmin = JSON.parse(localStorage.getItem("user"))?.role === "Admin";
  const isMember = JSON.parse(localStorage.getItem("user"))?.role === "Member";
  const isManager = JSON.parse(localStorage.getItem("user"))?.role === "Manager";
  const openMenu = (event, task) => {
    setMenu(event.currentTarget);
    setSelectedTask(task);
  };

  const closeMenu = () => {
    setMenu(null);
    setSelectedTask(null);
  };
  const fetchProjects = async () => {
    try {
      const response = await getProjects();

      if (response.flag) {
        setProjects(response.body?.data || []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      setProjects([]);
    }
  };

  const handleDetails = async (task) => {
    try {
      setActionLoading(true);

      const response = await getTaskById(task._id);

      if (response.flag) {
        setSelectedTask(response.body?.data);
        setDetailsOpen(true);
      } else {
        setError(response.body?.message || "Failed to fetch task details.");
      }
    } catch (err) {
      setError("Unable to load task details.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (task) => {
    setSelectedTask(task);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTask?._id) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await deleteTask(selectedTask._id);

      if (response.flag) {
        setDeleteOpen(false);
        setSelectedTask(null);

        await fetchTasks();
      } else {
        setError(response.body?.message || "Failed to delete task.");
      }
    } catch (err) {
      setError("Unable to delete task. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks();

      if (response.flag) {
        setTasks(response.body?.data || []);
      } else {
        setTasks([]);

        setError(response.body?.message || "Failed to fetch tasks.");
      }
    } catch (err) {
      setTasks([]);

      setError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();

      if (response.flag) {
        setUsers(response.body?.data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  const handleOpenDetails = (task) => {
    console.log("Details:", task);
  };

  const handleDeleteTask = async (task) => {
    console.log("Delete:", task._id);
  };

  const handleOpenEditDialog = (task) => {
    setEditError("");
    setSelectedTask(task);

    setEditForm({
      title: task.title || "",
      description: task.description || "",
      project: task.project?._id || task.project || "",
      assignedTo: task.assignedTo?._id || task.assignedTo || "",
      priority: task.priority || "Medium",
      status: task.status || "Todo",
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
    });

    setEditDialog(true);
  };

  const { columns: tColumns, rows: tRows } = tasksTableData(
    tasks,
    menu,
    selectedTask,
    openMenu,
    closeMenu,
    handleOpenEditDialog,
    handleDeleteTask,
    handleOpenDetails,
    handleDelete,
    handleDetails
  );

  const handleOpenDialog = () => {
    setCreateError("");

    setTaskForm({
      title: "",
      description: "",
      project: "",
      priority: "Medium",
      dueDate: "",
    });

    setOpenDialog(true);
  };

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    priority: "Medium",
    status: "Todo",
    dueDate: "",
  });

  const handleCloseEditDialog = () => {
    if (editing) return;

    setEditDialog(false);
    setEditError("");
    setSelectedTask(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdateTask = async () => {
    try {
      setEditError("");

      if (!editForm.title.trim()) {
        setEditError("Task title is required.");
        return;
      }

      if (!editForm.project) {
        setEditError("Please select a project.");
        return;
      }

      if (!selectedTask?._id) {
        setEditError("Task ID is missing.");
        return;
      }

      setEditing(true);

      const taskData = {
        title: editForm.title,
        description: editForm.description,
        project: editForm.project,
        priority: editForm.priority,
        status: editForm.status,
        assignedTo: editForm.assignedTo || "",
        dueDate: editForm.dueDate || undefined,
      };

      // Only send assignedTo when a user is selected.
      // This prevents "" from being cast to ObjectId.
      if (editForm.assignedTo) {
        taskData.assignedTo = editForm.assignedTo;
      } else {
        taskData.assignedTo = "";
      }

      const response = await updateTask(selectedTask._id, taskData);

      if (!response.flag) {
        setEditError(response.body?.message || "Failed to update task.");
        return;
      }

      setEditDialog(false);
      setSelectedTask(null);

      await fetchTasks();
    } catch (error) {
      setEditError(error.message || "Unable to update task. Please try again.");
    } finally {
      setEditing(false);
    }
  };

  const handleCloseDialog = () => {
    if (creating) return;

    setOpenDialog(false);
    setCreateError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTaskForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateTask = async () => {
    try {
      setCreateError("");

      if (!taskForm.title.trim()) {
        setCreateError("Task title is required.");
        return;
      }

      if (!taskForm.project) {
        setCreateError("Please select a project.");
        return;
      }

      setCreating(true);

      const response = await createTask(taskForm);

      if (!response.flag) {
        setCreateError(response.body?.message || "Failed to create task.");
        return;
      }

      setOpenDialog(false);

      setTaskForm({
        title: "",
        description: "",
        priority: "Medium",
        project: "",
        dueDate: "",
      });

      await fetchTasks();
    } catch (error) {
      setCreateError("Unable to create task. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={2}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Tasks Table
                </MDTypography>
                {isManager ? (
                  <MDButton
                    variant="contained"
                    color="white"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                  >
                    Add Task
                  </MDButton>
                ) : null}
              </MDBox>

              <MDBox pt={3}>
                {loading ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      Loading tasks...
                    </MDTypography>
                  </MDBox>
                ) : error ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="body2" color="error">
                      {error}
                    </MDTypography>
                  </MDBox>
                ) : tasks.length === 0 ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="h6" color="text">
                      No tasks found.
                    </MDTypography>

                    <MDTypography variant="body2" color="text" mt={1}>
                      There are currently no tasks.
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{
                      columns: tColumns,
                      rows: tRows,
                    }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Task Details</DialogTitle>

          <DialogContent dividers>
            {selectedTask && (
              <MDBox>
                <MDTypography variant="h6" mb={2}>
                  {selectedTask.title}
                </MDTypography>

                <MDTypography variant="body2" mb={2}>
                  <strong>Description:</strong> {selectedTask.description || "No description"}
                </MDTypography>

                <MDTypography variant="body2" mb={2}>
                  <strong>Project:</strong> {selectedTask.project?.title || "No project"}
                </MDTypography>

                <MDTypography variant="body2" mb={2}>
                  <strong>Assigned To:</strong> {selectedTask.assignedTo?.name || "Unassigned"}
                </MDTypography>

                <MDTypography variant="body2" mb={2}>
                  <strong>Email:</strong> {selectedTask.assignedTo?.email || "N/A"}
                </MDTypography>

                <MDTypography variant="body2" mb={2}>
                  <strong>Priority:</strong> {selectedTask.priority}
                </MDTypography>

                <MDTypography variant="body2" mb={2}>
                  <strong>Status:</strong> {selectedTask.status}
                </MDTypography>

                <MDTypography variant="body2">
                  <strong>Due Date:</strong>{" "}
                  {selectedTask.dueDate
                    ? new Date(selectedTask.dueDate).toLocaleDateString()
                    : "No date"}
                </MDTypography>
              </MDBox>
            )}
          </DialogContent>

          <DialogActions>
            <MDButton variant="gradient" color="info" onClick={() => setDetailsOpen(false)}>
              Close
            </MDButton>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Delete Task</DialogTitle>

          <DialogContent>
            <MDTypography variant="body2">
              Are you sure you want to delete <strong>{selectedTask?.title}</strong>?
            </MDTypography>

            <MDTypography variant="caption" color="text" mt={1} display="block">
              This action will remove the task from the task list.
            </MDTypography>
          </DialogContent>

          <DialogActions>
            <MDButton
              variant="outlined"
              color="dark"
              onClick={() => setDeleteOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </MDButton>

            <MDButton
              variant="gradient"
              color="error"
              onClick={confirmDelete}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </MDButton>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Create New Task</DialogTitle>

          <DialogContent>
            {createError && (
              <MDBox mt={1}>
                <MDTypography variant="caption" color="error">
                  {createError}
                </MDTypography>
              </MDBox>
            )}

            <TextField
              fullWidth
              required
              label="Task Title"
              name="title"
              value={taskForm.title}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={taskForm.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />

            <TextField
              select
              fullWidth
              required
              label="Project"
              name="project"
              value={taskForm.project}
              onChange={handleChange}
              margin="normal"
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Priority"
              name="priority"
              value={taskForm.priority}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Deadline"
              name="dueDate"
              type="date"
              value={taskForm.dueDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>

          <DialogActions>
            <MDButton onClick={handleCloseDialog} disabled={creating}>
              Cancel
            </MDButton>

            <MDButton
              variant="gradient"
              color="info"
              onClick={handleCreateTask}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Task"}
            </MDButton>
          </DialogActions>
        </Dialog>

        <Dialog open={editDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
          <DialogTitle>Edit Task</DialogTitle>

          <DialogContent>
            {editError && (
              <MDBox mt={1}>
                <MDTypography variant="caption" color="error">
                  {editError}
                </MDTypography>
              </MDBox>
            )}
            {isManager && (
              <TextField
                fullWidth
                required
                label="Task Title"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                margin="normal"
              />
            )}
            {isManager && (
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                margin="normal"
                multiline
                rows={4}
              />
            )}
            {isManager && (
              <TextField
                select
                fullWidth
                required
                label="Project"
                name="project"
                value={editForm.project}
                onChange={handleEditChange}
                margin="normal"
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.title}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {isManager && (
              <TextField
                select
                fullWidth
                label="Assigned To"
                name="assignedTo"
                value={editForm.assignedTo}
                onChange={handleEditChange}
                margin="normal"
              >
                <MenuItem value="">Unassigned</MenuItem>

                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </TextField>
            )}
            {isManager && (
              <TextField
                select
                fullWidth
                label="Priority"
                name="priority"
                value={editForm.priority}
                onChange={handleEditChange}
                margin="normal"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            )}
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              margin="normal"
            >
              <MenuItem value="Todo">Todo</MenuItem>

              <MenuItem value="In Progress">In Progress</MenuItem>

              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
            {isManager && (
              <TextField
                fullWidth
                label="Deadline"
                name="dueDate"
                type="date"
                value={editForm.dueDate}
                onChange={handleEditChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </DialogContent>

          <DialogActions>
            <MDButton onClick={handleCloseEditDialog} disabled={editing}>
              Cancel
            </MDButton>

            <MDButton variant="gradient" color="info" onClick={handleUpdateTask} disabled={editing}>
              {editing ? "Updating..." : "Update Task"}
            </MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Tasks;
