import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_PERMISSIONS } from "../config/roles";
import { ROLES } from "../config/roles";

const MainLayout = () => {
  const { user } = useAuth();
  const permissions = ROLE_PERMISSIONS[user.role];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8 items-center">
          <h1 className="font-bold text-xl text-blue-600">
            HRMS
          </h1>

          {permissions.employees && (
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              Employees
            </NavLink>
          )}

          {permissions.attendance && (
            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              Attendance
            </NavLink>
          )}

          {permissions.leaves && (
            <NavLink
              to="/leaves"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              Leaves
            </NavLink>
          )}

          {(user.role === ROLES.HR_ADMIN ||
            user.role === ROLES.SUPER_ADMIN) && (
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              Reports
            </NavLink>
          )}

          {user.role === ROLES.EMPLOYEE && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-600 hover:text-blue-600"
              }
            >
              My Profile
            </NavLink>
          )}

          <span className="ml-auto text-sm text-gray-600">
            {user.role}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
