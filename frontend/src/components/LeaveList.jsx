import { approveLeave, rejectLeave } from "../api/leaveApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";

const LeaveList = ({ leaves, refresh, employeeId }) => {
  const { user } = useAuth();

  if (!leaves.length) {
    return (
      <div className="bg-white p-4 rounded shadow text-gray-500">
        Select an employee to view leave requests
      </div>
    );
  }

  const isAdminOrHR =
    user.role === ROLES.SUPER_ADMIN ||
    user.role === ROLES.HR_ADMIN;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
        </tr>
      </thead>

      <tbody>
        {leaves.map((l) => {
          const isManager = user.role === ROLES.MANAGER;

          const canApprove = isAdminOrHR || isManager;

          return (
            <tr key={l.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-gray-700">{l.leaveType}</td>
              <td className="px-4 py-3 text-gray-700">{l.startDate}</td>
              <td className="px-4 py-3 text-gray-700">{l.endDate}</td>
              <td className="px-4 py-3 text-gray-700">
                {l.reason || "-"}
              </td>

              <td className="px-4 py-3 text-gray-700">
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

              <td className="px-4 py-3 text-gray-700">
                {canApprove && l.status === "PENDING" ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        approveLeave(l.id).then(() =>
                          refresh(employeeId)
                        )
                      }
                      className="px-3 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectLeave(l.id).then(() =>
                          refresh(employeeId)
                        )
                      }
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
          );
        })}
      </tbody>
    </table>
    </div>
  );
};

export default LeaveList;
