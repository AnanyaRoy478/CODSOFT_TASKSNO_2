import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// PROJECT MANAGEMENT components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
// PROJECT MANAGEMENT example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
// API
import { getAllUsers } from "api/userApi";

// Data
import usersTableData from "layouts/tables/data/authorsTableData";
import { registerUser } from "api/authApi";
import { updateUser } from "api/userApi";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleAddUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      setError("Name, email and password are required.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const response = await registerUser(userForm);

      if (response.flag) {
        setAddUserOpen(false);

        setUserForm({
          name: "",
          email: "",
          password: "",
          role: "",
        });

        await fetchUsers();
      } else {
        setError(response.body?.message || "Failed to create user.");
      }
    } catch (err) {
      setError("Unable to create user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);

    setUserForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role,
    });

    setEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser?._id) {
      return;
    }

    if (!userForm.name) {
      setError("Name is required.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const updateData = {
        name: userForm.name,
      };

      if (userForm.password.trim() !== "") {
        updateData.password = userForm.password;
      }

      const response = await updateUser(selectedUser._id, updateData);

      if (response.flag) {
        setEditUserOpen(false);
        setSelectedUser(null);

        setUserForm({
          name: "",
          email: "",
          password: "",
          role: "",
        });

        await fetchUsers();
      } else {
        setError(response.body?.message || "Failed to update user.");
      }
    } catch (err) {
      setError(err.message || "Unable to update user.");
    } finally {
      setActionLoading(false);
    }
  };

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

  const { columns: uColumns, rows: uRows } = usersTableData(users, handleEditUser);

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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Users Table
                </MDTypography>

                <MDButton variant="gradient" color="white" onClick={() => setAddUserOpen(true)}>
                  <Icon sx={{ mr: 1 }}>add</Icon>
                  Add User
                </MDButton>
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

        <Dialog open={addUserOpen} onClose={() => setAddUserOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add New User</DialogTitle>

          <DialogContent>
            <MDBox pt={2}>
              <MDInput
                label="Name"
                fullWidth
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    name: e.target.value,
                  })
                }
              />
            </MDBox>

            <MDBox pt={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    email: e.target.value,
                  })
                }
              />
            </MDBox>

            <MDBox pt={2}>
              <MDInput
                label="Role"
                fullWidth
                select
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    role: e.target.value,
                  })
                }
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Member">Member</MenuItem>
              </MDInput>
            </MDBox>

            <MDBox pt={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    password: e.target.value,
                  })
                }
              />
            </MDBox>
          </DialogContent>

          <DialogActions>
            <MDButton variant="outlined" color="dark" onClick={() => setAddUserOpen(false)}>
              Cancel
            </MDButton>

            <MDButton
              variant="gradient"
              color="info"
              onClick={handleAddUser}
              disabled={actionLoading}
            >
              {actionLoading ? "Creating..." : "Create User"}
            </MDButton>
          </DialogActions>
        </Dialog>

        <Dialog open={editUserOpen} onClose={() => setEditUserOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit User</DialogTitle>

          <DialogContent>
            <MDBox pt={2}>
              <MDInput
                label="Name"
                fullWidth
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    name: e.target.value,
                  })
                }
              />
            </MDBox>

            <MDBox pt={2}>
              <MDInput label="Email" fullWidth value={userForm.email} disabled />
            </MDBox>

            <MDBox pt={2}>
              <MDInput
                type="password"
                label="New Password"
                fullWidth
                placeholder="Leave blank to keep current password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    password: e.target.value,
                  })
                }
              />
            </MDBox>
          </DialogContent>

          <DialogActions>
            <MDButton variant="outlined" color="dark" onClick={() => setEditUserOpen(false)}>
              Cancel
            </MDButton>

            <MDButton
              variant="gradient"
              color="info"
              onClick={handleUpdateUser}
              disabled={actionLoading}
            >
              {actionLoading ? "Updating..." : "Update User"}
            </MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Users;
