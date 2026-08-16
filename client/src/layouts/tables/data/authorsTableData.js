/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// PROJECT MANAGEMENT components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

export default function data(users = []) {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />

      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>

        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const getStatus = (user) => {
    if (user.is_active === false) {
      return "inactive";
    }

    return "active";
  };

  const getStatusColor = (user) => {
    if (user.is_active === false) {
      return "dark";
    }

    return "success";
  };

  const formatRole = (role) => {
    if (!role) {
      return "User";
    }

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString();
  };

  return {
    columns: [
      {
        Header: "user",
        accessor: "user",
        width: "40%",
        align: "left",
      },
      {
        Header: "role",
        accessor: "role",
        align: "left",
      },
      {
        Header: "status",
        accessor: "status",
        align: "center",
      },
      {
        Header: "joined",
        accessor: "joined",
        align: "center",
      },
      {
        Header: "action",
        accessor: "action",
        align: "center",
      },
    ],

    rows: users.map((user) => ({
      user: <Author image={user.profileImage} name={user.name} email={user.email} />,

      role: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatRole(user.role)}
        </MDTypography>
      ),

      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={getStatus(user)}
            color={getStatusColor(user)}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),

      joined: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDate(user.createdAt)}
        </MDTypography>
      ),

      action: (
        <MDTypography
          component="a"
          href={`/users/${user._id}`}
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          View
        </MDTypography>
      ),
    })),
  };
}
