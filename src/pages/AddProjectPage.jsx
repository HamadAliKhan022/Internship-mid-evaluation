import { useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Step,
  StepLabel,
  Stepper
} from "@mui/material";
import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import PageHeading from "../components/PageHeading";
import ProjectCategoryStep from "../components/project-form/ProjectCategoryStep";
import ProjectDetailsStep from "../components/project-form/ProjectDetailsStep";
import ProjectReviewStep from "../components/project-form/ProjectReviewStep";
import StepActions from "../components/project-form/StepActions";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";

const steps = ["Category", "Details", "Review"];

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
    formState: { isSubmitting }
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
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
      demoLink: ""
    }
  });

  const category = watch("category");
  const startDate = watch("startDate");
  const formValues = watch();

  if (role === "admin") {
    return <Navigate to="/projects" replace />;
  }

  const validateCurrentStep = async () => {
    if (currentStep === 0) {
      return trigger(["category", "title", "shortDescription"], {
        shouldFocus: true
      });
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
              "demoLink"
            ]
          : [
              "techStack",
              "status",
              "startDate",
              "endDate",
              "repoLink",
              "demoLink"
            ];

      return trigger(fields, { shouldFocus: true });
    }

    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (isValid) {
      setCurrentStep((previousStep) => previousStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((previousStep) => previousStep - 1);
  };

  const submitProject = async (formData) => {
    try {
      setSubmitError("");

      const savedTechStack =
        formData.category === "Other"
          ? formData.otherTechStack.trim()
          : formData.techStack;

      await addDoc(collection(db, "projects"), {
        ownerId: user.uid,
        ownerName: userProfile?.name || "Unknown User",
        ownerEmail: userProfile?.email || user.email,
        title: formData.title.trim(),
        category: formData.category,
        shortDescription: formData.shortDescription.trim(),
        techStack: savedTechStack,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        repoLink: formData.repoLink.trim(),
        demoLink: formData.demoLink.trim(),
        approvalStatus: "pending",
        createdAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null
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
          { label: "Add" }
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
            <ProjectCategoryStep
              control={control}
              trigger={trigger}
            />
          )}

          {currentStep === 1 && (
            <ProjectDetailsStep
              control={control}
              trigger={trigger}
              category={category}
              startDate={startDate}
            />
          )}

          {currentStep === 2 && (
            <ProjectReviewStep formValues={formValues} />
          )}

          <StepActions
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            onBack={handleBack}
            onNext={handleNext}
          />
        </Box>
      </Paper>
    </>
  );
}

export default AddProjectPage;
