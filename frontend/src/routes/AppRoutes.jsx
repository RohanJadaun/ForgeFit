import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loadUser } from "../store/slices/authSlice";

import ProtectedRoute from "../components/routing/ProtectedRoute";

const Landing = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const LegalPage = lazy(() => import("../pages/LegalPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Workouts = lazy(() => import("../pages/Workouts"));
const Nutrition = lazy(() => import("../pages/Nutrition"));
const Progress = lazy(() => import("../pages/Progress"));
const AICoach = lazy(() => import("../pages/AICoach"));
const Profile = lazy(() => import("../pages/Profile"));
const WorkoutDetails = lazy(() => import("../pages/WorkoutDetails"));

function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-600" role="status">Loading ForgeFit...</div>}>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route path="/privacy" element={<LegalPage />} />
        <Route path="/terms" element={<LegalPage />} />

        {/* Protected Application Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Workouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workouts/:id"
          element={
            <ProtectedRoute>
              <WorkoutDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <Nutrition />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-coach"
          element={
            <ProtectedRoute>
              <AICoach />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div className="flex min-h-screen items-center justify-center text-slate-600">Page not found.</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
