const InputField = ({
  type = "text",
  placeholder,
  required = false,
  onChange,
  value,
  className="w-full h-15 outline-none border border-white bg-transparent px-5 py-2.5 rounded-full text-white text-[16px]"
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};

export default InputField;
