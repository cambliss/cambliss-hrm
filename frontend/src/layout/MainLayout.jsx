import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_PERMISSIONS, ROLES } from "../config/roles";

// ── Icon primitives (inline SVG — no extra dependency) ──────────────────────
const Icon = ({ path, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  employees: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4 10v-1.5a3 3 0 0 0-3-3",
  attendance: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
  worklogs: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  leaves: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  reports: "M9 17v-5m3 5v-8m3 8v-3M4 21h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1z",
  profile: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1",
};

// ── Nav item ─────────────────────────────────────────────────────────────────
const SideNavLink = ({ to, end = false, icon, label }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      [
        "group flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-medium tracking-widest uppercase transition-all duration-150",
        isActive
          ? "bg-[#C9A227]/10 text-[#C9A227] border-l-2 border-[#C9A227] pl-[14px]"
          : "text-[#AAAAAA] hover:text-[#F8F5EE] hover:bg-white/5 border-l-2 border-transparent pl-[14px]",
      ].join(" ")
    }
  >
    {({ isActive }) => (
      <>
        <span className={isActive ? "text-[#C9A227]" : "text-[#666666] group-hover:text-[#AAAAAA]"}>
          <Icon path={ICONS[icon]} size={15} />
        </span>
        {label}
      </>
    )}
  </NavLink>
);

// ── Component ─────────────────────────────────────────────────────────────────
const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F5EE]">
        <span className="text-xs tracking-widest uppercase text-[#AAAAAA] animate-pulse">
          Loading…
        </span>
      </div>
    );

  const permissions = ROLE_PERMISSIONS[user.role];

  // Role label — friendlier display
  const roleLabel = user.role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex min-h-screen bg-[#F8F5EE]" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 bg-[#0A0A0A] border-r border-[#1C1C1C] flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-2.5">
            {/* Gold monogram circle */}
            <div className="w-7 h-7 rounded-full bg-[#C9A227] flex items-center justify-center shrink-0">
              <span
                className="text-[#0A0A0A] font-semibold leading-none"
                style={{ fontSize: 11, letterSpacing: "0.05em" }}
              >
                FH
              </span>
            </div>
            <span
              className="text-[#F8F5EE] font-light tracking-[0.25em] uppercase"
              style={{ fontSize: 12 }}
            >
              FLIC HRMS
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">

          {/* Section label */}
          <p className="px-4 pb-2 text-[9px] font-medium tracking-[0.3em] uppercase text-[#444444]">
            Menu
          </p>

          {permissions.employees && (
            <SideNavLink to="/" end icon="employees" label="Employees" />
          )}

          {permissions.attendance && (
            <SideNavLink to="/attendance" icon="attendance" label="Attendance" />
          )}

          <SideNavLink to="/worklogs" icon="worklogs" label="Work Logs" />

          {permissions.leaves && (
            <SideNavLink to="/leaves" icon="leaves" label="Leaves" />
          )}

          {(user.role === ROLES.HR_ADMIN || user.role === ROLES.SUPER_ADMIN) && (
            <SideNavLink to="/reports" icon="reports" label="Reports" />
          )}

          {user.role === ROLES.EMPLOYEE && (
            <SideNavLink to="/profile" icon="profile" label="My Profile" />
          )}
        </nav>

        {/* Bottom: user chip */}
        <div className="px-4 py-4 border-t border-[#1C1C1C]">
          <div className="flex items-center gap-3">
            {/* Avatar initials */}
            <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#333333] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-medium text-[#AAAAAA] uppercase tracking-wide">
                {(user.name || user.email || "U").slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[#F8F5EE] truncate">
                {user.name || user.email || "User"}
              </p>
              <p className="text-[9px] tracking-widest uppercase text-[#C9A227] mt-0.5">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-[#EBEBEB] px-6 py-0 flex justify-between items-center h-14 shrink-0">
          {/* Page title — dynamic via breadcrumb would be ideal; static label for now */}
          <span
            className="text-xs font-medium tracking-[0.2em] uppercase text-[#AAAAAA]"
          >
            Dashboard
          </span>

          <div className="flex items-center gap-5">
            {/* Role badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5E9C4] text-[#9B7A18] text-[10px] font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] inline-block" />
              {roleLabel}
            </span>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium tracking-wide text-[#666666] border border-[#EBEBEB] hover:border-[#AAAAAA] hover:text-[#333333] transition-colors duration-150"
            >
              <Icon path={ICONS.logout} size={13} />
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
