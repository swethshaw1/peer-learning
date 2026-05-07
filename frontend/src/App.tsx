import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider, useUser } from "./context/UserContext";
import { CohortProvider } from "./context/CohortContext";
import { ProjectProvider } from "./context/ProjectContext";

// Components
import Layout from "./components/Layout";

// Root Pages
import Dashboard from "./pages/dashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import LandingPage from "./pages/LandingPage";

// LMS Pages
import BookmarksPage from "./pages/lms/BookmarksPage";
import CourseDetailPage from "./pages/lms/CourseDetailPage";
import CoursesPage from "./pages/lms/CoursesPage";
import LMSDashboardPage from "./pages/lms/DashboardPage";
import DiscussionDetailPage from "./pages/lms/DiscussionDetailPage";
import DiscussionPage from "./pages/lms/DiscussionPage";
import LMSLeaderboardPage from "./pages/lms/LeaderboardPage";

// Project Pages
import ExploreProjects from "./pages/project/pages/ExploreProjects";
import ProjectDashboard from "./pages/project/pages/ProjectDashboard";
import ProjectDetail from "./pages/project/pages/ProjectDetail";

// Quiz Pages
import ActiveQuizPage from "./pages/quiz/ActiveQuizPage";
import CreatePaperPage from "./pages/quiz/CreatePaperPage";
import DiscussionForum from "./pages/quiz/DiscussionForum";
import LearningPage from "./pages/quiz/LearningPage";
import PeerQuizPage from "./pages/quiz/PeerQuizPage";
import ProctorDashboardPage from "./pages/quiz/ProctorDashboardPage";
import QuizConfigPage from "./pages/quiz/QuizConfigPage";
import QuizLobbyPage from "./pages/quiz/QuizLobbyPage";
import ResultDetailPage from "./pages/quiz/ResultDetailPage";
import ResultsPage from "./pages/quiz/ResultsPage";
import QuizLeaderboardPage from "./pages/quiz/leaderboardpage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthLoading } = useUser();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F172A]">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthLoading } = useUser();

  if (isAuthLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};


export default function App() {
  useEffect(() => {
    // Cleanup legacy auth keys
    localStorage.removeItem('lms_token');
    localStorage.removeItem('quiz_user_id');
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <CohortProvider>
          <ProjectProvider>
            <BrowserRouter>
              <Toaster position="top-right" />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes (with Sidebar) */}
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="help" element={<HelpCenterPage />} />

                  {/* LMS Routes */}
                  <Route path="course" element={<CoursesPage />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="course/:id" element={<CourseDetailPage />} />
                  <Route path="courses/:id" element={<CourseDetailPage />} />
                  <Route path="bookmarks" element={<BookmarksPage />} />
                  <Route path="lms-dashboard" element={<LMSDashboardPage />} />
                  <Route path="lms" element={<LMSDashboardPage />} />
                  <Route path="discussions" element={<DiscussionPage />} />
                  <Route path="discussion" element={<DiscussionPage />} />
                  <Route path="discussion/:id" element={<DiscussionDetailPage />} />
                  <Route path="discussions/:id" element={<DiscussionDetailPage />} />
                  <Route path="lms-leaderboard" element={<LMSLeaderboardPage />} />

                  {/* Project Routes */}
                  <Route path="project" element={<ProjectDashboard />} />
                  <Route path="project/explore" element={<ExploreProjects />} />
                  <Route path="project/:id" element={<ProjectDetail />} />
                  <Route path="explore-projects" element={<ExploreProjects />} />
                  <Route path="project-dashboard" element={<ProjectDashboard />} />

                  {/* Quiz Routes */}
                  <Route path="learning" element={<LearningPage />} />
                  <Route path="peer-quiz" element={<PeerQuizPage />} />
                  <Route path="results" element={<ResultsPage />} />
                  <Route path="results/:resultId" element={<ResultDetailPage />} />
                  <Route path="create-paper/:topicId" element={<CreatePaperPage />} />
                  <Route path="config/:topicId" element={<QuizConfigPage />} />
                  <Route path="proctor/:roomCode" element={<ProctorDashboardPage />} />
                  <Route path="forum" element={<DiscussionForum />} />
                  <Route path="quiz-leaderboard" element={<QuizLeaderboardPage />} />
                </Route>

                {/* Quiz Fullscreen Routes */}
                <Route
                  path="/lobby/:topicId"
                  element={
                    <ProtectedRoute>
                      <QuizLobbyPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:topicId"
                  element={
                    <ProtectedRoute>
                      <ActiveQuizPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ProjectProvider>
        </CohortProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
