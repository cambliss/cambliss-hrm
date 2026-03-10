const LeaveBalance = ({ balance }) => {
  if (!balance) {
    return (
      <div className="bg-white p-4 rounded shadow text-gray-500">
        Select an employee to view leave balance
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Casual Leave</p>
        <p className="text-3xl font-bold text-blue-600 mt-2">
          {balance.casualLeaves}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Sick Leave</p>
        <p className="text-3xl font-bold text-green-600 mt-2">
          {balance.sickLeaves}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Paid Leave</p>
        <p className="text-3xl font-bold text-purple-600 mt-2">
          {balance.paidLeaves}
        </p>
      </div>
    </div>
  );
};

export default LeaveBalance;
