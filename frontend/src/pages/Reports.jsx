import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import StatCard from "../components/ui/StatCard";

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ pct, gold = false }) => (
  <div className="w-full h-1.5 bg-[#F8F5EE] rounded-full overflow-hidden border border-[#EBEBEB]">
    <div
      className={`h-full rounded-full transition-all duration-500 ${gold ? "bg-[#C9A227]" : "bg-[#AAAAAA]"
        }`}
      style={{ width: `${Math.min(100, pct)}%` }}
    />
  </div>
);

// ── Column header ─────────────────────────────────────────────────────────────
const Th = ({ children }) => (
  <th className="px-5 py-3 text-left text-[10px] font-medium tracking-[0.2em]
    uppercase text-[#666666]">
    {children}
  </th>
);

// ── Card shell ────────────────────────────────────────────────────────────────
const SectionCard = ({ eyebrow, title, subtitle, badge, children }) => (
  <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-[#EBEBEB] flex items-start justify-between">
      <div>
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
          {eyebrow}
        </p>
        <h2
          className="text-sm font-medium text-[#0A0A0A]"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-[10px] text-[#AAAAAA] mt-0.5 tracking-wide">{subtitle}</p>
        )}
      </div>
      {badge && (
        <span className="text-[9px] font-medium tracking-[0.2em] uppercase
          text-[#AAAAAA] mt-1">
          {badge}
        </span>
      )}
    </div>
    <div className="px-5 py-5">{children}</div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const Reports = () => {
  const { user } = useAuth();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      if (user.role !== ROLES.HR_ADMIN && user.role !== ROLES.SUPER_ADMIN) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [employeeRes, attendanceRes, leaveRes, monthlyRes] = await Promise.all([
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

  const maxLeaveCount = leaveSummary.length
    ? Math.max(...leaveSummary.map(([, c]) => c || 0), 1)
    : 1;

  const maxMonthlyCount = monthlyAttendance.length
    ? Math.max(...monthlyAttendance.map(([, count]) => count))
    : 0;

  // ── Access guard ────────────────────────────────────────────────────────────
  if (user.role !== ROLES.HR_ADMIN && user.role !== ROLES.SUPER_ADMIN) {
    return (
      <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
        py-14 text-center">
        <p className="text-xs tracking-wide text-[#AAAAAA]">
          You do not have access to view reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div>
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-1">
          Analytics
        </p>
        <h1
          className="text-2xl font-light text-[#0A0A0A] leading-tight"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          Reports Dashboard
        </h1>
        <p className="text-xs text-[#AAAAAA] mt-1 tracking-wide">
          Overview of workforce statistics and attendance insights
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
          py-16 text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#AAAAAA] animate-pulse">
            Loading reports…
          </p>
        </div>
      ) : (
        <>
          {/* ── KPI cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Total Employees" value={employeeCount} />
            <StatCard label="Present Today" value={presentCount} accent />
            <StatCard label="Absent Today" value={absentCount} muted />
          </div>

          {/* ── Attendance insight + Leave usage ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Attendance insight */}
            <SectionCard eyebrow="Attendance" title="Attendance Insight" badge="Today">
              <div className="space-y-5">

                {/* Attendance rate bar */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#666666]">
                      Attendance Rate
                    </span>
                    <span
                      className="text-2xl font-light text-[#C9A227]"
                      style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                    >
                      {attendancePercent}%
                    </span>
                  </div>
                  <ProgressBar pct={attendancePercent} gold />
                </div>

                {/* Present / Absent mini cards */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#F8F5EE] rounded-md border border-[#EBEBEB] px-4 py-3">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#AAAAAA] mb-1">
                      Present
                    </p>
                    <p
                      className="text-2xl font-light text-[#C9A227]"
                      style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                    >
                      {presentCount}
                    </p>
                  </div>
                  <div className="bg-[#F8F5EE] rounded-md border border-[#EBEBEB] px-4 py-3">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#AAAAAA] mb-1">
                      Absent
                    </p>
                    <p
                      className="text-2xl font-light text-red-400"
                      style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                    >
                      {absentCount}
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Leave usage summary */}
            <SectionCard eyebrow="Leaves" title="Leave Usage Summary" badge="Overview">
              {leaveSummary.length === 0 ? (
                <p className="text-xs text-[#AAAAAA] tracking-wide">
                  No leave usage data available
                </p>
              ) : (
                <div className="space-y-4">
                  {leaveSummary.map(([type, count]) => (
                    <div key={type}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-[#666666]">
                          {type}
                        </span>
                        <span className="text-xs font-medium text-[#333333] tabular-nums">
                          {count}
                        </span>
                      </div>
                      <ProgressBar pct={(count / maxLeaveCount) * 100} gold />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

          </div>

          {/* ── Monthly attendance trend (bar chart) ── */}
          <SectionCard
            eyebrow="Trend"
            title="Monthly Attendance Trend"
            subtitle="Daily attendance count for the current month"
          >
            {monthlyAttendance.length === 0 ? (
              <p className="text-xs text-[#AAAAAA] tracking-wide">
                No attendance data for this month
              </p>
            ) : (
              <div className="space-y-2.5">
                {monthlyAttendance.map(([date, count]) => {
                  const pct = maxMonthlyCount > 0
                    ? (count / maxMonthlyCount) * 100
                    : 0;
                  return (
                    <div key={date}
                      className="grid grid-cols-[120px_1fr_48px] items-center gap-4">
                      <span className="text-[10px] text-[#666666] tabular-nums tracking-wide">
                        {date}
                      </span>
                      <ProgressBar pct={pct} gold />
                      <span className="text-[10px] font-medium text-[#333333]
                        tabular-nums text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* ── Attendance details table ── */}
          <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-[#EBEBEB]">
              <p className="text-[9px] font-medium tracking-[0.3em] uppercase
                text-[#C9A227] mb-0.5">
                Records
              </p>
              <h2
                className="text-sm font-medium text-[#0A0A0A]"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
              >
                Attendance Details
              </h2>
            </div>

            {monthlyAttendance.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-xs text-[#AAAAAA] tracking-wide">
                  No attendance records available
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8F5EE] border-b border-[#EBEBEB]">
                        <Th>Date</Th>
                        <Th>Attendance Count</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBEBEB]">
                      {monthlyAttendance.map(([date, count]) => (
                        <tr key={date}
                          className="hover:bg-[#F8F5EE] transition-colors duration-100">
                          <td className="px-5 py-3 text-xs text-[#333333] tabular-nums">
                            {date}
                          </td>
                          <td className="px-5 py-3 text-xs font-semibold text-[#0A0A0A] tabular-nums">
                            {count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3 border-t border-[#EBEBEB] bg-[#F8F5EE]">
                  <p className="text-[10px] text-[#AAAAAA] tracking-wide">
                    <span className="text-[#333333] font-medium">
                      {monthlyAttendance.length}
                    </span>{" "}
                    days recorded
                  </p>
                </div>
              </>
            )}
          </div>

        </>
      )}
    </div>
  );
};

export default Reports;
