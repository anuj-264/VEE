import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";

const PasswordField = ({ placeholder, required = false, onChange, value }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full h-15 border border-white bg-transparent rounded-full text-white text-[16px] relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        value={value}
        className="w-full h-15 outline-none border border-white bg-transparent px-5 py-2.5 rounded-full text-white text-[16px]"
      />
      {showPassword ? (
        <IoEyeOff
          className="absolute top-5 right-5 w-6 h-6 text-white cursor-pointer"
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <IoEye
          className="absolute top-5 right-5 w-6 h-6 text-white cursor-pointer"
          onClick={() => setShowPassword(true)}
        />
      )}
    </div>
  );
};

export default PasswordField;
