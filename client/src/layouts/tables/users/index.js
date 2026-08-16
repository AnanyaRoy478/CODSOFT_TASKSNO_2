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
import { getAllUsers } from "api/userApi";

// Data
import usersTableData from "layouts/tables/data/authorsTableData";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllUsers();

      if (response.flag) {
        setUsers(response.body?.data || []);
      } else {
        setUsers([]);

        setError(response.body?.message || "Failed to fetch users.");
      }
    } catch (err) {
      setUsers([]);

      setError("Unable to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { columns: uColumns, rows: uRows } = usersTableData(users);

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
                  Users Table
                </MDTypography>
              </MDBox>

              <MDBox pt={3}>
                {loading ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="body2" color="text">
                      Loading users...
                    </MDTypography>
                  </MDBox>
                ) : error ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="body2" color="error">
                      {error}
                    </MDTypography>
                  </MDBox>
                ) : users.length === 0 ? (
                  <MDBox py={5} textAlign="center">
                    <MDTypography variant="h6" color="text">
                      No users found.
                    </MDTypography>

                    <MDTypography variant="body2" color="text" mt={1}>
                      There are currently no users.
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{
                      columns: uColumns,
                      rows: uRows,
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

export default Users;
