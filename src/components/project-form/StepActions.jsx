import { Box, Button } from "@mui/material";

function StepActions({
  currentStep,
  isSubmitting,
  onBack,
  onNext
}) {
  const isReviewStep = currentStep === 2;
  const showBackButton = currentStep > 0;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: showBackButton ? "space-between" : "flex-end",
        gap: 1.5,
        mt: 4
      }}
    >
      {showBackButton && (
        <Button type="button" variant="outlined" onClick={onBack}>
          Back
        </Button>
      )}

      {isReviewStep ? (
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Project"}
        </Button>
      ) : (
        <Button type="button" variant="contained" onClick={onNext}>
          Next
        </Button>
      )}
    </Box>
  );
}

export default StepActions;
