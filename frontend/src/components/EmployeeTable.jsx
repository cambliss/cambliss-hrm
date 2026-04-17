import { useState } from "react";

const EmployeeTable = ({ employees, onEdit }) => {
  const [search, setSearch] = useState("");

  const filtered = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">
          Employees
        </h2>

        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full text-sm">

        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-3 text-left">Name</th>
            <th className="py-3 text-left">Department</th>
            <th className="py-3 text-left">Role</th>
            <th className="py-3 text-left">Status</th>
            <th className="py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-10 text-gray-400">
                No employees found
              </td>
            </tr>
          ) : (
            filtered.map(emp => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">

                <td className="py-3">
                  <div className="font-medium text-gray-800">
                    {emp.firstName} {emp.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {emp.email}
                  </div>
                </td>

                <td className="py-3">{emp.department}</td>
                <td className="py-3">{emp.role}</td>

                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    emp.employmentStatus === "ACTIVE"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {emp.employmentStatus}
                  </span>
                </td>

                <td className="py-3">
                  <button
                    onClick={() => onEdit(emp)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
};

export default EmployeeTable;