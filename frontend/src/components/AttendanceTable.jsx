import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import {
  requestCorrection,
  approveCorrection,
  rejectCorrection,
} from "../api/attendanceApi";

const AttendanceTable = ({ records, refresh, employeeId }) => {
  const { user } = useAuth();

  const [correctionData, setCorrectionData] = useState({
    attendanceId: null,
    requestedStatus: "",
    reason: "",
  });

  if (!records.length) {
    return (
      <div className="bg-white p-4 rounded shadow text-gray-500">
        Select an employee to view attendance history
      </div>
    );
  }

  const isEmployee = user.role === ROLES.EMPLOYEE;
  const isHRorAdmin =
    user.role === ROLES.HR_ADMIN ||
    user.role === ROLES.SUPER_ADMIN;

  const handleRequest = async () => {
    const { attendanceId, requestedStatus, reason } =
      correctionData;

    if (!requestedStatus) {
      alert("Select requested status");
      return;
    }

    await requestCorrection(attendanceId, {
      requestedStatus,
      correctionReason: reason,
    });

    setCorrectionData({
      attendanceId: null,
      requestedStatus: "",
      reason: "",
    });

    refresh(user.employeeId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>

        <tbody>
          {records.map((a) => (
            <tr key={a.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-gray-700">{a.attendanceDate}</td>

              {/* Current Status */}
              <td className="px-4 py-3 text-gray-700">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    a.status === "PRESENT"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.status}
                </span>
              </td>

              {/* Requested Status */}
              <td className="px-4 py-3 text-gray-700">
                {a.requestedStatus ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {a.requestedStatus}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>

              {/* Reason */}
              <td className="px-4 py-3 text-gray-700">
                {a.correctionReason || "-"}
              </td>

              {/* Action Column */}
              <td className="px-4 py-3 text-gray-700">

                {/* EMPLOYEE - Request Correction */}
                {isEmployee && !a.requestedStatus && (
                  <div className="space-y-2">
                    {correctionData.attendanceId === a.id ? (
                      <>
                        <select
                          className="border p-1 rounded"
                          value={correctionData.requestedStatus}
                          onChange={(e) =>
                            setCorrectionData({
                              ...correctionData,
                              requestedStatus: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="PRESENT">
                            Mark as Present
                          </option>
                          <option value="ABSENT">
                            Mark as Absent
                          </option>
                        </select>

                        <input
                          type="text"
                          placeholder="Reason"
                          className="border p-1 rounded w-full"
                          value={correctionData.reason}
                          onChange={(e) =>
                            setCorrectionData({
                              ...correctionData,
                              reason: e.target.value,
                            })
                          }
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={handleRequest}
                            className="text-blue-600 hover:underline"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() =>
                              setCorrectionData({
                                attendanceId: null,
                                requestedStatus: "",
                                reason: "",
                              })
                            }
                            className="text-gray-500 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setCorrectionData({
                            attendanceId: a.id,
                            requestedStatus: "",
                            reason: "",
                          })
                        }
                        className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        Request Correction
                      </button>
                    )}
                  </div>
                )}

                {/* HR/ADMIN - Approve/Reject */}
                {isHRorAdmin && a.requestedStatus && (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        approveCorrection(a.id).then(() =>
                          refresh(employeeId)
                        )
                      }
                      className="px-3 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectCorrection(a.id).then(() =>
                          refresh(employeeId)
                        )
                      }
                      className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* Others */}
                {!isEmployee &&
                  !isHRorAdmin &&
                  !a.requestedStatus && (
                    <span className="text-gray-400">—</span>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
