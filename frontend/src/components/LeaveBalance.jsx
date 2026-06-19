const LEAVE_TYPES = [
  {
    key: "casualLeaves",
    label: "Casual Leave",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
  },
  {
    key: "sickLeaves",
    label: "Sick Leave",
    icon: "M4.5 12.5l3 3 5-5m4.5-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  },
  {
    key: "paidLeaves",
    label: "Paid Leave",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1M8 12H7m10 0h-1",
  },
];

const Icon = ({ path }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={path} />
  </svg>
);

const LeaveBalance = ({ balance }) => {
  if (!balance) {
    return (
      <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
        py-10 text-center">
        <p className="text-xs tracking-wide text-[#AAAAAA]">
          Select an employee to view leave balance
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {LEAVE_TYPES.map(({ key, label, icon }) => {
        const value = balance[key] || 0;
        const isLow = value <= 2;

        return (
          <div
            key={key}
            className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm
              px-5 py-4 hover:border-[#C9A227]/40 transition-colors duration-150"
          >
            {/* Icon + label row */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-[9px] font-medium tracking-[0.25em] uppercase text-[#AAAAAA]">
                {label}
              </p>
              <span className="text-[#C9A227]/60">
                <Icon path={icon} />
              </span>
            </div>

            {/* Value */}
            <p
              className={[
                "text-3xl font-light leading-none",
                isLow ? "text-red-400" : "text-[#C9A227]",
              ].join(" ")}
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              {value}
            </p>

            {/* Sub-label */}
            <p className="text-[9px] tracking-wide text-[#AAAAAA] mt-1.5">
              {isLow ? "Low balance" : "days remaining"}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default LeaveBalance;
