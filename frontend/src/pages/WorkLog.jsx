import React, { useEffect, useState } from "react";
import {
    getEmployeeLogs,
    punchIn,
    punchOut,
} from "../services/workLogService";
import { useAuth } from "../context/AuthContext";

const WorkLog = () => {

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

            const active = response.data.find(
                (log) => log.status === "ACTIVE"
            );

            setActiveLog(active || null);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

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

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";

        return new Date(dateTime).toLocaleString();
    };

    const formatMinutes = (minutes) => {

        if (!minutes && minutes !== 0) return "-";

        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${hrs}h ${mins}m`;
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* worklog content */}
            <h2>Work Log Dashboard</h2>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    marginBottom: "20px",
                    borderRadius: "10px",
                }}
            >
                <h3>Current Status</h3>

                <div className="flex items-center gap-4 mb-3">
                    <p>
                        <strong>Employee:</strong> {user?.name}
                    </p>

                    <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${activeLog
                            ? "bg-green-500"
                            : "bg-gray-500"
                            }`}
                    >
                        {activeLog ? "ACTIVE" : "NOT WORKING"}
                    </span>
                </div>

                {activeLog && (
                    <>
                        <p>
                            <strong>Login Time:</strong>{" "}
                            {formatDateTime(activeLog.loginTime)}
                        </p>
                        <div className="mt-4">
                            <label className="block mb-2 font-medium">
                                Today's Work Summary
                            </label>

                            <textarea
                                value={workSummary}
                                onChange={(e) =>
                                    setWorkSummary(e.target.value)
                                }
                                rows="4"
                                className="w-full border rounded-lg p-3"
                                placeholder="Describe what you worked on today..."
                            />
                        </div>
                    </>
                )}

                {!activeLog ? (
                    <button
                        onClick={handlePunchIn}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                        Start Work
                    </button>
                ) : (
                    <button
                        onClick={handlePunchOut}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                        End Work
                    </button>
                )}
            </div>

            <h3>Work Log History</h3>

            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-100">
                        <th>ID</th>
                        <th>Login Time</th>
                        <th>Logout Time</th>
                        <th>Total Minutes</th>
                        <th>Status</th>
                        <th>Work Summary</th>
                    </tr>
                </thead>

                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-4"
                            >
                                No work logs found
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr
                                key={log.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td>{log.id}</td>

                                <td>
                                    {formatDateTime(log.loginTime)}
                                </td>

                                <td>
                                    {formatDateTime(log.logoutTime)}
                                </td>

                                <td>
                                    {formatMinutes(log.totalMinutes)}
                                </td>

                                <td>
                                    <span
                                        className={`px-2 py-1 rounded-full text-white text-xs ${log.status === "ACTIVE"
                                            ? "bg-green-500"
                                            : "bg-blue-500"
                                            }`}
                                    >
                                        {log.status}
                                    </span>
                                </td>

                                <td className="max-w-xs">
                                    {log.workSummary ? (
                                        <>
                                            <p className="truncate">
                                                {log.workSummary}
                                            </p>

                                            <button
                                                onClick={() => {
                                                    setSelectedSummary(log.workSummary);
                                                    setShowModal(true);
                                                }}
                                                className="text-blue-600 text-sm hover:underline mt-1"
                                            >
                                                View
                                            </button>
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {/* work summary modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">

                        <h2 className="text-xl font-semibold mb-4">
                            Daily Work Summary
                        </h2>

                        <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap text-gray-700">
                            {selectedSummary}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
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

export default WorkLog;
