import { useState, useEffect } from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceTable from "../components/AttendanceTable";
import { getAttendanceByEmployee } from "../api/attendanceApi";
import { getAllEmployees } from "../api/employeeApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import { inputCls } from "../config/formStyles";
import StatCard from "../components/ui/StatCard";

// ── Page ──────────────────────────────────────────────────────────────────────
const Attendance = () => {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAttendance = async (empId) => {
    if (!empId) return;
    try {
      setLoading(true);
      setEmployeeId(empId);
      const res = await getAttendanceByEmployee(empId);
      setRecords(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role !== ROLES.EMPLOYEE) {
      getAllEmployees().then(res => setEmployees(res.data));
    } else {
      loadAttendance(user.employeeId);
    }
  }, []);

  const presentCount = records.filter(r => r.status === "PRESENT").length;
  const absentCount = records.filter(r => r.status === "ABSENT").length;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div>
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-1">
          Management
        </p>
        <h1
          className="text-2xl font-light text-[#0A0A0A] leading-tight"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          Attendance Management
        </h1>
        <p className="text-xs text-[#AAAAAA] mt-1 tracking-wide">
          Track and manage attendance records
        </p>
      </div>

      {/* ── Stat cards — visible once an employee is selected ── */}
      {employeeId && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Days" value={records.length} />
          <StatCard label="Present" value={presentCount} accent />
          <StatCard label="Absent" value={absentCount} muted />
        </div>
      )}

      {/* ── Employee filter — HR / Admin only ── */}
      {user.role !== ROLES.EMPLOYEE && (
        <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-[#EBEBEB]">
            <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
              Filter
            </p>
            <h2
              className="text-sm font-medium text-[#0A0A0A]"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
            >
              Select Employee
            </h2>
          </div>

          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center
            justify-between gap-4">
            <p className="text-xs text-[#AAAAAA] tracking-wide">
              Choose an employee to load their attendance log.
            </p>
            <select
              value={employeeId || ""}
              onChange={(e) => loadAttendance(e.target.value)}
              className={`${inputCls} sm:w-72`}
            >
              <option value="">Select employee…</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.employeeCode} — {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

        </div>
      )}

      {/* ── Mark Attendance form — Employee role only ── */}
      {user.role === ROLES.EMPLOYEE && (
        <AttendanceForm refresh={loadAttendance} />
      )}

      {/* ── Attendance table / loading ── */}
      {loading ? (
        <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
          py-16 text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#AAAAAA] animate-pulse">
            Loading attendance…
          </p>
        </div>
      ) : (
        <AttendanceTable
          records={records}
          refresh={loadAttendance}
          employeeId={employeeId}
        />
      )}

    </div>
  );
};

export default Attendance;
