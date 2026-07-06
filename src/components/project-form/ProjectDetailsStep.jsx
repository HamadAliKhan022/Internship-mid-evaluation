import { Box, Typography } from "@mui/material";

import FormDateField from "../forms/FormDateField";
import FormSelectField from "../forms/FormSelectField";
import FormTextField from "../forms/FormTextField";
import TechStackField from "./TechStackField";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in progress" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on hold" }
];

function ProjectDetailsStep({
  control,
  trigger,
  category,
  startDate
}) {
  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Typography variant="h6" color="text.primary">
        Project Details
      </Typography>

      <TechStackField
        control={control}
        trigger={trigger}
        category={category}
      />

      <FormSelectField
        name="status"
        control={control}
        trigger={trigger}
        label="Project Status"
        options={statusOptions}
        rules={{
          required: "Project status is required."
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr"
          },
          gap: 2.5
        }}
      >
        <FormDateField
          name="startDate"
          control={control}
          trigger={trigger}
          label="Start Date"
          rules={{
            required: "Start date is required."
          }}
        />

        <FormDateField
          name="endDate"
          control={control}
          trigger={trigger}
          label="End Date"
          rules={{
            required: "End date is required.",
            validate: (value) =>
              !startDate ||
              value >= startDate ||
              "End date cannot be before start date."
          }}
        />
      </Box>

      <FormTextField
        name="repoLink"
        control={control}
        trigger={trigger}
        label="Repository Link (Optional)"
        placeholder="https://github.com/username/project"
        rules={{
          validate: (value) =>
            !value ||
            /^https?:\/\/.+/i.test(value) ||
            "Enter a valid URL starting with http:// or https://"
        }}
      />

      <FormTextField
        name="demoLink"
        control={control}
        trigger={trigger}
        label="Demo Link (Optional)"
        placeholder="https://your-project-demo.com"
        rules={{
          validate: (value) =>
            !value ||
            /^https?:\/\/.+/i.test(value) ||
            "Enter a valid URL starting with http:// or https://"
        }}
      />
    </Box>
  );
}

export default ProjectDetailsStep;
