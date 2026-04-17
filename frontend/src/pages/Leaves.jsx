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
  const [loading, setLoading] = useState(false);

  const loadLeavesAndBalance = async (empId) => {
    if (!empId) return;

    try {
      setLoading(true);
      setEmployeeId(empId);

      const [leavesRes, balanceRes] = await Promise.all([
        getLeavesByEmployee(empId),
        getLeaveBalance(empId),
      ]);

      setLeaves(leavesRes.data);
      setBalance(balanceRes.data);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // EMPLOYEE -> auto-load own data
    if (user.role === ROLES.EMPLOYEE) {
      loadLeavesAndBalance(user.employeeId);
      return;
    }

    // HR / ADMIN / Manager -> all employees
    getAllEmployees().then(res => setEmployees(res.data));
  }, [user]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Leave Management
        </h1>
        <p className="text-gray-500 text-sm">
          Apply and manage leave requests
        </p>
      </div>

      {/* Employee Selector */}
      {user.role !== ROLES.EMPLOYEE && (
        <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between">

          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Employee Filter
            </h3>
            <p className="text-xs text-gray-500">
              Select employee to view leave data
            </p>
          </div>

          <select
            value={employeeId || ""}
            onChange={(e) =>
              loadLeavesAndBalance(e.target.value)
            }
            className="w-72 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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

      {/* Apply Leave */}
      {user.role === ROLES.EMPLOYEE && (
        <LeaveApplyForm refresh={loadLeavesAndBalance} />
      )}

      {/* Balance Cards */}
      {balance && (
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Casual Leave</p>
            <h2 className="text-2xl font-bold text-blue-600">
              {balance.casualLeaves || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Sick Leave</p>
            <h2 className="text-2xl font-bold text-green-600">
              {balance.sickLeaves || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Paid Leave</p>
            <h2 className="text-2xl font-bold text-purple-600">
              {balance.paidLeaves || 0}
            </h2>
          </div>

        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-white p-10 rounded-xl text-center text-gray-400">
          Loading leave data...
        </div>
      ) : (
        <LeaveList
          leaves={leaves}
          refresh={loadLeavesAndBalance}
          employeeId={employeeId}
        />
      )}

    </div>
  );
};

export default Leaves;