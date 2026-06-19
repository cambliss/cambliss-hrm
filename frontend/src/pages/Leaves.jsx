import { useEffect, useState } from "react";
import LeaveApplyForm from "../components/LeaveApplyForm";
import LeaveList from "../components/LeaveList";
import LeaveBalance from "../components/LeaveBalance";
import { getLeavesByEmployee, getLeaveBalance } from "../api/leaveApi";
import { getAllEmployees } from "../api/employeeApi";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import { inputCls } from "../config/formStyles";

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
    if (user.role === ROLES.EMPLOYEE) {
      loadLeavesAndBalance(user.employeeId);
      return;
    }
    getAllEmployees().then(res => setEmployees(res.data));
  }, [user]);

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div>
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-1">
          Management
        </p>
        <h1
          className="text-2xl font-light text-[#0A0A0A] leading-tight"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          Leave Management
        </h1>
        <p className="text-xs text-[#AAAAAA] mt-1 tracking-wide">
          Apply and manage leave requests
        </p>
      </div>

      {/* ── Employee filter — HR / Admin / Manager only ── */}
      {user.role !== ROLES.EMPLOYEE && (
        <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EBEBEB]">
            <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
              Filter
            </p>
            <h2
              className="text-sm font-medium text-[#0A0A0A]"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
            >
              Select Employee
            </h2>
          </div>
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center
            justify-between gap-4">
            <p className="text-xs text-[#AAAAAA] tracking-wide">
              Choose an employee to load their leave data.
            </p>
            <select
              value={employeeId || ""}
              onChange={(e) => loadLeavesAndBalance(e.target.value)}
              className={`${inputCls} sm:w-72`}
            >
              <option value="">Select employee…</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.employeeCode} — {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── Apply Leave form — Employee role only ── */}
      {user.role === ROLES.EMPLOYEE && (
        <LeaveApplyForm refresh={loadLeavesAndBalance} />
      )}

      {/* ── Leave balance cards ── */}
      <LeaveBalance balance={balance} />

      {/* ── Leave list / loading ── */}
      {loading ? (
        <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
          py-16 text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#AAAAAA] animate-pulse">
            Loading leave data…
          </p>
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
