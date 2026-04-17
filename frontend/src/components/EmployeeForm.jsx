import { useState } from "react";
import { addEmployee } from "../api/employeeApi";
import toast from "react-hot-toast";

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
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Add Employee
        </h3>
        <p className="text-sm text-gray-500">
          Fill in employee details
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/** Input Field Helper */}
        {[
          { label: "First Name", name: "firstName" },
          { label: "Last Name", name: "lastName" },
          { label: "Email", name: "email" },
          { label: "Phone", name: "phone" },
          { label: "Department", name: "department" },
          { label: "Designation", name: "designation" },
        ].map((field) => (
          <div key={field.name}>
            <label className="text-sm text-gray-600">
              {field.label}
            </label>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ))}

        {/* Role */}
        <div>
          <label className="text-sm text-gray-600">Role *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Role</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="HR_ADMIN">HR Admin</option>
          </select>
        </div>

        {/* Joining Date */}
        <div>
          <label className="text-sm text-gray-600">Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;