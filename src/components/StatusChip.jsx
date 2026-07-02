import { Chip } from "@mui/material";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "warning",
  },
  approved: {
    label: "Approved",
    color: "success",
  },
  rejected: {
    label: "Rejected",
    color: "error",
  },
  "in progress": {
    label: "In Progress",
    color: "info",
  },
  completed: {
    label: "Completed",
    color: "success",
  },
  "on hold": {
    label: "On Hold",
    color: "warning",
  },
};

function StatusChip({ status }) {
  const normalizedStatus = String(status || "").toLowerCase();
  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    color: "default",
  };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    />
  );
}

export default StatusChip;
