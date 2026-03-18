import { useState } from "react";
import { addEmployee } from "../api/employeeApi";

const EmployeeForm = ({ refresh }) => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee(form);
      alert("Employee added successfully");
      refresh();
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
      alert(err.response?.data || "Error adding employee");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
    >
      <h3 className="col-span-3 text-lg font-semibold text-gray-700">
        Add New Employee
      </h3>

      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
      />

      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
      />

      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        name="department"
        placeholder="Department"
        value={form.department}
        onChange={handleChange}
      />

      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        name="designation"
        placeholder="Designation"
        value={form.designation}
        onChange={handleChange}
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="">Select Role</option>
        <option value="EMPLOYEE">Employee</option>
        <option value="MANAGER">Manager</option>
        <option value="HR_ADMIN">HR Admin</option>
      </select>

      <input
        type="date"
        name="joiningDate"
        value={form.joiningDate}
        className="border p-2 rounded"
        onChange={handleChange}
      />

      <div className="col-span-3 text-right">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
        >
          Add Employee
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
