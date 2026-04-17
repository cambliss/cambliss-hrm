import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";

const Reports = () => {
  const { user } = useAuth();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      if (
        user.role !== ROLES.HR_ADMIN &&
        user.role !== ROLES.SUPER_ADMIN
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [
          employeeRes,
          attendanceRes,
          leaveRes,
          monthlyRes,
        ] = await Promise.all([
          axiosInstance.get("/api/hrm/employees/count"),
          axiosInstance.get("/api/hrm/attendance/summary/today"),
          axiosInstance.get("/api/hrm/leaves/summary/usage"),
          axiosInstance.get("/api/hrm/attendance/summary/monthly"),
        ]);

        setEmployeeCount(employeeRes.data);
        setAttendanceSummary(attendanceRes.data || []);
        setLeaveSummary(leaveRes.data || []);
        setMonthlyAttendance(monthlyRes.data || []);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user]);

  const presentCount = useMemo(
    () => attendanceSummary.find(([status]) => status === "PRESENT")?.[1] || 0,
    [attendanceSummary]
  );

  const absentCount = useMemo(
    () => attendanceSummary.find(([status]) => status === "ABSENT")?.[1] || 0,
    [attendanceSummary]
  );

  const totalAttendanceToday = presentCount + absentCount;

  const attendancePercent = totalAttendanceToday
    ? Math.round((presentCount / totalAttendanceToday) * 100)
    : 0;

  const maxMonthlyCount =
    monthlyAttendance.length > 0
      ? Math.max(...monthlyAttendance.map(([, count]) => count))
      : 0;

  if (
    user.role !== ROLES.HR_ADMIN &&
    user.role !== ROLES.SUPER_ADMIN
  ) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-10 text-center text-gray-500">
        You do not have access to view reports.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Reports Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of workforce statistics and attendance insights
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border p-10 text-center text-gray-400">
          Loading reports...
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <p className="text-sm text-gray-500">Total Employees</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {employeeCount}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <p className="text-sm text-gray-500">Present Today</p>
              <h2 className="text-4xl font-bold text-green-600 mt-2">
                {presentCount}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <p className="text-sm text-gray-500">Absent Today</p>
              <h2 className="text-4xl font-bold text-red-600 mt-2">
                {absentCount}
              </h2>
            </div>
          </div>

          {/* Attendance + Leave Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Attendance Insight */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Attendance Insight
                </h2>
                <span className="text-sm text-gray-500">
                  Today
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Attendance Rate</span>
                    <span>{attendancePercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${attendancePercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-lg border p-4">
                    <p className="text-sm text-gray-500">Present</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {presentCount}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg border p-4">
                    <p className="text-sm text-gray-500">Absent</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {absentCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Leave Usage Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Leave Usage Summary
                </h2>
                <span className="text-sm text-gray-500">
                  Overview
                </span>
              </div>

              {leaveSummary.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  No leave usage data available
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveSummary.map(([type, count]) => (
                    <div key={type}>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{type}</span>
                        <span>{count}</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{
                            width: `${
                              Math.min(
                                100,
                                leaveSummary.length
                                  ? (count /
                                      Math.max(
                                        ...leaveSummary.map(([, c]) => c || 0),
                                        1
                                      )) *
                                      100
                                  : 0
                              )
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Monthly Attendance Trend */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Monthly Attendance Trend
                </h2>
                <p className="text-sm text-gray-500">
                  Daily attendance count for the current month
                </p>
              </div>
            </div>

            {monthlyAttendance.length === 0 ? (
              <div className="text-gray-400 text-sm">
                No attendance data for this month
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyAttendance.map(([date, count]) => {
                  const width =
                    maxMonthlyCount > 0
                      ? (count / maxMonthlyCount) * 100
                      : 0;

                  return (
                    <div
                      key={date}
                      className="grid grid-cols-[140px_1fr_60px] items-center gap-4"
                    >
                      <span className="text-sm text-gray-600">
                        {date}
                      </span>

                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>

                      <span className="text-sm font-medium text-gray-700 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Monthly Attendance Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                Attendance Details
              </h2>
            </div>

            {monthlyAttendance.length === 0 ? (
              <div className="p-6 text-gray-400 text-sm">
                No attendance records available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Attendance Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyAttendance.map(([date, count]) => (
                      <tr
                        key={date}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-gray-700">
                          {date}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;