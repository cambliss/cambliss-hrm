import { useEffect, useState } from "react";
import LeaveApplyForm from "../components/LeaveApplyForm";
import LeaveList from "../components/LeaveList";
import LeaveBalance from "../components/LeaveBalance";
import { getLeavesByEmployee, getLeaveBalance } from "../api/leaveApi";
import { getAllEmployees } from "../api/employeeApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";

const Leaves = () => {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [balance, setBalance] = useState(null);

  const loadLeavesAndBalance = async (empId) => {
    if (!empId) return;

    setEmployeeId(empId);

    const [leavesRes, balanceRes] = await Promise.all([
      getLeavesByEmployee(empId),
      getLeaveBalance(empId),
    ]);

    setLeaves(leavesRes.data);
    setBalance(balanceRes.data);
  };

  useEffect(() => {
    // EMPLOYEE -> auto-load own data
    if (user.role === ROLES.EMPLOYEE) {
      loadLeavesAndBalance(user.employeeId);
      return;
    }

    // HR / ADMIN -> all employees
    if (
      user.role === ROLES.HR_ADMIN ||
      user.role === ROLES.SUPER_ADMIN
    ) {
      getAllEmployees().then(res => setEmployees(res.data));
    }

    // MANAGER -> team only
    if (user.role === ROLES.MANAGER) {
      getAllEmployees().then(res => {
        setEmployees(res.data);
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Leave Management
          </h1>
          <p className="text-gray-500 mt-1">
            Apply for leave and manage leave approvals.
          </p>
        </div>

        {/* Employee Selector */}
        {user.role !== ROLES.EMPLOYEE && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Employee
            </label>
            <select
              value={employeeId || ""}
              onChange={(e) =>
                loadLeavesAndBalance(e.target.value)
              }
              className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.employeeCode} - {emp.firstName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Leave Apply */}
        {user.role === ROLES.EMPLOYEE && (
          <LeaveApplyForm refresh={loadLeavesAndBalance} />
        )}

        {/* Leave Balance */}
        {balance && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Leave Balance
            </h2>
            <LeaveBalance balance={balance} />
          </div>
        )}

        {/* Leave Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Leave Requests
          </h2>

          <LeaveList
            leaves={leaves}
            refresh={loadLeavesAndBalance}
            employeeId={employeeId}
          />
        </div>

      </div>
    </div>
  );
};

export default Leaves;
