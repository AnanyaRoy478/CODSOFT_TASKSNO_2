/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// PROJECT MANAGEMENT components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

export default function data(tasks = []) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";

      case "In Progress":
        return "info";

      case "Pending":
        return "warning";

      case "Cancelled":
        return "error";

      default:
        return "dark";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";

      case "Medium":
        return "warning";

      case "Low":
        return "success";

      default:
        return "dark";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    return new Date(date).toLocaleDateString();
  };

  return {
    columns: [
      {
        Header: "task",
        accessor: "task",
        width: "25%",
        align: "left",
      },
      {
        Header: "project",
        accessor: "project",
        align: "left",
      },
      {
        Header: "assigned to",
        accessor: "assignedTo",
        align: "left",
      },
      {
        Header: "priority",
        accessor: "priority",
        align: "center",
      },
      {
        Header: "status",
        accessor: "status",
        align: "center",
      },
      {
        Header: "due date",
        accessor: "dueDate",
        align: "center",
      },
    ],

    rows: tasks.map((task) => ({
      task: (
        <MDBox lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {task.title}
          </MDTypography>

          <MDTypography variant="caption">{task.description || "No description"}</MDTypography>
        </MDBox>
      ),

      project: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {task.project?.title || "No project"}
        </MDTypography>
      ),

      assignedTo: (
        <MDBox lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {task.assignedTo?.name || "Unassigned"}
          </MDTypography>

          {task.assignedTo?.email && (
            <MDTypography variant="caption">{task.assignedTo.email}</MDTypography>
          )}
        </MDBox>
      ),

      priority: (
        <MDBadge
          badgeContent={task.priority || "Low"}
          color={getPriorityColor(task.priority)}
          variant="gradient"
          size="sm"
        />
      ),

      status: (
        <MDBadge
          badgeContent={task.status || "Pending"}
          color={getStatusColor(task.status)}
          variant="gradient"
          size="sm"
        />
      ),

      dueDate: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDate(task.dueDate)}
        </MDTypography>
      ),
    })),
  };
}
