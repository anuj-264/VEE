const Button = ({
  children,
  type = "button",
  loading = false,
  className = "bg-white hover:bg-gray-300 text-black py-3 px-6 rounded-full w-[200px] font-semibold mt-5 mb-3",
  onClick = null,
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
