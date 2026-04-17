import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import {
  requestCorrection,
  approveCorrection,
  rejectCorrection,
} from "../api/attendanceApi";
import toast from "react-hot-toast";

const AttendanceTable = ({ records, refresh, employeeId }) => {
  const { user } = useAuth();

  const [correctionData, setCorrectionData] = useState({
    attendanceId: null,
    requestedStatus: "",
    reason: "",
  });

  const isEmployee = user.role === ROLES.EMPLOYEE;
  const isHRorAdmin =
    user.role === ROLES.HR_ADMIN ||
    user.role === ROLES.SUPER_ADMIN;

  const handleRequest = async () => {
    const { attendanceId, requestedStatus, reason } = correctionData;

    if (!requestedStatus) {
      toast.error("Select status");
      return;
    }

    await requestCorrection(attendanceId, {
      requestedStatus,
      correctionReason: reason,
    });

    toast.success("Request submitted");

    setCorrectionData({
      attendanceId: null,
      requestedStatus: "",
      reason: "",
    });

    refresh(user.employeeId);
  };

  if (!records.length) {
    return (
      <div className="bg-white p-6 rounded-xl text-gray-400 text-center">
        No attendance records found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

      <table className="w-full text-sm">

        {/* HEADER */}
        <thead className="bg-gray-50 border-b">
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Requested</th>
            <th className="px-6 py-3 text-left">Reason</th>
            <th className="px-6 py-3 text-left">Action</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {records.map((a) => (
            <tr
              key={a.id}
              className="border-b hover:bg-gray-50 transition"
            >

              {/* DATE */}
              <td className="px-6 py-4 text-gray-700">
                {a.attendanceDate}
              </td>

              {/* STATUS */}
              <td className="px-6 py-4">
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

              {/* REQUESTED */}
              <td className="px-6 py-4">
                {a.requestedStatus ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {a.requestedStatus}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>

              {/* REASON */}
              <td className="px-6 py-4 text-gray-600">
                {a.correctionReason || "-"}
              </td>

              {/* ACTION */}
              <td className="px-6 py-4">

                {/* EMPLOYEE */}
                {isEmployee && !a.requestedStatus && (
                  <div>
                    {correctionData.attendanceId === a.id ? (
                      <div className="space-y-2">

                        <select
                          className="w-full border rounded-lg px-2 py-1 text-sm"
                          value={correctionData.requestedStatus}
                          onChange={(e) =>
                            setCorrectionData({
                              ...correctionData,
                              requestedStatus: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Reason"
                          className="w-full border rounded-lg px-2 py-1 text-sm"
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
                            className="text-blue-600 text-xs hover:underline"
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
                            className="text-gray-500 text-xs hover:underline"
                          >
                            Cancel
                          </button>
                        </div>

                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setCorrectionData({
                            attendanceId: a.id,
                            requestedStatus: "",
                            reason: "",
                          })
                        }
                        className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      >
                        Request
                      </button>
                    )}
                  </div>
                )}

                {/* ADMIN */}
                {isHRorAdmin && a.requestedStatus && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        approveCorrection(a.id).then(() =>
                          refresh(employeeId)
                        );
                        toast.success("Approved");
                      }}
                      className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        rejectCorrection(a.id).then(() =>
                          refresh(employeeId)
                        );
                        toast.error("Rejected");
                      }}
                      className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
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