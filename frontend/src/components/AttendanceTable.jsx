import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import {
  requestCorrection,
  approveCorrection,
  rejectCorrection,
} from "../api/attendanceApi";
import toast from "react-hot-toast";
import { inputCls } from "../config/formStyles";
import StatusBadge from "./ui/StatusBadge";

// ── Column header ─────────────────────────────────────────────────────────────
const Th = ({ children, className = "" }) => (
  <th className={`px-5 py-3 text-left text-[10px] font-medium tracking-[0.2em]
    uppercase text-[#666666] ${className}`}>
    {children}
  </th>
);

// ── Component ─────────────────────────────────────────────────────────────────
const AttendanceTable = ({ records, refresh, employeeId }) => {
  const { user } = useAuth();

  const [correctionData, setCorrectionData] = useState({
    attendanceId: null,
    requestedStatus: "",
    reason: "",
  });

  const isEmployee = user.role === ROLES.EMPLOYEE;
  const isHRorAdmin =
    user.role === ROLES.HR_ADMIN || user.role === ROLES.SUPER_ADMIN;

  const handleRequest = async () => {
    const { attendanceId, requestedStatus, reason } = correctionData;
    if (!requestedStatus) { toast.error("Select status"); return; }

    await requestCorrection(attendanceId, {
      requestedStatus,
      correctionReason: reason,
    });

    toast.success("Request submitted");
    setCorrectionData({ attendanceId: null, requestedStatus: "", reason: "" });
    refresh(user.employeeId);
  };

  const resetCorrection = () =>
    setCorrectionData({ attendanceId: null, requestedStatus: "", reason: "" });

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!records.length) {
    return (
      <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
        py-14 text-center">
        <p className="text-xs tracking-wide text-[#AAAAAA]">
          No attendance records found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

      {/* ── Card header ── */}
      <div className="px-5 py-4 border-b border-[#EBEBEB]">
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
          Records
        </p>
        <h2 className="text-sm font-medium text-[#0A0A0A]"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}>
          Attendance Log
        </h2>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-[#F8F5EE] border-b border-[#EBEBEB]">
              <Th className="pl-5">Date</Th>
              <Th>Status</Th>
              <Th>Requested</Th>
              <Th>Reason</Th>
              <Th>Action</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EBEBEB]">
            {records.map((a) => (
              <tr key={a.id}
                className="hover:bg-[#F8F5EE] transition-colors duration-100">

                {/* Date */}
                <td className="px-5 py-3 pl-5 text-xs text-[#333333] tabular-nums">
                  {a.attendanceDate}
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  <StatusBadge status={a.status} />
                </td>

                {/* Requested status */}
                <td className="px-5 py-3">
                  {a.requestedStatus
                    ? <StatusBadge status={a.requestedStatus} />
                    : <span className="text-[#AAAAAA] text-xs">—</span>
                  }
                </td>

                {/* Reason */}
                <td className="px-5 py-3 text-xs text-[#666666] max-w-[180px] truncate">
                  {a.correctionReason || <span className="text-[#AAAAAA]">—</span>}
                </td>

                {/* Action */}
                <td className="px-5 py-3">

                  {/* Employee: request correction */}
                  {isEmployee && !a.requestedStatus && (
                    correctionData.attendanceId === a.id ? (

                      <div className="space-y-2 min-w-[160px]">
                        <select
                          value={correctionData.requestedStatus}
                          onChange={(e) => setCorrectionData({
                            ...correctionData, requestedStatus: e.target.value,
                          })}
                          className={inputCls}
                        >
                          <option value="">Select status…</option>
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Reason (optional)"
                          value={correctionData.reason}
                          onChange={(e) => setCorrectionData({
                            ...correctionData, reason: e.target.value,
                          })}
                          className={inputCls}
                        />

                        <div className="flex gap-2 pt-0.5">
                          <button
                            onClick={handleRequest}
                            className="px-3 py-1.5 rounded-md text-[10px] font-semibold
                              tracking-[0.15em] uppercase
                              bg-[#C9A227] hover:bg-[#E6B93A] text-[#0A0A0A]
                              transition-colors duration-150"
                          >
                            Submit
                          </button>
                          <button
                            onClick={resetCorrection}
                            className="px-3 py-1.5 rounded-md text-[10px] font-medium
                              tracking-wide uppercase border border-[#EBEBEB]
                              text-[#666666] hover:border-[#AAAAAA]
                              transition-colors duration-150"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                    ) : (
                      <button
                        onClick={() => setCorrectionData({
                          attendanceId: a.id, requestedStatus: "", reason: "",
                        })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5
                          rounded-md text-[10px] font-medium tracking-wide uppercase
                          border border-[#EBEBEB] text-[#666666]
                          hover:border-[#C9A227] hover:text-[#C9A227]
                          transition-colors duration-150"
                      >
                        Request
                      </button>
                    )
                  )}

                  {/* HR / Admin: approve or reject */}
                  {isHRorAdmin && a.requestedStatus && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          approveCorrection(a.id).then(() => refresh(employeeId));
                          toast.success("Approved");
                        }}
                        className="px-3 py-1.5 rounded-md text-[10px] font-medium
                          tracking-wide uppercase
                          bg-[#F5E9C4] text-[#9B7A18]
                          hover:bg-[#E6B93A]/30
                          transition-colors duration-150"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          rejectCorrection(a.id).then(() => refresh(employeeId));
                          toast.error("Rejected");
                        }}
                        className="px-3 py-1.5 rounded-md text-[10px] font-medium
                          tracking-wide uppercase
                          bg-red-50 text-red-500
                          hover:bg-red-100
                          transition-colors duration-150"
                      >
                        Reject
                      </button>
                    </div>
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
          <span className="text-[#333333] font-medium">{records.length}</span> record{records.length !== 1 ? "s" : ""}
        </p>
      </div>

    </div>
  );
};

export default AttendanceTable;
