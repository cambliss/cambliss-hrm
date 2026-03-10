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

  const loadAttendance = async (empId) => {
    if (!empId) return;
    setEmployeeId(empId);
    const res = await getAttendanceByEmployee(empId);
    setRecords(res.data);
  };

  useEffect(() => {
    if (user.role !== ROLES.EMPLOYEE) {
      getAllEmployees().then(res => setEmployees(res.data));
    } else {
      loadAttendance(user.employeeId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance Management
          </h1>
          <p className="text-gray-500 mt-1">
            Track daily attendance and manage correction requests.
          </p>
        </div>

        {/* Employee Selector */}
        {user.role !== ROLES.EMPLOYEE && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Employee
            </label>
            <select
              value={employeeId || ""}
              onChange={(e) => loadAttendance(e.target.value)}
              className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

        {/* Employee Attendance Form */}
        {user.role === ROLES.EMPLOYEE && (
          <AttendanceForm refresh={loadAttendance} />
        )}

        {/* Attendance Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Attendance History
          </h2>

          <AttendanceTable
            records={records}
            refresh={loadAttendance}
            employeeId={employeeId}
          />
        </div>

      </div>
    </div>
  );
};

export default Attendance;
