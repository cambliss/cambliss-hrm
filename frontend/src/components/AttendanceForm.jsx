import { useEffect, useState } from "react";
import { getAllEmployees } from "../api/employeeApi";
import { markAttendance } from "../api/attendanceApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";

const AttendanceForm = ({ refresh }) => {
  const { user } = useAuth();
  const isEmployee = user.role === ROLES.EMPLOYEE;

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: isEmployee ? user.employeeId : "",
    attendanceDate: "",
    status: "PRESENT",
  });

  useEffect(() => {
    if (user.role === ROLES.HR_ADMIN || user.role === ROLES.SUPER_ADMIN) {
      getAllEmployees().then(res => setEmployees(res.data));
    }

    if (user.role === ROLES.MANAGER) {
      getAllEmployees().then(res => {
        const team = res.data.filter(emp =>
          user.teamEmployeeIds.includes(emp.id)
        );
        setEmployees(team);
      });
    }

    if (user.role === ROLES.EMPLOYEE) {
      refresh(user.employeeId);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "employeeId" && value) {
      refresh(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employeeId || !form.attendanceDate) {
      alert("Please select date");
      return;
    }

    const payload = {
      employee: { id: form.employeeId },
      attendanceDate: form.attendanceDate,
      status: form.status,
    };

    try {
      await markAttendance(payload);
      alert("Attendance marked successfully");
      refresh(form.employeeId);
    } catch (err) {
      alert(err.response?.data || "Attendance already marked");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          Mark Attendance
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Record your daily attendance.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Date
          </label>
          <input
            type="date"
            name="attendanceDate"
            value={form.attendanceDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
          >
            Submit
          </button>
        </div>

      </div>
    </form>
  );
};

export default AttendanceForm;
