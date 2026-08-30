/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import { useState } from "react";

const ProjectActions = ({ project, onDetails, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isManager = JSON.parse(localStorage.getItem("user"))?.role === "Manager";

  return (
    <>
      <MDTypography component="a" color="text" sx={{ cursor: "pointer" }} onClick={handleOpen}>
        <Icon>more_vert</Icon>
      </MDTypography>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onDetails(project);
          }}
        >
          Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onEdit(project);
          }}
        >
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onDelete(project);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default function data(projects = [], onDetails, onEdit, onDelete) {
  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />

      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>

      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

  const getProgressColor = (progress) => {
    if (progress === 100) {
      return "success";
    }

    if (progress === 0) {
      return "error";
    }

    return "info";
  };

  const getStatus = (project) => {
    if (project.status) {
      return project.status;
    }

    if (project.progress === 100) {
      return "done";
    }

    if (project.progress === 0) {
      return "pending";
    }

    return "working";
  };

  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  const isManager = JSON.parse(localStorage.getItem("user"))?.role === "Manager";
  return {
    columns: [
      {
        Header: "project",
        accessor: "project",
        width: "30%",
        align: "left",
      },
      {
        Header: "deadline",
        accessor: "deadline",
        align: "left",
      },
      {
        Header: "status",
        accessor: "status",
        align: "center",
      },
      {
        Header: "completion",
        accessor: "completion",
        align: "center",
      },
      {
        Header: "action",
        accessor: "action",
        align: "center",
      },
    ],

    rows: projects.map((project) => {
      const progress = project.progress || 0;
      const status = getStatus(project);

      return {
        project: <Project image={project.image} name={project.title} />,

        deadline: (
          <MDTypography variant="button" color="text" fontWeight="medium">
            {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}
          </MDTypography>
        ),

        status: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {status}
          </MDTypography>
        ),

        completion: <Progress color={getProgressColor(progress)} value={progress} />,

        action: (
          <>
            <ProjectActions
              project={project}
              onDetails={onDetails}
              onEdit={onEdit}
              onDelete={onDelete}
            />

            <Menu
              id="simple-menu"
              anchorEl={menu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(menu)}
              onClose={closeMenu}
            >
              <MenuItem onClick={closeMenu}>Details</MenuItem>
              {isManager && <MenuItem onClick={closeMenu}>Edit</MenuItem>}
              {isManager && <MenuItem onClick={closeMenu}>Delete</MenuItem>}
            </Menu>
          </>
        ),
      };
    }),
  };
}
