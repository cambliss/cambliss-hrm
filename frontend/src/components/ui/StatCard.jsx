const StatCard = ({ label, value, accent = false, muted = false }) => (
    <div className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm px-5 py-4">
        <p className="text-[9px] font-medium tracking-[0.25em] uppercase text-[#AAAAAA] mb-2">
            {label}
        </p>
        <p className={[
            "text-3xl font-light leading-none",
            accent ? "text-[#C9A227]"
                : muted ? "text-red-400"
                    : "text-[#0A0A0A]",
        ].join(" ")}
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            {value}
        </p>
    </div>
);

export default StatCard;