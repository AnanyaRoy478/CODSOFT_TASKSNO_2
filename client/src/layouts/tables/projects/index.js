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
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MDButton from "components/MDButton";
import Button from "@mui/material/Button";
import MDInput from "components/MDInput";
// PROJECT MANAGEMENT components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { getProjectById } from "api/projectApi";
import { deleteProject } from "api/projectApi";
// PROJECT MANAGEMENT example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import data from "layouts/dashboard/components/Projects/data";
// API
import { getProjects } from "api/projectApi";

// Data
import projectsTableData from "layouts/tables/data/projectsTableData";
import { createProject } from "api/projectApi";
import { updateProject } from "api/projectApi";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const isAdmin = JSON.parse(localStorage.getItem("user"))?.role === "Admin";
  const isMember = JSON.parse(localStorage.getItem("user"))?.role === "Member";
  const isManager = JSON.parse(localStorage.getItem("user"))?.role === "Manager";
  const handleEdit = (project) => {
    setSelectedProject(project);

    setEditForm({
      title: project.title || "",
      description: project.description || "",
      status: project.status || "",
    });

    setEditOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject?._id) {
      return;
    }

    try {
      const response = await deleteProject(selectedProject._id);

      if (response.flag) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== selectedProject._id)
        );

        setDeleteOpen(false);
        setSelectedProject(null);
      } else {
        setError(response.body?.message || "Failed to delete project.");
      }
    } catch (err) {
      setError("Unable to delete project.");
    }
  };

  const handleDetails = async (project) => {
    try {
      const response = await getProjectById(project._id);

      if (response.flag) {
        setSelectedProject(response.body?.data);
        setDetailsOpen(true);
      } else {
        setError(response.body?.message || "Failed to load project details.");
      }
    } catch (err) {
      setError("Unable to load project details.");
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject?._id) {
      return;
    }

    try {
      const response = await updateProject(selectedProject._id, editForm);

      if (response.flag) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === selectedProject._id ? response.body.data : project
          )
        );

        setEditOpen(false);
        setSelectedProject(null);
      } else {
        setError(response.body?.message || "Failed to update project.");
      }
    } catch (err) {
      setError(err.message || "Unable to update project.");
    }
  };

  const handleOpenDialog = () => {
    setCreateError("");

    setProjectForm({
      title: "",
      description: "",
      deadline: "",
    });

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (creating) return;

    setOpenDialog(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProject = async () => {
    try {
      setCreateError("");

      if (!projectForm.title.trim()) {
        setCreateError("Project title is required.");
        return;
      }

      setCreating(true);

      const response = await createProject(projectForm);

      if (!response.flag) {
        setCreateError(response.body?.message || "Failed to create project.");
        return;
      }

      setOpenDialog(false);

      setProjectForm({
        title: "",
        description: "",
        deadline: "",
      });

      await fetchProjects();
    } catch (error) {
      setCreateError("Unable to create project.");
    } finally {
      setCreating(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProjects();

      if (response.flag) {
        setProjects(response.body?.data || []);
      } else {
        setProjects([]);
        setError(response.body?.message || "Failed to fetch projects.");
      }
    } catch (err) {
      setProjects([]);

      setError(err?.response?.body?.message || "Unable to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = (project) => {
    setSelectedProject(project);
    setDeleteOpen(true);
  };

  const { columns: pColumns, rows: pRows } = projectsTableData(
    projects,
    handleDetails,
    handleEdit,
    handleDelete
  );

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
                  Projects Table
                </MDTypography>
                {isManager && (
                  <MDButton
                    variant="contained"
                    color="white"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                  >
                    Add Project
                  </MDButton>
                )}
              </MDBox>

              <MDBox pt={3}>
                {loading ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      Loading projects...
                    </MDTypography>
                  </MDBox>
                ) : error ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="body2" color="error">
                      {error}
                    </MDTypography>
                  </MDBox>
                ) : projects.length === 0 ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="h6" color="text">
                      No projects found.
                    </MDTypography>

                    <MDTypography variant="body2" color="text" mt={1}>
                      You currently don&apos;t have any projects.
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{
                      columns: pColumns,
                      rows: pRows,
                    }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>

            <Dialog
              open={detailsOpen}
              onClose={() => setDetailsOpen(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Project Details</DialogTitle>

              <DialogContent>
                {selectedProject && (
                  <MDBox py={2}>
                    <MDTypography variant="h6">{selectedProject.title}</MDTypography>

                    <MDTypography variant="body2" mt={2}>
                      {selectedProject.description || "No description"}
                    </MDTypography>

                    <MDTypography variant="body2" mt={2}>
                      Status: {selectedProject.status || "N/A"}
                    </MDTypography>
                  </MDBox>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>

            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
              <DialogTitle>Delete Project</DialogTitle>

              <DialogContent>
                <MDTypography variant="body2">
                  Are you sure you want to delete <strong>{selectedProject?.title}</strong>?
                </MDTypography>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

                <Button color="error" onClick={confirmDelete}>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
              <DialogTitle>Edit Project</DialogTitle>

              <DialogContent>
                <MDBox py={2}>
                  <MDInput
                    label="Project Title"
                    fullWidth
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        title: e.target.value,
                      })
                    }
                  />

                  <MDBox mt={2}>
                    <MDInput
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </MDBox>
                </MDBox>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setEditOpen(false)}>Cancel</Button>

                <Button variant="contained" onClick={handleUpdateProject}>
                  Update
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
              <DialogTitle>Create New Project</DialogTitle>

              <DialogContent>
                {createError && (
                  <MDTypography variant="caption" color="error">
                    {createError}
                  </MDTypography>
                )}

                <TextField
                  fullWidth
                  required
                  label="Project Title"
                  name="title"
                  value={projectForm.title}
                  onChange={handleChange}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={projectForm.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                />

                <TextField
                  fullWidth
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={projectForm.deadline}
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
                  onClick={handleCreateProject}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Project"}
                </MDButton>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Projects;
