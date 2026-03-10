import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { submitLeave } from "../api/leaveApi";

const LeaveApplyForm = ({ refresh }) => {
  const { user } = useAuth();

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

    await submitLeave({
      employee: { id: user.employeeId },
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
    });
    alert("Leave request submitted successfully");
    refresh(user.employeeId);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          Apply Leave
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Submit a leave request for approval.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Leave Type
          </label>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="CASUAL">Casual</option>
            <option value="SICK">Sick</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        <div></div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Reason
          </label>
          <textarea
            name="reason"
            placeholder="Brief reason for leave"
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition">
          Submit Request
        </button>
      </div>
    </form>
  );
};

export default LeaveApplyForm;
