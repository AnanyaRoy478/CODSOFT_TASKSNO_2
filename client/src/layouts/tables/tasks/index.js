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
import { getTasks } from "api/taskApi";

// Data
import tasksTableData from "layouts/tables/data/tasksTableData";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, []);

  const { columns: tColumns, rows: tRows } = tasksTableData(tasks);

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
                  Tasks Table
                </MDTypography>
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
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Tasks;
