import { useEffect, useState } from "react";
import { getAllEmployees } from "../api/employeeApi";
import { markAttendance } from "../api/attendanceApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import toast from "react-hot-toast";
import { inputCls } from "../config/formStyles";

// ── Label ─────────────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-[#666666] mb-1">
    {children}
  </label>
);

// ── Component ─────────────────────────────────────────────────────────────────
const AttendanceForm = ({ refresh }) => {
  const { user } = useAuth();
  const isEmployee = user.role === ROLES.EMPLOYEE;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    employeeId: isEmployee ? user.employeeId : "",
    attendanceDate: "",
    status: "PRESENT",
  });

  useEffect(() => {
    getAllEmployees().then(res => setEmployees(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "employeeId") {
      refresh(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employeeId || !form.attendanceDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      setLoading(true);
      await markAttendance({
        employee: { id: form.employeeId },
        attendanceDate: form.attendanceDate,
        status: form.status,
      });
      toast.success("Attendance marked");
      refresh(form.employeeId);
    } catch (err) {
      toast.error(err.response?.data || "Already marked");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

      {/* ── Card header ── */}
      <div className="px-5 py-4 border-b border-[#EBEBEB]">
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
          Attendance
        </p>
        <h2 className="text-sm font-medium text-[#0A0A0A]"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}>
          Mark Attendance
        </h2>
      </div>

      {/* ── Form body ── */}
      <form onSubmit={handleSubmit} className="px-5 py-4">
        <div className={`grid gap-4 ${!isEmployee ? "grid-cols-3" : "grid-cols-2"}`}>

          {/* Employee selector — HR/Admin only */}
          {!isEmployee && (
            <div>
              <Label>Employee</Label>
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select employee…</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <Label>Date</Label>
            <input
              type="date"
              name="attendanceDate"
              value={form.attendanceDate}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>

        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md
              text-[11px] font-semibold tracking-[0.15em] uppercase
              bg-[#C9A227] hover:bg-[#E6B93A] active:bg-[#9B7A18]
              text-[#0A0A0A] shadow-sm
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors duration-150"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-[#0A0A0A]/30
                  border-t-[#0A0A0A] animate-spin" />
                Saving…
              </>
            ) : (
              "Mark Attendance"
            )}
          </button>
        </div>
      </form>

    </div>
  );
};

export default AttendanceForm;
