import { useState, useEffect } from "react";
import { updateEmployee } from "../api/employeeApi";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { inputCls, inputDisabledCls } from "../config/formStyles";

// ── Label ─────────────────────────────────────────────────────────────────────
const Label = ({ children, required = false }) => (
  <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-[#666666]">
    {children}
    {required && <span className="ml-0.5 text-[#C9A227]">*</span>}
  </label>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, required = false, children }) => (
  <div>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);

// ── Close icon ────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ── Friendly field label from camelCase ───────────────────────────────────────
const fieldLabel = (name) =>
  name.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

// ── Component ─────────────────────────────────────────────────────────────────
const EmployeeEditForm = ({ employee, onClose, refresh }) => {
  const [form, setForm] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    role: employee.role,
    employmentStatus: employee.employmentStatus,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.firstName || !form.role) {
      toast.error("Required fields missing");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await updateEmployee(employee.id, {
        ...form,
        email: employee.email,
        joiningDate: employee.joiningDate,
      });
      toast.success("Employee updated successfully");
      refresh();
      onClose();
    } catch (err) {
      toast.error("Unable to update employee");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-[#0A0A0A]/60 backdrop-blur-[2px]
      flex items-center justify-center z-50 px-4">

      <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-xl
        w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* ── Modal header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB] shrink-0">
          <div>
            <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
              Employee
            </p>
            <h3 className="text-sm font-medium text-[#0A0A0A]"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}>
              Edit Employee
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

        {/* ── Scrollable form body ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto">

            {/* Employee Code — read-only */}
            <Field label="Employee Code">
              <input
                value={employee.employeeCode}
                disabled
                className={inputDisabledCls}
              />
            </Field>

            {/* 2-col grid: firstName, lastName, phone, department */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {["firstName", "lastName", "phone", "department"].map((name) => (
                <Field
                  key={name}
                  label={fieldLabel(name)}
                  required={name === "firstName"}
                >
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </Field>
              ))}
            </div>

            {/* Designation — full width */}
            <Field label="Designation">
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            {/* Role + Status */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">

              <Field label="Role" required>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HR_ADMIN">HR Admin</option>
                </select>
              </Field>

              <Field label="Employment Status">
                <select
                  name="employmentStatus"
                  value={form.employmentStatus}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </Field>

            </div>

            {/* Required note */}
            <p className="text-[9px] tracking-wide text-[#AAAAAA]">
              Fields marked <span className="text-[#C9A227]">*</span> are required.
            </p>

          </div>

          {/* ── Footer ── */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#EBEBEB] shrink-0 bg-[#F8F5EE]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-[11px] font-medium tracking-wide uppercase
                border border-[#EBEBEB] text-[#666666]
                hover:border-[#AAAAAA] hover:text-[#333333]
                transition-colors duration-150"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md
                text-[11px] font-semibold tracking-[0.15em] uppercase
                bg-[#C9A227] hover:bg-[#E6B93A] active:bg-[#9B7A18]
                text-[#0A0A0A] shadow-sm
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors duration-150"
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-[#0A0A0A]/30
                    border-t-[#0A0A0A] animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};

export default EmployeeEditForm;
