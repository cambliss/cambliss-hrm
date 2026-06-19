import { useEffect, useState } from "react";
import {
    getEmployeeLogs,
    punchIn,
    punchOut,
} from "../services/workLogService";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "./ui/StatusBadge";

// ── Helpers (same as WorkLogManagement) ──────────────────────────────────────
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
const Th = ({ children }) => (
    <th className="px-5 py-3 text-left text-[10px] font-medium tracking-[0.2em]
    uppercase text-[#666666]">
        {children}
    </th>
);

// ── Close icon ────────────────────────────────────────────────────────────────
const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

// ── Textarea style ────────────────────────────────────────────────────────────
const textareaCls =
    "w-full px-3 py-2.5 rounded-md text-xs text-[#333333] bg-white resize-none " +
    "border border-[#EBEBEB] placeholder-[#AAAAAA] " +
    "focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/30 " +
    "transition-colors duration-150";

// ── Component ─────────────────────────────────────────────────────────────────
const EmployeeWorkLogDashboard = () => {
    const { user } = useAuth();
    const employeeId = user?.employeeId;

    const [logs, setLogs] = useState([]);
    const [activeLog, setActiveLog] = useState(null);
    const [workSummary, setWorkSummary] = useState("");
    const [selectedSummary, setSelectedSummary] = useState("");
    const [showModal, setShowModal] = useState(false);

    const fetchLogs = async () => {
        try {
            const response = await getEmployeeLogs(employeeId);
            setLogs(response.data);
            const active = response.data.find((log) => log.status === "ACTIVE");
            setActiveLog(active || null);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (employeeId) fetchLogs();
    }, [employeeId]);

    const handlePunchIn = async () => {
        try {
            await punchIn(employeeId);
            fetchLogs();
        } catch (error) {
            alert(error.response?.data?.message || "Punch in failed");
        }
    };

    const handlePunchOut = async () => {
        try {
            await punchOut(employeeId, workSummary);
            fetchLogs();
            setWorkSummary("");
        } catch (error) {
            alert(error.response?.data?.message || "Punch out failed");
        }
    };

    return (
        <div className="space-y-6">

            {/* ── Page header ── */}
            <div>
                <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-1">
                    Work Log
                </p>
                <h1
                    className="text-2xl font-light text-[#0A0A0A] leading-tight"
                    style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                >
                    Work Log Dashboard
                </h1>
                <p className="text-xs text-[#AAAAAA] mt-1 tracking-wide">
                    Track your daily work sessions
                </p>
            </div>

            {/* ── Current status card ── */}
            <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

                {/* Card header */}
                <div className="px-5 py-4 border-b border-[#EBEBEB]">
                    <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
                        Session
                    </p>
                    <h2
                        className="text-sm font-medium text-[#0A0A0A]"
                        style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
                    >
                        Current Status
                    </h2>
                </div>

                <div className="px-5 py-5 space-y-4">

                    {/* Employee name + live status pill */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-medium text-[#333333]">
                            {user?.name}
                        </span>
                        <span className={[
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full",
                            "text-[10px] font-medium tracking-wide uppercase",
                            activeLog
                                ? "bg-[#F5E9C4] text-[#9B7A18]"
                                : "bg-[#EBEBEB] text-[#666666]",
                        ].join(" ")}>
                            <span className={[
                                "w-1.5 h-1.5 rounded-full shrink-0",
                                activeLog ? "bg-[#C9A227] animate-pulse" : "bg-[#AAAAAA]",
                            ].join(" ")} />
                            {activeLog ? "Active" : "Not Working"}
                        </span>
                    </div>

                    {/* Active session details */}
                    {activeLog && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#AAAAAA]">
                                    Login Time
                                </p>
                                <p className="text-xs text-[#333333] tabular-nums">
                                    {formatDateTime(activeLog.loginTime)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-medium tracking-[0.15em]
                  uppercase text-[#666666] mb-1">
                                    Today's Work Summary
                                </label>
                                <textarea
                                    value={workSummary}
                                    onChange={(e) => setWorkSummary(e.target.value)}
                                    rows={4}
                                    placeholder="Describe what you worked on today…"
                                    className={textareaCls}
                                />
                            </div>
                        </div>
                    )}

                    {/* Punch in / out */}
                    <div className="pt-1">
                        {!activeLog ? (
                            <button
                                onClick={handlePunchIn}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-md
                  text-[11px] font-semibold tracking-[0.15em] uppercase
                  bg-[#C9A227] hover:bg-[#E6B93A] active:bg-[#9B7A18]
                  text-[#0A0A0A] shadow-sm transition-colors duration-150"
                            >
                                {/* Play icon */}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                                    aria-hidden="true">
                                    <path d="M5 3l14 9-14 9V3z" />
                                </svg>
                                Start Work
                            </button>
                        ) : (
                            <button
                                onClick={handlePunchOut}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-md
                  text-[11px] font-semibold tracking-[0.15em] uppercase
                  border border-red-300 text-red-500
                  hover:bg-red-50 active:bg-red-100
                  transition-colors duration-150"
                            >
                                {/* Stop icon */}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                                    aria-hidden="true">
                                    <rect x="4" y="4" width="16" height="16" rx="2" />
                                </svg>
                                End Work
                            </button>
                        )}
                    </div>

                </div>
            </div>

            {/* ── Work log history table ── */}
            <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

                {/* Card header */}
                <div className="px-5 py-4 border-b border-[#EBEBEB]">
                    <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
                        History
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
                                <Th>Login</Th>
                                <Th>Logout</Th>
                                <Th>Duration</Th>
                                <Th>Status</Th>
                                <Th>Work Summary</Th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#EBEBEB]">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-14">
                                        <p className="text-xs tracking-wide text-[#AAAAAA]">
                                            No work logs found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id}
                                        className="hover:bg-[#F8F5EE] transition-colors duration-100">

                                        <td className="px-5 py-3 text-xs text-[#333333] tabular-nums">
                                            {formatDateTime(log.loginTime) ?? <span className="text-[#AAAAAA]">—</span>}
                                        </td>

                                        <td className="px-5 py-3 text-xs text-[#333333] tabular-nums">
                                            {formatDateTime(log.logoutTime) ?? <span className="text-[#AAAAAA]">—</span>}
                                        </td>

                                        <td className="px-5 py-3 text-xs font-medium text-[#333333] tabular-nums">
                                            {formatMinutes(log.totalMinutes) ?? <span className="text-[#AAAAAA]">—</span>}
                                        </td>

                                        <td className="px-5 py-3">
                                            <StatusBadge status={log.status} />
                                        </td>

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
                                ))
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Footer count */}
                {logs.length > 0 && (
                    <div className="px-5 py-3 border-t border-[#EBEBEB] bg-[#F8F5EE]">
                        <p className="text-[10px] text-[#AAAAAA] tracking-wide">
                            <span className="text-[#333333] font-medium">{logs.length}</span>{" "}
                            log{logs.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                )}

            </div>

            {/* ── Work summary modal ── */}
            {showModal && (
                <div className="fixed inset-0 bg-[#0A0A0A]/60 backdrop-blur-[2px]
          flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-xl
            w-full max-w-2xl overflow-hidden">

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

                        <div className="px-6 py-5 max-h-[360px] overflow-y-auto">
                            <p className="text-xs text-[#333333] leading-6 whitespace-pre-wrap">
                                {selectedSummary}
                            </p>
                        </div>

                        <div className="px-6 py-4 border-t border-[#EBEBEB] bg-[#F8F5EE] flex justify-end">
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

export default EmployeeWorkLogDashboard;
