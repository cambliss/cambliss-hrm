import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";

const Reports = () => {
  const { user } = useAuth();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);

  useEffect(() => {
    if (
      user.role === ROLES.HR_ADMIN ||
      user.role === ROLES.SUPER_ADMIN
    ) {
      axiosInstance.get("/api/hrm/employees/count")
        .then(res => setEmployeeCount(res.data));

      axiosInstance.get("/api/hrm/attendance/summary/today")
        .then(res => setAttendanceSummary(res.data));

      axiosInstance.get("/api/hrm/leaves/summary/usage")
        .then(res => setLeaveSummary(res.data));

      axiosInstance
        .get("/api/hrm/attendance/summary/monthly")
        .then(res => setMonthlyAttendance(res.data));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Reports Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of workforce statistics and attendance insights.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Total Employees */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {employeeCount}
            </p>
          </div>

          {/* Present Today */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Present Today</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {
                attendanceSummary.find(([s]) => s === "PRESENT")?.[1] || 0
              }
            </p>
          </div>

          {/* Absent Today */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Absent Today</p>
            <p className="text-4xl font-bold text-red-600 mt-2">
              {
                attendanceSummary.find(([s]) => s === "ABSENT")?.[1] || 0
              }
            </p>
          </div>

        </div>

        {/* Leave Usage Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Leave Usage Summary
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {leaveSummary.map(([type, count]) => (
              <div
                key={type}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <p className="text-sm text-gray-500">{type}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Attendance Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Monthly Attendance Overview
          </h2>

          {monthlyAttendance.length === 0 ? (
            <p className="text-gray-500">
              No attendance data for this month
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Attendance Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyAttendance.map(([date, count]) => (
                    <tr
                      key={date}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-gray-700">
                        {date}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reports;
