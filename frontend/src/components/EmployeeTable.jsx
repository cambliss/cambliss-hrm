import { useState } from "react";
import StatusBadge from "./ui/StatusBadge";

// ── Search icon ───────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

// ── Edit icon ─────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// ── Initials avatar ───────────────────────────────────────────────────────────
const Avatar = ({ firstName, lastName }) => {
  const initials = `${(firstName || "")[0] || ""}${(lastName || "")[0] || ""}`.toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[#F5E9C4] border border-[#E6B93A]/30
      flex items-center justify-center shrink-0">
      <span className="text-[10px] font-semibold text-[#9B7A18] tracking-wide">
        {initials}
      </span>
    </div>
  );
};

// ── Column header ─────────────────────────────────────────────────────────────
const Th = ({ children, className = "" }) => (
  <th className={`py-3 px-4 text-left text-[10px] font-medium tracking-[0.2em]
    uppercase text-[#666666] ${className}`}>
    {children}
  </th>
);

// ── Main component ────────────────────────────────────────────────────────────
const EmployeeTable = ({ employees, onEdit }) => {
  const [search, setSearch] = useState("");

  const filtered = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

      {/* ── Card header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between
        gap-3 px-5 py-4 border-b border-[#EBEBEB]">

        <div>
          <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
            Directory
          </p>
          <h2 className="text-sm font-semibold text-[#0A0A0A]"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}>
            Employees
          </h2>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search employees…"
            className="pl-8 pr-4 py-2 text-xs rounded-md border border-[#EBEBEB]
              bg-[#F8F5EE] text-[#333333] placeholder-[#AAAAAA]
              focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/30
              transition-colors duration-150 w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-[#F8F5EE] border-b border-[#EBEBEB]">
              <Th className="pl-5">Name</Th>
              <Th>Department</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EBEBEB]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-14 text-[#AAAAAA]">
                  <p className="text-xs tracking-wide">No employees found</p>
                  {search && (
                    <p className="text-[10px] mt-1 text-[#AAAAAA]/70">
                      Try a different name
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map(emp => (
                <tr key={emp.id}
                  className="hover:bg-[#F8F5EE] transition-colors duration-100 group">

                  {/* Name + email */}
                  <td className="py-3 px-4 pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar firstName={emp.firstName} lastName={emp.lastName} />
                      <div>
                        <div className="text-xs font-semibold text-[#0A0A0A]">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-[10px] text-[#AAAAAA] mt-0.5">
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-4 text-xs text-[#333333]">
                    {emp.department}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4 text-xs text-[#333333]">
                    {emp.role}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={emp.employmentStatus} />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onEdit(emp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                        text-[10px] font-medium tracking-wide uppercase
                        border border-[#EBEBEB] text-[#666666]
                        hover:border-[#C9A227] hover:text-[#C9A227]
                        transition-colors duration-150"
                    >
                      <EditIcon />
                      Edit
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* ── Footer count ── */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-[#EBEBEB] bg-[#F8F5EE]">
          <p className="text-[10px] text-[#AAAAAA] tracking-wide">
            Showing{" "}
            <span className="text-[#333333] font-medium">{filtered.length}</span>
            {" "}of{" "}
            <span className="text-[#333333] font-medium">{employees.length}</span>
            {" "}employees
          </p>
        </div>
      )}

    </div>
  );
};

export default EmployeeTable;
