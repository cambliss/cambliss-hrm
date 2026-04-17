import { useEffect, useState } from "react";
import { getAllEmployees } from "../api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeEditForm from "../components/EmployeeEditForm";

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

  return (
    <div className="space-y-6">

      {/* Header + Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your workforce efficiently
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
        >
          + Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Employees</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {employees.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <h2 className="text-2xl font-bold text-green-500">
            {employees.filter(e => e.employmentStatus === "ACTIVE").length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Inactive</p>
          <h2 className="text-2xl font-bold text-red-500">
            {employees.filter(e => e.employmentStatus !== "ACTIVE").length}
          </h2>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white p-10 rounded-xl shadow-sm text-center text-gray-400">
          Loading employees...
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={setEditingEmployee}
        />
      )}

      {/* Add Employee Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <EmployeeForm
              refresh={loadEmployees}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
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