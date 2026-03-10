import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./config/roles";
import Reports from "./pages/Reports";
import Profile from "./pages/Profie";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN", "HR_ADMIN"]}>
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN", "HR_ADMIN", "MANAGER", "EMPLOYEE"]}>
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaves"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN", "HR_ADMIN", "MANAGER", "EMPLOYEE"]}>
                <Leaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.HR_ADMIN, ROLES.SUPER_ADMIN]}
              >
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
