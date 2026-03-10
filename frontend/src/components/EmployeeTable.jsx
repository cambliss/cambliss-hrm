const EmployeeTable = ({ employees, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <table className="w-full bg-white rounded shadow">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
        </tr>
      </thead>

      <tbody>
        {employees.map(emp => (
          <tr
            key={emp.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="px-4 py-3 text-gray-700">{emp.employeeCode}</td>
            <td className="px-4 py-3 text-gray-700">
              {emp.firstName} {emp.lastName}
            </td>
            <td className="px-4 py-3 text-gray-700">{emp.email}</td>
            <td className="px-4 py-3 text-gray-700">{emp.department}</td>
            <td className="px-4 py-3 text-gray-700">{emp.role}</td>

            <td className="px-4 py-3 text-gray-700">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  emp.employmentStatus === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {emp.employmentStatus}
              </span>
            </td>

            <td className="px-4 py-3 text-gray-700">
              <button
                onClick={() => onEdit(emp)}
                className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default EmployeeTable;
