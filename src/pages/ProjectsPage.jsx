import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import PageHeading from "../components/PageHeading";
import StatusChip from "../components/StatusChip";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";

function ProjectsPage() {
  const navigate = useNavigate();
  const { user, userProfile, role } = useAuth();

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [actionProjectId, setActionProjectId] = useState("");

  const isAdmin = role === "admin";

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const projectsReference = collection(db, "projects");

    const projectsQuery = isAdmin
      ? query(projectsReference)
      : query(projectsReference, where("ownerId", "==", user.uid));

    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const projectList = snapshot.docs.map((projectDocument) => ({
          id: projectDocument.id,
          ...projectDocument.data(),
        }));

        projectList.sort((firstProject, secondProject) => {
          const firstTime = firstProject.createdAt?.seconds || 0;
          const secondTime = secondProject.createdAt?.seconds || 0;

          return secondTime - firstTime;
        });

        setProjects(projectList);
        setErrorMessage("");
      },
      (error) => {
        console.error("Unable to load projects:", error);
        setErrorMessage("Unable to load projects. Please refresh the page.");
      },
    );

    return () => unsubscribe();
  }, [isAdmin, user]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return projects;
    }

    return projects.filter((project) =>
      project.title?.toLowerCase().includes(normalizedSearch),
    );
  }, [projects, searchTerm]);

  const handleReview = async (projectId, approvalStatus) => {
    try {
      setActionProjectId(projectId);

      await updateDoc(doc(db, "projects", projectId), {
        approvalStatus,
        reviewedAt: serverTimestamp(),
        reviewedBy: user.uid,
      });

      setErrorMessage("");
    } catch (error) {
      console.error("Unable to review project:", error);
      setErrorMessage("Unable to update project approval status.");
    } finally {
      setActionProjectId("");
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1.2,
      minWidth: 175,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 145,
    },
  ];

  if (isAdmin) {
    columns.push({
      field: "owner",
      headerName: "Owner",
      flex: 1.15,
      minWidth: 185,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Typography variant="body2" color="text.primary" noWrap>
            {params.row.ownerName || "Unknown User"}
          </Typography>

          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.ownerEmail || "No email"}
          </Typography>
        </Box>
      ),
    });
  }

  columns.push(
    {
      field: "techStack",
      headerName: "Tech Stack",
      flex: 1.2,
      minWidth: 170,
      valueGetter: (value) =>
        Array.isArray(value) ? value.join(", ") : value || "—",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: "approvalStatus",
      headerName: "Approval",
      flex: 0.95,
      minWidth: 135,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      minWidth: isAdmin ? 250 : 110,
      renderCell: (params) => {
        const isPending = params.row.approvalStatus === "pending";
        const isUpdating = actionProjectId === params.row.id;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              height: "100%",
            }}
          >
            <Button
              size="small"
              color="primary"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => navigate(`/projects/${params.row.id}`)}
            >
              View
            </Button>

            {isAdmin && isPending && (
              <>
                <Button
                  size="small"
                  color="success"
                  startIcon={<CheckCircleOutlinedIcon />}
                  disabled={isUpdating}
                  onClick={() => handleReview(params.row.id, "approved")}
                >
                  Approve
                </Button>

                <Button
                  size="small"
                  color="error"
                  startIcon={<CancelOutlinedIcon />}
                  disabled={isUpdating}
                  onClick={() => handleReview(params.row.id, "rejected")}
                >
                  Reject
                </Button>
              </>
            )}
          </Box>
        );
      },
    },
  );

  return (
    <>
      <PageHeading
        title="Projects"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Projects" },
        ]}
        action={
          !isAdmin ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/projects/new")}
            >
              Add Project
            </Button>
          ) : null
        }
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2.5,
          }}
        >
          <TextField
            size="small"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title"
            InputProps={{
              startAdornment: (
                <SearchOutlinedIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
              ),
            }}
            sx={{ width: { xs: "100%", sm: 320 } }}
          />

          <Typography variant="body2" color="text.secondary">
            {isAdmin
              ? "Viewing all submitted projects"
              : `Viewing projects submitted by ${userProfile?.name || "you"}`}
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={filteredProjects}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 5,
                },
              },
            }}
            localeText={{
              noRowsLabel: "No projects found.",
            }}
          />
        </Box>
      </Paper>
    </>
  );
}

export default ProjectsPage;
