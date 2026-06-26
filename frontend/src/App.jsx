import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TopicPage from "./pages/TopicPage";

// Protect routes — redirect to login if not authenticated
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Redirect logged-in users away from login page
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route
      path="/login"
      element={<PublicRoute><LoginPage /></PublicRoute>}
    />
    <Route
      path="/dashboard"
      element={<PrivateRoute><DashboardPage /></PrivateRoute>}
    />
    <Route
      path="/topic/:id"
      element={<PrivateRoute><TopicPage /></PrivateRoute>}
    />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
