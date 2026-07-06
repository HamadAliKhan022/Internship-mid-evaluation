import { Box, Chip, Typography } from "@mui/material";

import StatusChip from "../StatusChip";
import ReviewRow from "./ReviewRow";

function ProjectReviewStep({ formValues }) {
  const techStackItems = Array.isArray(formValues.techStack)
    ? formValues.techStack
    : [];

  return (
    <Box>
      <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
        Review Your Project
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(150px, 0.4fr) 1fr"
          },
          gap: 2,
          px: { xs: 0, sm: 0 },
          py: 1
        }}
      >
        <ReviewRow label="Category">
          {formValues.category}
        </ReviewRow>

        <ReviewRow label="Title">
          {formValues.title}
        </ReviewRow>

        <ReviewRow label="Short Description">
          {formValues.shortDescription}
        </ReviewRow>

        <ReviewRow label="Tech Stack">
          {formValues.category === "Other" ? (
            formValues.otherTechStack || "Not provided"
          ) : (
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {techStackItems.length > 0 ? (
                techStackItems.map((technology) => (
                  <Chip
                    key={technology}
                    label={technology}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography color="text.secondary">
                  Not provided
                </Typography>
              )}
            </Box>
          )}
        </ReviewRow>

        <ReviewRow label="Status">
          <StatusChip status={formValues.status} />
        </ReviewRow>

        <ReviewRow label="Start Date">
          {formValues.startDate}
        </ReviewRow>

        <ReviewRow label="End Date">
          {formValues.endDate}
        </ReviewRow>

        <ReviewRow label="Repository Link">
          {formValues.repoLink || "Not provided"}
        </ReviewRow>

        <ReviewRow label="Demo Link">
          {formValues.demoLink || "Not provided"}
        </ReviewRow>
      </Box>
    </Box>
  );
}

export default ProjectReviewStep;
