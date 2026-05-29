import React, { useEffect, useState } from "react";
import {
    getEmployeeLogs,
    punchIn,
    punchOut,
} from "../services/workLogService";
import { useAuth } from "../context/AuthContext";

const EmployeeWorkLogDashboard = () => {

    const { user } = useAuth();
    const employeeId = user?.employeeId;

    const [logs, setLogs] = useState([]);
    const [activeLog, setActiveLog] = useState(null);

    const [workSummary, setWorkSummary] =
        useState("");

    const [selectedSummary, setSelectedSummary] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const fetchLogs = async () => {

        try {

            const response =
                await getEmployeeLogs(employeeId);

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
        if (employeeId) {
            fetchLogs();
        }
    }, [employeeId]);

    const handlePunchIn = async () => {

        try {

            await punchIn(employeeId);

            fetchLogs();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Punch in failed"
            );
        }
    };

    const handlePunchOut = async () => {

        try {

            await punchOut(
                employeeId,
                workSummary
            );

            fetchLogs();

            setWorkSummary("");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Punch out failed"
            );
        }
    };

    const formatDateTime = (dateTime) => {

        if (!dateTime) return "-";

        return new Date(dateTime)
            .toLocaleString();
    };

    const formatMinutes = (minutes) => {

        if (!minutes && minutes !== 0)
            return "-";

        const hrs =
            Math.floor(minutes / 60);

        const mins =
            minutes % 60;

        return `${hrs}h ${mins}m`;
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Work Log Dashboard
                </h1>

                <p className="text-gray-500 text-sm">
                    Track your daily work sessions
                </p>
            </div>

            {/* STATUS CARD */}
            <div className="bg-white rounded-xl shadow-sm border p-6">

                <h3 className="text-lg font-semibold mb-4">
                    Current Status
                </h3>

                <div className="flex items-center gap-4 mb-3">

                    <p>
                        <strong>Employee:</strong>{" "}
                        {user?.name}
                    </p>

                    <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${activeLog
                            ? "bg-green-500"
                            : "bg-gray-500"
                            }`}
                    >
                        {activeLog
                            ? "ACTIVE"
                            : "NOT WORKING"}
                    </span>
                </div>

                {activeLog && (
                    <>
                        <p className="mb-4">
                            <strong>Login Time:</strong>{" "}
                            {formatDateTime(
                                activeLog.loginTime
                            )}
                        </p>

                        <div className="mt-4">

                            <label className="block mb-2 font-medium">
                                Today's Work Summary
                            </label>

                            <textarea
                                value={workSummary}
                                onChange={(e) =>
                                    setWorkSummary(
                                        e.target.value
                                    )
                                }
                                rows="4"
                                className="w-full border rounded-lg p-3"
                                placeholder="Describe what you worked on today..."
                            />
                        </div>
                    </>
                )}

                <div className="mt-4">
                    {!activeLog ? (
                        <button
                            onClick={handlePunchIn}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                            Start Work
                        </button>
                    ) : (
                        <button
                            onClick={handlePunchOut}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            End Work
                        </button>
                    )}
                </div>

            </div>

            {/* HISTORY TABLE */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">
                        Work Log History
                    </h3>
                </div>

                <table className="w-full text-sm">

                    <thead className="bg-gray-50 border-b">

                        <tr className="text-gray-500 text-xs uppercase tracking-wider">

                            <th className="px-6 py-3 text-left">
                                Login
                            </th>

                            <th className="px-6 py-3 text-left">
                                Logout
                            </th>

                            <th className="px-6 py-3 text-left">
                                Duration
                            </th>

                            <th className="px-6 py-3 text-left">
                                Status
                            </th>

                            <th className="px-6 py-3 text-left">
                                Work Summary
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {logs.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-6 text-gray-400"
                                >
                                    No work logs found
                                </td>
                            </tr>

                        ) : (

                            logs.map((log) => (

                                <tr
                                    key={log.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4">
                                        {formatDateTime(
                                            log.loginTime
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {formatDateTime(
                                            log.logoutTime
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {formatMinutes(
                                            log.totalMinutes
                                        )}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${log.status === "ACTIVE"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {log.status}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4 max-w-xs">

                                        {log.workSummary ? (
                                            <>
                                                <p className="truncate">
                                                    {log.workSummary}
                                                </p>

                                                <button
                                                    onClick={() => {
                                                        setSelectedSummary(
                                                            log.workSummary
                                                        );

                                                        setShowModal(true);
                                                    }}
                                                    className="text-blue-600 text-sm hover:underline mt-1 cursor-pointer"
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

            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4 shadow-lg">

                        <h2 className="text-xl font-semibold mb-4">
                            Daily Work Summary
                        </h2>

                        <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap text-gray-700 leading-7">
                            {selectedSummary}
                        </div>

                        <div className="flex justify-end mt-6">

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
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

export default EmployeeWorkLogDashboard;
