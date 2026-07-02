import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Grid, Skeleton, Typography } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import DashboardChart from "../components/DashboardChart";
import PageHeading from "../components/PageHeading";
import SummaryCard from "../components/SummaryCard";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";

const categories = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Data Science",
  "Other",
];

function DashboardPage() {
  const { user, role } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const isAdmin = role === "admin";

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    setLoadingProjects(true);

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

        setProjects(projectList);
        setErrorMessage("");
        setLoadingProjects(false);
      },
      (error) => {
        console.error("Unable to load dashboard projects:", error);
        setErrorMessage(
          "Unable to load dashboard data. Please refresh the page.",
        );
        setLoadingProjects(false);
      },
    );

    return () => unsubscribe();
  }, [isAdmin, user]);

  const dashboardData = useMemo(() => {
    const totalProjects = projects.length;

    const inProgress = projects.filter(
      (project) => project.status === "in progress",
    ).length;

    const completed = projects.filter(
      (project) => project.status === "completed",
    ).length;

    const categoryCounts = categories.reduce((result, category) => {
      result[category] = 0;
      return result;
    }, {});

    projects.forEach((project) => {
      if (categoryCounts[project.category] !== undefined) {
        categoryCounts[project.category] += 1;
      }
    });

    const chartData = categories.map((category) => ({
      category,
      projects: categoryCounts[category],
    }));

    const highestCategory = chartData.reduce(
      (currentHighest, currentCategory) =>
        currentCategory.projects > currentHighest.projects
          ? currentCategory
          : currentHighest,
      {
        category: "No projects yet",
        projects: 0,
      },
    );

    return {
      totalProjects,
      inProgress,
      completed,
      topCategory:
        highestCategory.projects > 0
          ? highestCategory.category
          : "No projects yet",
      chartData,
    };
  }, [projects]);

  if (loadingProjects) {
    return (
      <>
        <PageHeading title="Overview" />

        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} lg={3} key={item}>
              <Skeleton variant="rounded" height={160} />
            </Grid>
          ))}
        </Grid>

        <Skeleton variant="rounded" height={380} />
      </>
    );
  }

  return (
    <>
      <PageHeading title="Overview" />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Total Projects"
            value={dashboardData.totalProjects}
            helperText={
              isAdmin ? "All submitted projects" : "Your submitted projects"
            }
            tone="primary"
            icon={<FolderOutlinedIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Projects In Progress"
            value={dashboardData.inProgress}
            helperText="Currently being developed"
            tone="info"
            icon={<ScheduleOutlinedIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Projects Completed"
            value={dashboardData.completed}
            helperText="Successfully completed"
            tone="success"
            icon={<TaskAltOutlinedIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Top Category"
            value={dashboardData.topCategory}
            helperText="Most submitted category"
            tone="warning"
            icon={<CategoryOutlinedIcon />}
          />
        </Grid>
      </Grid>

      {dashboardData.totalProjects === 0 ? (
        <Box
          sx={{
            py: 7,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.primary">
            No projects available yet
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Add a project to see your real dashboard summary and category chart.
          </Typography>
        </Box>
      ) : (
        <DashboardChart data={dashboardData.chartData} />
      )}
    </>
  );
}

export default DashboardPage;
