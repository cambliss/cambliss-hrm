import { useState, useEffect } from "react";
import { updateEmployee } from "../api/employeeApi";
import { createPortal } from "react-dom";

const EmployeeEditForm = ({ employee, onClose, refresh }) => {
  const [form, setForm] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    phone: employee.phone,
    department: employee.department,
    role: employee.role,
    employmentStatus: employee.employmentStatus,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(employee.id, {
        ...form,
        email: employee.email,
        joiningDate: employee.joiningDate,
      });

      alert("Employee updated successfully");
      refresh();
      onClose();
    } catch (err) {
      alert("Unable to update employee");
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 
                   w-full max-w-2xl max-h-[85vh]
                   flex flex-col overflow-hidden"
      >
        
        <div className="p-8 space-y-6 overflow-y-auto pr-3">
          
          <h3 className="text-xl font-semibold text-gray-800">
            Edit Employee
          </h3>

          {/* Employee Code */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Employee Code
            </label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-500"
              value={employee.employeeCode}
              disabled
            />
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-500"
              value={employee.email}
              disabled
            />
          </div>

          {/* Phone & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Department
              </label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Employment Status
              </label>
              <select
                name="employmentStatus"
                value={form.employmentStatus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 p-6 border-t bg-white">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
          >
            Update
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>

      </form>

    </div>,
    document.body
  );
};

export default EmployeeEditForm;
