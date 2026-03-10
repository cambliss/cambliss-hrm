import { useEffect, useState } from "react";
import { getAllEmployees } from "../api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeEditForm from "../components/EmployeeEditForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const loadEmployees = async () => {
    const res = await getAllEmployees();
    setEmployees(res.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Management
          </h1>
          <p className="text-gray-500 mt-1">
            Add, edit and manage employee records.
          </p>
        </div>

        {/* Add Employee Form */}
        <EmployeeForm refresh={loadEmployees} />

        {/* Employee Table */}
        <EmployeeTable
          employees={employees}
          onEdit={setEditingEmployee}
        />

        {/* Edit Modal */}
        {editingEmployee && (
          <EmployeeEditForm
            employee={editingEmployee}
            refresh={loadEmployees}
            onClose={() => setEditingEmployee(null)}
          />
        )}

      </div>
    </div>
  );
};

export default Employees;
