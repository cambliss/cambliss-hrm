import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEmployeeById } from "../api/employeeApi";

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isActive = status === "ACTIVE";
  return (
    <span className={[
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full",
      "text-[10px] font-medium tracking-wide uppercase",
      isActive ? "bg-[#F5E9C4] text-[#9B7A18]" : "bg-red-50 text-red-500",
    ].join(" ")}>
      <span className={[
        "w-1.5 h-1.5 rounded-full shrink-0",
        isActive ? "bg-[#C9A227]" : "bg-red-400",
      ].join(" ")} />
      {status}
    </span>
  );
};

// ── Profile field ─────────────────────────────────────────────────────────────
const ProfileField = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#AAAAAA] mb-1">
      {label}
    </p>
    <p className="text-xs font-medium text-[#333333]">
      {value || <span className="text-[#AAAAAA]">—</span>}
    </p>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const Profile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (user.employeeId) {
      getEmployeeById(user.employeeId).then(res => setEmployee(res.data));
    }
  }, [user]);

  // ── Loading state ───────────────────────────────────────────────────────────
  if (!employee) {
    return (
      <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
        py-16 text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#AAAAAA] animate-pulse">
          Loading profile…
        </p>
      </div>
    );
  }

  const initials = [
    employee.firstName?.charAt(0) ?? "",
    employee.lastName?.charAt(0) ?? "",
  ].join("").toUpperCase();

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div>
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-1">
          Account
        </p>
        <h1
          className="text-2xl font-light text-[#0A0A0A] leading-tight"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          My Profile
        </h1>
        <p className="text-xs text-[#AAAAAA] mt-1 tracking-wide">
          View your personal and employment details
        </p>
      </div>

      {/* ── Profile card ── */}
      <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

        {/* ── Identity strip ── */}
        <div className="px-6 py-6 border-b border-[#EBEBEB] flex flex-col sm:flex-row
          sm:items-center gap-5">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#F5E9C4] border-2 border-[#E6B93A]/30
            flex items-center justify-center shrink-0">
            <span
              className="text-xl font-semibold text-[#9B7A18] leading-none"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              {initials}
            </span>
          </div>

          {/* Name + designation + status */}
          <div className="space-y-1.5">
            <h2
              className="text-lg font-light text-[#0A0A0A] leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              {employee.firstName} {employee.lastName}
            </h2>

            <p className="text-xs text-[#666666]">
              {[employee.designation, employee.department]
                .filter(Boolean)
                .join(" · ")}
            </p>

            <StatusBadge status={employee.employmentStatus} />
          </div>

          {/* Employee code — pushed right on desktop */}
          <div className="sm:ml-auto text-right hidden sm:block">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#AAAAAA] mb-1">
              Employee Code
            </p>
            <p className="text-xs font-semibold text-[#0A0A0A] tabular-nums tracking-wide">
              {employee.employeeCode}
            </p>
          </div>

        </div>

        {/* ── Section label ── */}
        <div className="px-6 pt-5 pb-1">
          <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227]">
            Employment Details
          </p>
          <div className="mt-2 h-px bg-[#EBEBEB]" />
        </div>

        {/* ── Details grid ── */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
          <ProfileField label="Email" value={employee.email} />
          <ProfileField label="Phone" value={employee.phone} />
          <ProfileField label="Role" value={employee.role} />
          <ProfileField label="Department" value={employee.department} />
          <ProfileField label="Designation" value={employee.designation} />
          <ProfileField label="Joining Date" value={employee.joiningDate} />
        </div>

      </div>

    </div>
  );
};

export default Profile;
