import { useState, useEffect } from "react";
import { updateEmployee } from "../api/employeeApi";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

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
    return () => {
      document.body.style.overflow = "auto";
    };
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Edit Employee
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >

          <div className="p-6 space-y-6 overflow-y-auto">

            {/* Employee Code */}
            <div>
              <label className="text-sm text-gray-600">Employee Code</label>
              <input
                className="w-full mt-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-500"
                value={employee.employeeCode}
                disabled
              />
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-2 gap-4">

              {["firstName", "lastName", "phone", "department"].map((field) => (
                <div key={field}>
                  <label className="text-sm text-gray-600 capitalize">
                    {field}
                  </label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}

            </div>

            {/* Designation */}
            <div>
              <label className="text-sm text-gray-600">Designation</label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Role + Status */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-gray-600">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HR_ADMIN">HR Admin</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select
                  name="employmentStatus"
                  value={form.employmentStatus}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};

export default EmployeeEditForm;