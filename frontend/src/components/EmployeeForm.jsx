import { useState } from "react";
import { addEmployee } from "../api/employeeApi";
import toast from "react-hot-toast";
import { inputCls } from "../config/formStyles";

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

// ── Component ─────────────────────────────────────────────────────────────────
const EmployeeForm = ({ refresh, onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    role: "",
    joiningDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.firstName || !form.email || !form.role) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await addEmployee(form);
      toast.success("Employee added successfully");
      refresh();
      onClose();
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        role: "",
        joiningDate: "",
      });
    } catch (err) {
      toast.error(err.response?.data || "Error adding employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Grid fields ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">

        {[
          { label: "First Name", name: "firstName", required: true },
          { label: "Last Name", name: "lastName" },
          { label: "Email", name: "email", required: true },
          { label: "Phone", name: "phone" },
          { label: "Department", name: "department" },
          { label: "Designation", name: "designation" },
        ].map(({ label, name, required }) => (
          <Field key={name} label={label} required={required}>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              className={inputCls}
            />
          </Field>
        ))}

        {/* Role */}
        <Field label="Role" required>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={inputCls}
          >
            <option value="">Select role…</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="HR_ADMIN">HR Admin</option>
          </select>
        </Field>

        {/* Joining Date */}
        <Field label="Joining Date">
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate}
            onChange={handleChange}
            className={inputCls}
          />
        </Field>

      </div>

      {/* ── Required field note ── */}
      <p className="text-[9px] tracking-wide text-[#AAAAAA]">
        Fields marked <span className="text-[#C9A227]">*</span> are required.
      </p>

      {/* ── Divider ── */}
      <div className="border-t border-[#EBEBEB]" />

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3">
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
              Adding…
            </>
          ) : (
            "Add Employee"
          )}
        </button>
      </div>

    </form>
  );
};

export default EmployeeForm;
