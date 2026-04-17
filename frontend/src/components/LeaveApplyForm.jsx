import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { submitLeave } from "../api/leaveApi";
import toast from "react-hot-toast";

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      setForm({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });

    } catch (err) {
      toast.error(err.response?.data || "Error submitting leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white rounded-xl shadow-sm border p-6 space-y-6" onSubmit={handleSubmit}>

      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Apply Leave
        </h3>
        <p className="text-sm text-gray-500">
          Submit leave request for approval
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="text-sm text-gray-600">Leave Type</label>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          >
            <option value="CASUAL">Casual</option>
            <option value="SICK">Sick</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        <div></div>

        <div>
          <label className="text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm text-gray-600">Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

      </div>

      <div className="flex justify-end">
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>

    </form>
  );
};

export default LeaveApplyForm;