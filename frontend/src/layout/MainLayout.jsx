import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_PERMISSIONS, ROLES } from "../config/roles";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div>Loading...</div>;

  const permissions = ROLE_PERMISSIONS[user.role];

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">

        <div className="p-6 text-xl font-bold text-blue-600 border-b">
          HRMS
        </div>

        <nav className="flex-1 p-4 space-y-2">

          {permissions.employees && (
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Employees
            </NavLink>
          )}

          {permissions.attendance && (
            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Attendance
            </NavLink>
          )}

          {permissions.leaves && (
            <NavLink
              to="/leaves"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
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
                `block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Reports
            </NavLink>
          )}

          {user.role === ROLES.EMPLOYEE && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              My Profile
            </NavLink>
          )}
        </nav>

      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.role}</span>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;