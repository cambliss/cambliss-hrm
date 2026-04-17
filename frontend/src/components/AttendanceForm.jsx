import { useEffect, useState } from "react";
import { getAllEmployees } from "../api/employeeApi";
import { markAttendance } from "../api/attendanceApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import toast from "react-hot-toast";

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
      toast.error("Please select date");
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
    <form className="bg-white rounded-xl shadow-sm border p-6" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>

      <div className="grid grid-cols-3 gap-4">

        {!isEmployee && (
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Select Employee</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.firstName}
              </option>
            ))}
          </select>
        )}

        <input
          type="date"
          name="attendanceDate"
          value={form.attendanceDate}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
        </select>

      </div>

      <div className="flex justify-end mt-4">
        <button
          disabled={loading}
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;