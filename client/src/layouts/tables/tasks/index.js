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

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    project: "",
    priority: "Medium",
    dueDate: "",
  });

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

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const { columns: tColumns, rows: tRows } = tasksTableData(tasks);

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

                <MDButton
                  variant="contained"
                  color="white"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  Add Task
                </MDButton>
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
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Tasks;
