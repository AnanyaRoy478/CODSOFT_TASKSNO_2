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

// PROJECT MANAGEMENT components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// PROJECT MANAGEMENT example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// API
import { getProjects } from "api/projectApi";

// Data
import projectsTableData from "layouts/tables/data/projectsTableData";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
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
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Projects;
