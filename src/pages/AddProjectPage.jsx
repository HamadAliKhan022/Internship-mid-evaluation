import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import FormSelectField from "../components/FormSelectField";
import FormTextField from "../components/FormTextField";
import PageHeading from "../components/PageHeading";
import StatusChip from "../components/StatusChip";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";

const steps = ["Category", "Details", "Review"];

const categoryOptions = [
  { label: "Web Development", value: "Web Development" },
  { label: "Mobile App", value: "Mobile App" },
  { label: "UI/UX Design", value: "UI/UX Design" },
  { label: "Data Science", value: "Data Science" },
  { label: "Other", value: "Other" },
];

const statusOptions = [
  { label: "In Progress", value: "in progress" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on hold" },
];

const technologyOptions = {
  "Web Development": [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "TypeScript",
  ],
  "Mobile App": [
    "React Native",
    "Flutter",
    "Firebase",
    "Expo",
    "Android",
    "iOS",
  ],
  "UI/UX Design": ["Figma", "Adobe XD", "Sketch", "Protopie", "Framer"],
  "Data Science": [
    "Python",
    "R",
    "Pandas",
    "NumPy",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Jupyter",
  ],
};

function AddProjectPage() {
  const navigate = useNavigate();
  const { user, userProfile, role } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: "",
      title: "",
      shortDescription: "",
      techStack: [],
      otherTechStack: "",
      status: "",
      startDate: "",
      endDate: "",
      repoLink: "",
      demoLink: "",
    },
  });

  const category = watch("category");
  const formValues = watch();

  const categoryTechnologies = useMemo(
    () => technologyOptions[category] || [],
    [category],
  );

  if (role === "admin") {
    return <Navigate to="/projects" replace />;
  }

  const validateStep = async () => {
    if (currentStep === 0) {
      return trigger(["category", "title", "shortDescription"]);
    }

    if (currentStep === 1) {
      const fields =
        category === "Other"
          ? [
              "otherTechStack",
              "status",
              "startDate",
              "endDate",
              "repoLink",
              "demoLink",
            ]
          : [
              "techStack",
              "status",
              "startDate",
              "endDate",
              "repoLink",
              "demoLink",
            ];

      return trigger(fields);
    }

    return true;
  };

  const handleNext = async () => {
    const isStepValid = await validateStep();

    if (isStepValid) {
      setCurrentStep((previousStep) => previousStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((previousStep) => previousStep - 1);
  };

  const submitProject = async (data) => {
    try {
      setSubmitError("");

      const savedTechStack =
        data.category === "Other" ? data.otherTechStack.trim() : data.techStack;

      await addDoc(collection(db, "projects"), {
        ownerId: user.uid,
        ownerName: userProfile?.name || "Unknown User",
        ownerEmail: userProfile?.email || user.email,
        title: data.title.trim(),
        category: data.category,
        shortDescription: data.shortDescription.trim(),
        techStack: savedTechStack,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        repoLink: data.repoLink.trim(),
        demoLink: data.demoLink.trim(),
        approvalStatus: "pending",
        createdAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
      });

      navigate("/projects", { replace: true });
    } catch (error) {
      console.error("Unable to save project:", error);
      setSubmitError("Unable to submit the project. Please try again.");
    }
  };

  return (
    <>
      <PageHeading
        title="Add Project"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Projects", path: "/projects" },
          { label: "Add" },
        ]}
      />

      <Paper sx={{ maxWidth: 900, p: { xs: 2, sm: 3, md: 4 } }}>
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          sx={{ mb: { xs: 4, sm: 5 } }}
        >
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(submitProject)} noValidate>
          {currentStep === 0 && (
            <Box sx={{ display: "grid", gap: 2.5 }}>
              <Typography variant="h6" color="text.primary">
                Category and Basic Details
              </Typography>

              <FormSelectField
                name="category"
                control={control}
                label="Project Category"
                rules={{
                  required: "Project category is required.",
                }}
                options={categoryOptions}
              />

              <FormTextField
                name="title"
                control={control}
                label="Project Title"
                rules={{
                  required: "Project title is required.",
                  validate: (value) =>
                    value.trim().length >= 3 || "Enter at least 3 characters.",
                }}
              />

              <FormTextField
                name="shortDescription"
                control={control}
                label="Short Description"
                multiline
                rows={4}
                rules={{
                  required: "Short description is required.",
                  validate: (value) =>
                    value.trim().length >= 10 ||
                    "Enter at least 10 characters.",
                }}
              />
            </Box>
          )}

          {currentStep === 1 && (
            <Box sx={{ display: "grid", gap: 2.5 }}>
              <Typography variant="h6" color="text.primary">
                Project Details
              </Typography>

              {category === "Other" ? (
                <FormTextField
                  name="otherTechStack"
                  control={control}
                  label="Tech Stack"
                  placeholder="Example: Laravel, MySQL, Bootstrap"
                  rules={{
                    required: "Tech stack is required.",
                    validate: (value) =>
                      value.trim().length >= 2 ||
                      "Enter your technology details.",
                  }}
                />
              ) : (
                <Controller
                  name="techStack"
                  control={control}
                  rules={{
                    validate: (value) =>
                      Array.isArray(value) && value.length > 0
                        ? true
                        : "Select at least one technology.",
                  }}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={Boolean(fieldState.error)}>
                      <InputLabel id="tech-stack-label">Tech Stack</InputLabel>

                      <Select
                        {...field}
                        labelId="tech-stack-label"
                        label="Tech Stack"
                        multiple
                        value={field.value || []}
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.75,
                            }}
                          >
                            {selected.map((technology) => (
                              <Chip
                                key={technology}
                                label={technology}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {categoryTechnologies.map((technology) => (
                          <MenuItem key={technology} value={technology}>
                            {technology}
                          </MenuItem>
                        ))}
                      </Select>

                      <FormHelperText>
                        {fieldState.error?.message ||
                          "Select one or more technologies."}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              )}

              <FormSelectField
                name="status"
                control={control}
                label="Project Status"
                rules={{
                  required: "Project status is required.",
                }}
                options={statusOptions}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2.5,
                }}
              >
                <FormTextField
                  name="startDate"
                  control={control}
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  rules={{
                    required: "Start date is required.",
                  }}
                />

                <FormTextField
                  name="endDate"
                  control={control}
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  rules={{
                    required: "End date is required.",
                    validate: (value) =>
                      !formValues.startDate ||
                      value >= formValues.startDate ||
                      "End date cannot be before start date.",
                  }}
                />
              </Box>

              <FormTextField
                name="repoLink"
                control={control}
                label="Repository Link (Optional)"
                placeholder="https://github.com/username/project"
                rules={{
                  validate: (value) =>
                    !value ||
                    /^https?:\/\/.+/i.test(value) ||
                    "Enter a valid URL starting with http:// or https://",
                }}
              />

              <FormTextField
                name="demoLink"
                control={control}
                label="Demo Link (Optional)"
                placeholder="https://your-project-demo.com"
                rules={{
                  validate: (value) =>
                    !value ||
                    /^https?:\/\/.+/i.test(value) ||
                    "Enter a valid URL starting with http:// or https://",
                }}
              />
            </Box>
          )}

          {currentStep === 2 && (
            <Box>
              <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
                Review Your Project
              </Typography>

              <Box
                sx={(theme) => ({
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "minmax(150px, 0.4fr) 1fr",
                  },
                  gap: 2,
                  p: { xs: 2, sm: 3 },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: theme.palette.background.default,
                })}
              >
                <Typography color="text.secondary">Category</Typography>
                <Typography color="text.primary" fontWeight={600}>
                  {formValues.category}
                </Typography>

                <Typography color="text.secondary">Title</Typography>
                <Typography color="text.primary" fontWeight={600}>
                  {formValues.title}
                </Typography>

                <Typography color="text.secondary">
                  Short Description
                </Typography>
                <Typography color="text.primary">
                  {formValues.shortDescription}
                </Typography>

                <Typography color="text.secondary">Tech Stack</Typography>
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {Array.isArray(formValues.techStack)
                    ? formValues.techStack.map((technology) => (
                        <Chip
                          key={technology}
                          label={technology}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    : null}

                  {formValues.category === "Other" && (
                    <Typography color="text.primary">
                      {formValues.otherTechStack}
                    </Typography>
                  )}
                </Box>

                <Typography color="text.secondary">Status</Typography>
                <Box>
                  <StatusChip status={formValues.status} />
                </Box>

                <Typography color="text.secondary">Start Date</Typography>
                <Typography color="text.primary">
                  {formValues.startDate}
                </Typography>

                <Typography color="text.secondary">End Date</Typography>
                <Typography color="text.primary">
                  {formValues.endDate}
                </Typography>

                <Typography color="text.secondary">Repository Link</Typography>
                <Typography color="text.primary">
                  {formValues.repoLink || "Not provided"}
                </Typography>

                <Typography color="text.secondary">Demo Link</Typography>
                <Typography color="text.primary">
                  {formValues.demoLink || "Not provided"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1.5,
              mt: 4,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={
                currentStep === 0 ? () => navigate("/projects") : handleBack
              }
            >
              {currentStep === 0 ? "Cancel" : "Back"}
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </>
  );
}

export default AddProjectPage;
