import { approveLeave, rejectLeave } from "../api/leaveApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import toast from "react-hot-toast";

const LeaveList = ({ leaves, refresh, employeeId }) => {
  const { user } = useAuth();

  if (!leaves.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border text-center text-gray-400">
        No leave requests found
      </div>
    );
  }

  const isAdminOrHR =
    user.role === ROLES.SUPER_ADMIN ||
    user.role === ROLES.HR_ADMIN;

  const isManager = user.role === ROLES.MANAGER;

  const canApprove = isAdminOrHR || isManager;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

      <table className="w-full text-sm">

        {/* HEADER */}
        <thead className="bg-gray-50 border-b">
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">From</th>
            <th className="px-6 py-3 text-left">To</th>
            <th className="px-6 py-3 text-left">Reason</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Action</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {leaves.map((l) => (
            <tr
              key={l.id}
              className="border-b hover:bg-gray-50 transition"
            >

              {/* TYPE */}
              <td className="px-6 py-4 font-medium text-gray-800">
                {l.leaveType}
              </td>

              {/* DATES */}
              <td className="px-6 py-4 text-gray-600">
                {l.startDate}
              </td>

              <td className="px-6 py-4 text-gray-600">
                {l.endDate}
              </td>

              {/* REASON */}
              <td className="px-6 py-4 text-gray-600">
                {l.reason || "-"}
              </td>

              {/* STATUS */}
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    l.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : l.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {l.status}
                </span>
              </td>

              {/* ACTION */}
              <td className="px-6 py-4">

                {canApprove && l.status === "PENDING" ? (
                  <div className="flex gap-2">

                    <button
                      onClick={() => {
                        approveLeave(l.id).then(() =>
                          refresh(employeeId)
                        );
                        toast.success("Approved");
                      }}
                      className="px-3 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        rejectLeave(l.id).then(() =>
                          refresh(employeeId)
                        );
                        toast.error("Rejected");
                      }}
                      className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Reject
                    </button>

                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}

              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default LeaveList;