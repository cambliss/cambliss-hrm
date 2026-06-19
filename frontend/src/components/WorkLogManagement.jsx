import { useEffect, useState } from "react";
import { getAllEmployees } from "../api/employeeApi";
import { getEmployeeLogs } from "../services/workLogService";
import { inputCls } from "../config/formStyles";
import StatusBadge from "./ui/StatusBadge";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDateTime = (dateTime) => {
    if (!dateTime) return null;
    return new Date(dateTime).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const formatMinutes = (minutes) => {
    if (!minutes && minutes !== 0) return null;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
};

// ── Column header ─────────────────────────────────────────────────────────────
const Th = ({ children, className = "" }) => (
    <th className={`px-5 py-3 text-left text-[10px] font-medium tracking-[0.2em]
    uppercase text-[#666666] ${className}`}>
        {children}
    </th>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent = false }) => (
    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm px-5 py-4">
        <p className="text-[9px] font-medium tracking-[0.25em] uppercase text-[#AAAAAA] mb-2">
            {label}
        </p>
        <p className={[
            "text-3xl font-light leading-none",
            accent ? "text-[#C9A227]" : "text-[#0A0A0A]",
        ].join(" ")}
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            {value}
        </p>
    </div>
);

// ── Close icon ────────────────────────────────────────────────────────────────
const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
const WorkLogManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSummary, setSelectedSummary] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getAllEmployees().then((res) => setEmployees(res.data));
    }, []);

    const loadWorkLogs = async (employeeId) => {
        if (!employeeId) return;
        try {
            setLoading(true);
            setSelectedEmployeeId(employeeId);
            const response = await getEmployeeLogs(employeeId);
            setRecords(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const activeSessions = records.filter(r => r.status === "ACTIVE").length;
    const completedSessions = records.filter(r => r.status === "COMPLETED").length;

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
                    Work Log Management
                </h1>
                <p className="text-xs text-[#AAAAAA] mt-1 tracking-wide">
                    Monitor and review employee work logs
                </p>
            </div>

            {/* ── Stat cards — visible once an employee is selected ── */}
            {selectedEmployeeId && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Total Logs" value={records.length} />
                    <StatCard label="Active Sessions" value={activeSessions} accent />
                    <StatCard label="Completed Sessions" value={completedSessions} />
                </div>
            )}

            {/* ── Employee filter ── */}
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
                        Choose an employee to load their work logs.
                    </p>
                    <select
                        value={selectedEmployeeId}
                        onChange={(e) => loadWorkLogs(e.target.value)}
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

            {/* ── Table / loading ── */}
            {loading ? (
                <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
          py-16 text-center">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-[#AAAAAA] animate-pulse">
                        Loading work logs…
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

                    {/* Card header */}
                    <div className="px-5 py-4 border-b border-[#EBEBEB]">
                        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
                            Records
                        </p>
                        <h2
                            className="text-sm font-medium text-[#0A0A0A]"
                            style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
                        >
                            Work Log History
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">

                            <thead>
                                <tr className="bg-[#F8F5EE] border-b border-[#EBEBEB]">
                                    <Th className="pl-5">Login</Th>
                                    <Th>Logout</Th>
                                    <Th>Duration</Th>
                                    <Th>Status</Th>
                                    <Th>Work Summary</Th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#EBEBEB]">
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-14">
                                            <p className="text-xs tracking-wide text-[#AAAAAA]">
                                                {selectedEmployeeId
                                                    ? "No work logs found for this employee"
                                                    : "Select an employee to view work logs"}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((log) => {
                                        const loginFmt = formatDateTime(log.loginTime);
                                        const logoutFmt = formatDateTime(log.logoutTime);
                                        const durationFmt = formatMinutes(log.totalMinutes);

                                        return (
                                            <tr key={log.id}
                                                className="hover:bg-[#F8F5EE] transition-colors duration-100">

                                                {/* Login */}
                                                <td className="px-5 py-3 pl-5 text-xs text-[#333333] tabular-nums">
                                                    {loginFmt ?? <span className="text-[#AAAAAA]">—</span>}
                                                </td>

                                                {/* Logout */}
                                                <td className="px-5 py-3 text-xs text-[#333333] tabular-nums">
                                                    {logoutFmt ?? <span className="text-[#AAAAAA]">—</span>}
                                                </td>

                                                {/* Duration */}
                                                <td className="px-5 py-3 text-xs font-medium text-[#333333] tabular-nums">
                                                    {durationFmt ?? <span className="text-[#AAAAAA]">—</span>}
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-3">
                                                    <StatusBadge status={log.status} />
                                                </td>

                                                {/* Work summary */}
                                                <td className="px-5 py-3 max-w-[220px]">
                                                    {log.workSummary ? (
                                                        <div>
                                                            <p className="text-xs text-[#666666] truncate">
                                                                {log.workSummary}
                                                            </p>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedSummary(log.workSummary);
                                                                    setShowModal(true);
                                                                }}
                                                                className="mt-1 text-[10px] font-medium tracking-wide
                                  uppercase text-[#C9A227] hover:text-[#E6B93A]
                                  transition-colors duration-150"
                                                            >
                                                                View full
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[#AAAAAA] text-xs">—</span>
                                                    )}
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>

                        </table>
                    </div>

                    {/* Footer count */}
                    {records.length > 0 && (
                        <div className="px-5 py-3 border-t border-[#EBEBEB] bg-[#F8F5EE]">
                            <p className="text-[10px] text-[#AAAAAA] tracking-wide">
                                <span className="text-[#333333] font-medium">{records.length}</span>{" "}
                                log{records.length !== 1 ? "s" : ""}
                                {activeSessions > 0 && (
                                    <> · <span className="text-[#9B7A18] font-medium">{activeSessions} active</span></>
                                )}
                            </p>
                        </div>
                    )}

                </div>
            )}

            {/* ── Work summary modal ── */}
            {showModal && (
                <div className="fixed inset-0 bg-[#0A0A0A]/60 backdrop-blur-[2px]
          flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-xl
            w-full max-w-2xl overflow-hidden">

                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4
              border-b border-[#EBEBEB]">
                            <div>
                                <p className="text-[9px] font-medium tracking-[0.3em] uppercase
                  text-[#C9A227] mb-0.5">
                                    Work Log
                                </p>
                                <h3
                                    className="text-sm font-medium text-[#0A0A0A]"
                                    style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
                                >
                                    Daily Work Summary
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                                className="w-7 h-7 rounded-md flex items-center justify-center
                  text-[#AAAAAA] hover:text-[#333333] hover:bg-[#F8F5EE]
                  transition-colors duration-150"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-5 max-h-[360px] overflow-y-auto">
                            <p className="text-xs text-[#333333] leading-6 whitespace-pre-wrap">
                                {selectedSummary}
                            </p>
                        </div>

                        {/* Modal footer */}
                        <div className="px-6 py-4 border-t border-[#EBEBEB] bg-[#F8F5EE]
              flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-md text-[11px] font-medium
                  tracking-wide uppercase border border-[#EBEBEB] text-[#666666]
                  hover:border-[#AAAAAA] hover:text-[#333333]
                  transition-colors duration-150"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default WorkLogManagement;
