const LeaveBalance = ({ balance }) => {
  if (!balance) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border text-center text-gray-400">
        Select an employee to view leave balance
      </div>
    );
  }

  const cards = [
    {
      title: "Casual Leave",
      value: balance.casualLeaves || 0,
      color: "text-blue-600",
    },
    {
      title: "Sick Leave",
      value: balance.sickLeaves || 0,
      color: "text-green-600",
    },
    {
      title: "Paid Leave",
      value: balance.paidLeaves || 0,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
        >
          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default LeaveBalance;