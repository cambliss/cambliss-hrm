import { approveLeave, rejectLeave } from "../api/leaveApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import toast from "react-hot-toast";
import StatusBadge from "./ui/StatusBadge";

// ── Column header ─────────────────────────────────────────────────────────────
const Th = ({ children, className = "" }) => (
  <th className={`px-5 py-3 text-left text-[10px] font-medium tracking-[0.2em]
    uppercase text-[#666666] ${className}`}>
    {children}
  </th>
);

// ── Leave type pill ───────────────────────────────────────────────────────────
const LeaveTypePill = ({ type }) => (
  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium
    tracking-wide uppercase bg-[#F8F5EE] text-[#666666] border border-[#EBEBEB]">
    {type}
  </span>
);

// ── Component ─────────────────────────────────────────────────────────────────
const LeaveList = ({ leaves, refresh, employeeId }) => {
  const { user } = useAuth();

  const isAdminOrHR =
    user.role === ROLES.SUPER_ADMIN || user.role === ROLES.HR_ADMIN;
  const isManager = user.role === ROLES.MANAGER;
  const canApprove = isAdminOrHR || isManager;

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!leaves.length) {
    return (
      <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
        py-14 text-center">
        <p className="text-xs tracking-wide text-[#AAAAAA]">
          No leave requests found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

      {/* ── Card header ── */}
      <div className="px-5 py-4 border-b border-[#EBEBEB]">
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
          Requests
        </p>
        <h2 className="text-sm font-medium text-[#0A0A0A]"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}>
          Leave History
        </h2>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-[#F8F5EE] border-b border-[#EBEBEB]">
              <Th className="pl-5">Type</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EBEBEB]">
            {leaves.map((l) => (
              <tr key={l.id}
                className="hover:bg-[#F8F5EE] transition-colors duration-100">

                {/* Type */}
                <td className="px-5 py-3 pl-5">
                  <LeaveTypePill type={l.leaveType} />
                </td>

                {/* Dates */}
                <td className="px-5 py-3 text-xs text-[#333333] tabular-nums">
                  {l.startDate}
                </td>
                <td className="px-5 py-3 text-xs text-[#333333] tabular-nums">
                  {l.endDate}
                </td>

                {/* Reason */}
                <td className="px-5 py-3 text-xs text-[#666666] max-w-[200px] truncate">
                  {l.reason || <span className="text-[#AAAAAA]">—</span>}
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  <StatusBadge status={l.status} />
                </td>

                {/* Action */}
                <td className="px-5 py-3">
                  {canApprove && l.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          approveLeave(l.id).then(() => refresh(employeeId));
                          toast.success("Approved");
                        }}
                        className="px-3 py-1.5 rounded-md text-[10px] font-medium
                          tracking-wide uppercase bg-[#F5E9C4] text-[#9B7A18]
                          hover:bg-[#E6B93A]/30 transition-colors duration-150"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          rejectLeave(l.id).then(() => refresh(employeeId));
                          toast.error("Rejected");
                        }}
                        className="px-3 py-1.5 rounded-md text-[10px] font-medium
                          tracking-wide uppercase bg-red-50 text-red-500
                          hover:bg-red-100 transition-colors duration-150"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-[#AAAAAA] text-xs">—</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ── Footer count ── */}
      <div className="px-5 py-3 border-t border-[#EBEBEB] bg-[#F8F5EE]">
        <p className="text-[10px] text-[#AAAAAA] tracking-wide">
          <span className="text-[#333333] font-medium">{leaves.length}</span>{" "}
          request{leaves.length !== 1 ? "s" : ""}
          {" · "}
          <span className="text-[#9B7A18] font-medium">
            {leaves.filter(l => l.status === "APPROVED").length} approved
          </span>
          {" · "}
          <span className="text-[#AAAAAA]">
            {leaves.filter(l => l.status === "PENDING").length} pending
          </span>
        </p>
      </div>

    </div>
  );
};

export default LeaveList;
