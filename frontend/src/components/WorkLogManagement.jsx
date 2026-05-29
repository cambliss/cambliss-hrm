import { useEffect, useState } from "react";

import { getAllEmployees }
    from "../api/employeeApi";

import { getEmployeeLogs }
    from "../services/workLogService";

const WorkLogManagement = () => {

    const [employees, setEmployees] =
        useState([]);

    const [selectedEmployeeId,
        setSelectedEmployeeId] =
        useState("");

    const [records, setRecords] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [selectedSummary,
        setSelectedSummary] =
        useState("");

    const [showModal,
        setShowModal] =
        useState(false);

    useEffect(() => {

        getAllEmployees()
            .then((res) =>
                setEmployees(res.data));

    }, []);

    const loadWorkLogs = async (employeeId) => {

        if (!employeeId) return;

        try {

            setLoading(true);

            setSelectedEmployeeId(employeeId);

            const response =
                await getEmployeeLogs(employeeId);

            setRecords(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
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
                    WorkLog Management
                </h1>

                <p className="text-gray-500 text-sm">
                    Monitor and review employee work logs
                </p>

            </div>

            {/* STATS */}
            {selectedEmployeeId && (

                <div className="grid grid-cols-3 gap-6">

                    <div className="bg-white p-5 rounded-xl shadow-sm">

                        <p className="text-sm text-gray-500">
                            Total Logs
                        </p>

                        <h2 className="text-2xl font-bold text-blue-600">
                            {records.length}
                        </h2>

                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm">

                        <p className="text-sm text-gray-500">
                            Active Sessions
                        </p>

                        <h2 className="text-2xl font-bold text-green-600">

                            {
                                records.filter(
                                    r => r.status === "ACTIVE"
                                ).length
                            }

                        </h2>

                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm">

                        <p className="text-sm text-gray-500">
                            Completed Sessions
                        </p>

                        <h2 className="text-2xl font-bold text-indigo-600">

                            {
                                records.filter(
                                    r => r.status === "COMPLETED"
                                ).length
                            }

                        </h2>

                    </div>

                </div>

            )}

            {/* EMPLOYEE FILTER */}
            <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between">

                <div>

                    <h3 className="text-sm font-semibold text-gray-700">
                        Employee Filter
                    </h3>

                    <p className="text-xs text-gray-500">
                        Select an employee to view work logs
                    </p>

                </div>

                <select
                    value={selectedEmployeeId}
                    onChange={(e) =>
                        loadWorkLogs(e.target.value)
                    }
                    className="w-72 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >

                    <option value="">
                        Select Employee
                    </option>

                    {employees.map(emp => (

                        <option
                            key={emp.id}
                            value={emp.id}
                        >
                            {emp.employeeCode}
                            {" - "}
                            {emp.firstName}
                        </option>

                    ))}

                </select>

            </div>

            {/* TABLE */}
            {loading ? (

                <div className="bg-white p-10 rounded-xl text-center text-gray-400">
                    Loading work logs...
                </div>

            ) : (

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

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

                            {records.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-6 text-gray-400"
                                    >
                                        No work logs found
                                    </td>

                                </tr>

                            ) : (

                                records.map((log) => (

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

            )}

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

export default WorkLogManagement;
