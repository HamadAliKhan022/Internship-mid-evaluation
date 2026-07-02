import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

import PageHeading from "../components/PageHeading";
import StatusChip from "../components/StatusChip";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";

function DetailRow({ label, children }) {
  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "180px 1fr",
        },
        gap: 1,
        py: 1.75,
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Box>{children}</Box>
    </Box>
  );
}

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const isAdmin = role === "admin";

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoadingProject(true);
        setErrorMessage("");

        const projectDocument = await getDoc(doc(db, "projects", id));

        if (!projectDocument.exists()) {
          setErrorMessage("This project was not found.");
          setProject(null);
          return;
        }

        setProject({
          id: projectDocument.id,
          ...projectDocument.data(),
        });
      } catch (error) {
        console.error("Unable to load project:", error);
        setErrorMessage(
          "You do not have permission to view this project or it no longer exists.",
        );
      } finally {
        setLoadingProject(false);
      }
    };

    loadProject();
  }, [id]);

  const handleReview = async (approvalStatus) => {
    try {
      setReviewLoading(true);
      setErrorMessage("");

      await updateDoc(doc(db, "projects", id), {
        approvalStatus,
        reviewedAt: serverTimestamp(),
        reviewedBy: user.uid,
      });

      setProject((currentProject) => ({
        ...currentProject,
        approvalStatus,
      }));
    } catch (error) {
      console.error("Unable to review project:", error);
      setErrorMessage("Unable to update project approval status.");
    } finally {
      setReviewLoading(false);
    }
  };

  const techStackItems = Array.isArray(project?.techStack)
    ? project.techStack
    : project?.techStack
      ? [project.techStack]
      : [];

  if (loadingProject) {
    return (
      <Box
        sx={{
          minHeight: 360,
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage && !project) {
    return (
      <>
        <PageHeading
          title="Project Details"
          breadcrumbs={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Projects", path: "/projects" },
            { label: "Project" },
          ]}
        />

        <Alert severity="error" sx={{ mb: 2.5 }}>
          {errorMessage}
        </Alert>

        <Button variant="outlined" onClick={() => navigate("/projects")}>
          Back to Projects
        </Button>
      </>
    );
  }

  return (
    <>
      <PageHeading
        title={project.title}
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Projects", path: "/projects" },
          { label: project.title },
        ]}
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {errorMessage}
        </Alert>
      )}

      <Card sx={{ maxWidth: 920 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" color="text.primary">
                {project.title}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {project.category}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <StatusChip status={project.status} />
              <StatusChip status={project.approvalStatus} />
            </Stack>
          </Stack>

          <Divider />

          <DetailRow label="Short Description">
            <Typography color="text.primary">
              {project.shortDescription}
            </Typography>
          </DetailRow>

          <DetailRow label="Tech Stack">
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
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
                <Typography color="text.secondary">Not provided</Typography>
              )}
            </Stack>
          </DetailRow>

          <DetailRow label="Project Status">
            <StatusChip status={project.status} />
          </DetailRow>

          <DetailRow label="Approval Status">
            <StatusChip status={project.approvalStatus} />
          </DetailRow>

          <DetailRow label="Start Date">
            <Typography color="text.primary">
              {project.startDate || "Not provided"}
            </Typography>
          </DetailRow>

          <DetailRow label="End Date">
            <Typography color="text.primary">
              {project.endDate || "Not provided"}
            </Typography>
          </DetailRow>

          <DetailRow label="Repository Link">
            {project.repoLink ? (
              <Link
                href={project.repoLink}
                target="_blank"
                rel="noreferrer"
                color="primary.main"
              >
                Open Repository
              </Link>
            ) : (
              <Typography color="text.secondary">Not provided</Typography>
            )}
          </DetailRow>

          <DetailRow label="Demo Link">
            {project.demoLink ? (
              <Link
                href={project.demoLink}
                target="_blank"
                rel="noreferrer"
                color="primary.main"
              >
                Open Live Demo
              </Link>
            ) : (
              <Typography color="text.secondary">Not provided</Typography>
            )}
          </DetailRow>

          {isAdmin && (
            <>
              <DetailRow label="Owner Name">
                <Typography color="text.primary">
                  {project.ownerName || "Not available"}
                </Typography>
              </DetailRow>

              <DetailRow label="Owner Email">
                <Typography color="text.primary">
                  {project.ownerEmail || "Not available"}
                </Typography>
              </DetailRow>
            </>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              mt: 3.5,
            }}
          >
            <Button variant="outlined" onClick={() => navigate("/projects")}>
              Back to Projects
            </Button>

            {isAdmin && project.approvalStatus === "pending" && (
              <Stack direction="row" spacing={1.25}>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={reviewLoading}
                  onClick={() => handleReview("rejected")}
                >
                  Reject
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  disabled={reviewLoading}
                  onClick={() => handleReview("approved")}
                >
                  Approve
                </Button>
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default ProjectDetailPage;
