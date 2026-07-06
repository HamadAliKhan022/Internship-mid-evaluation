import { Box, Typography } from "@mui/material";

import FormTextField from "../forms/FormTextField";
import ProjectCategoryField from "./ProjectCategoryField";

function ProjectCategoryStep({ control, trigger }) {
  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Typography variant="h6" color="text.primary">
        Category and Basic Details
      </Typography>

      <ProjectCategoryField control={control} trigger={trigger} />

      <FormTextField
        name="title"
        control={control}
        trigger={trigger}
        label="Project Title"
        rules={{
          required: "Project title is required.",
          validate: (value) =>
            value.trim().length >= 3 ||
            "Enter at least 3 characters."
        }}
      />

      <FormTextField
        name="shortDescription"
        control={control}
        trigger={trigger}
        label="Short Description"
        multiline
        rows={4}
        rules={{
          required: "Short description is required.",
          validate: (value) =>
            value.trim().length >= 10 ||
            "Enter at least 10 characters."
        }}
      />
    </Box>
  );
}

export default ProjectCategoryStep;
