import { useEffect, useState } from "react";
import { getAllEmployees } from "../api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeEditForm from "../components/EmployeeEditForm";
import ModalPortal from "../components/ui/ModalPortal";
import StatCard from "../components/ui/StatCard";

// ── Plus icon ─────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// ── Close icon ────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ── Modal shell ───────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <ModalPortal>
    <div className="fixed inset-0 bg-[#0A0A0A]/60 backdrop-blur-[2px]
      flex items-center justify-center z-[999] px-4">
      <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-xl
        w-full max-w-lg relative overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4
          border-b border-[#EBEBEB]">
          <div>
            <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
              Employee
            </p>
            <h3 className="text-sm font-medium text-[#0A0A0A]"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-md flex items-center justify-center
              text-[#AAAAAA] hover:text-[#333333] hover:bg-[#F8F5EE]
              transition-colors duration-150"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5">
          {children}
        </div>

      </div>
    </div>
  </ModalPortal>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const activeCount = employees.filter(e => e.employmentStatus === "ACTIVE").length;
  const inactiveCount = employees.filter(e => e.employmentStatus !== "ACTIVE").length;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-1">
            Management
          </p>
          <h1 className="text-2xl font-light text-[#0A0A0A] leading-tight"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            Employee Management
          </h1>
          <p className="text-xs text-[#AAAAAA] mt-1 tracking-wide">
            Manage your workforce efficiently
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md
            bg-[#C9A227] hover:bg-[#E6B93A] active:bg-[#9B7A18]
            text-[#0A0A0A] text-xs font-semibold tracking-[0.15em] uppercase
            shadow-sm transition-colors duration-150 shrink-0"
        >
          <PlusIcon />
          Add Employee
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Employees" value={employees.length} />
        <StatCard label="Active" value={activeCount} accent />
        <StatCard label="Inactive" value={inactiveCount} muted />
      </div>

      {/* ── Table / loading ── */}
      {loading ? (
        <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
          py-16 text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#AAAAAA] animate-pulse">
            Loading employees…
          </p>
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={setEditingEmployee}
        />
      )}

      {/* ── Add employee modal ── */}
      {showForm && (
        <Modal title="Add Employee" onClose={() => setShowForm(false)}>
          <EmployeeForm
            refresh={loadEmployees}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}

      {/* ── Edit employee modal ── */}
      {editingEmployee && (
        <EmployeeEditForm
          employee={editingEmployee}
          refresh={loadEmployees}
          onClose={() => setEditingEmployee(null)}
        />
      )}

    </div>
  );
};

export default Employees;
