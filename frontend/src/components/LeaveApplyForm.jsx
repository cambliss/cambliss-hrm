import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { submitLeave } from "../api/leaveApi";
import toast from "react-hot-toast";
import { inputCls, textareaCls } from "../config/formStyles";

// ── Label ─────────────────────────────────────────────────────────────────────
const Label = ({ children, required = false }) => (
  <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-[#666666] mb-1">
    {children}
    {required && <span className="ml-0.5 text-[#C9A227]">*</span>}
  </label>
);

// ── Component ─────────────────────────────────────────────────────────────────
const LeaveApplyForm = ({ refresh }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    leaveType: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      toast.error("Please select dates");
      return;
    }

    try {
      setLoading(true);
      await submitLeave({
        employee: { id: user.employeeId },
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });
      toast.success("Leave request submitted");
      refresh(user.employeeId);
      setForm({ leaveType: "CASUAL", startDate: "", endDate: "", reason: "" });
    } catch (err) {
      toast.error(err.response?.data || "Error submitting leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm overflow-hidden">

      {/* ── Card header ── */}
      <div className="px-5 py-4 border-b border-[#EBEBEB]">
        <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
          Leave
        </p>
        <h2
          className="text-sm font-medium text-[#0A0A0A]"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
        >
          Apply for Leave
        </h2>
      </div>

      {/* ── Form body ── */}
      <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">

        {/* Leave type — half width */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Leave Type</Label>
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="CASUAL">Casual</option>
              <option value="SICK">Sick</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label required>Start Date</Label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
          <div>
            <Label required>End Date</Label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
        </div>

        {/* Reason — full width */}
        <div>
          <Label>Reason</Label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
            placeholder="Briefly describe the reason for your leave…"
            className={textareaCls}
          />
        </div>

        {/* Required note */}
        <p className="text-[9px] tracking-wide text-[#AAAAAA]">
          Fields marked <span className="text-[#C9A227]">*</span> are required.
        </p>

        {/* ── Divider ── */}
        <div className="border-t border-[#EBEBEB]" />

        {/* ── Actions ── */}
        <div className="flex justify-end">
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
                Submitting…
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default LeaveApplyForm;
