import { useNavigate } from 'react-router-dom';

const AuthRedirectLink = ({ text, linkText, to }) => {
  const navigate = useNavigate();

  return (
    <p
      className="text-white cursor-pointer"
      onClick={() => navigate(to)}
    >
      {text}{' '}
      <span className="text-red-500 font-semibold">{linkText}</span>
    </p>
  );
};

export default AuthRedirectLink;