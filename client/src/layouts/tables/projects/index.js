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
// PROJECT MANAGEMENT components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

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

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

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

  const { columns: pColumns, rows: pRows } = projectsTableData(projects);

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

                <MDButton
                  variant="contained"
                  color="white"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  Add Project
                </MDButton>
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
