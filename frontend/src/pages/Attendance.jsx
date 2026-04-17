import { useState, useEffect } from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceTable from "../components/AttendanceTable";
import { getAttendanceByEmployee } from "../api/attendanceApi";
import { getAllEmployees } from "../api/employeeApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";

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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Attendance Management
        </h1>
        <p className="text-gray-500 text-sm">
          Track and manage attendance records
        </p>
      </div>

      {/* Stats Cards */}
      {employeeId && (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Total Days</p>
            <h2 className="text-2xl font-bold text-blue-600">
              {records.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Present</p>
            <h2 className="text-2xl font-bold text-green-600">
              {records.filter(r => r.status === "PRESENT").length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Absent</p>
            <h2 className="text-2xl font-bold text-red-600">
              {records.filter(r => r.status === "ABSENT").length}
            </h2>
          </div>
        </div>
      )}

      {/* Employee Selector */}
      {user.role !== ROLES.EMPLOYEE && (
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between">

          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Employee Filter
            </h3>
            <p className="text-xs text-gray-500">
              Select an employee to view attendance
            </p>
          </div>

          <select
            value={employeeId || ""}
            onChange={(e) => loadAttendance(e.target.value)}
            className="w-72 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.employeeCode} - {emp.firstName}
              </option>
            ))}
          </select>

        </div>
      )}

      {/* Employee Form */}
      {user.role === ROLES.EMPLOYEE && (
        <AttendanceForm refresh={loadAttendance} />
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-white p-10 rounded-xl text-center text-gray-400">
          Loading attendance...
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