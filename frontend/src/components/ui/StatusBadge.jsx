const StatusBadge = ({ status }) => {
    const normalizedStatus = status?.toUpperCase() || "PENDING";

    const map = {
        ACTIVE: {
            bg: "bg-[#F5E9C4]",
            text: "text-[#9B7A18]",
            dot: "bg-[#C9A227]",
        },

        PRESENT: {
            bg: "bg-[#F5E9C4]",
            text: "text-[#9B7A18]",
            dot: "bg-[#C9A227]",
        },

        APPROVED: {
            bg: "bg-[#F5E9C4]",
            text: "text-[#9B7A18]",
            dot: "bg-[#C9A227]",
        },

        INACTIVE: {
            bg: "bg-red-50",
            text: "text-red-500",
            dot: "bg-red-400",
        },

        ABSENT: {
            bg: "bg-red-50",
            text: "text-red-500",
            dot: "bg-red-400",
        },

        REJECTED: {
            bg: "bg-red-50",
            text: "text-red-500",
            dot: "bg-red-400",
        },

        PENDING: {
            bg: "bg-[#EBEBEB]",
            text: "text-[#666666]",
            dot: "bg-[#AAAAAA]",
        },

        COMPLETED: {
            bg: "bg-[#EBEBEB]",
            text: "text-[#666666]",
            dot: "bg-[#AAAAAA]",
        },
    };

    const {
        bg = "bg-[#EBEBEB]",
        text = "text-[#666666]",
        dot = "bg-[#AAAAAA]",
    } = map[normalizedStatus] || {};

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase ${bg} ${text}`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`}
            />
            {normalizedStatus}
        </span>
    );
};

export default StatusBadge;