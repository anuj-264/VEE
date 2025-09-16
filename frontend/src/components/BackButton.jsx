import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <MdKeyboardBackspace
      className="absolute top-8 left-8 text-white cursor-pointer w-7 h-7"
      onClick={handleClick}
    />
  );
};

export default BackButton;
