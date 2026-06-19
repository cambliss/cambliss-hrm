const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg border border-[#EBEBEB] shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
