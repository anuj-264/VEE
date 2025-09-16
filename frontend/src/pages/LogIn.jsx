import { useState, useContext } from "react";
import {
  InputField,
  PasswordField,
  Button,
  AuthRedirectLink,
} from "../components";
import { UserDataContext } from "../context/userContext";

import customFetch from "../utils/customFetch";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result = await customFetch.post(
        `/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setLoading(false);
      setUserData(result.data);
      navigate("/home");
      console.log("User logged in successfully:", userData);
    } catch (err) {
      setUserData(null);
      console.log("Error logging in", err);
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[url('src/assets/bg.jpg')] bg-cover bg-center flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0000004c] backdrop-blur rounded-2xl shadow-lg shadow-black p-5 sm:p-8 md:p-10 w-full max-w-md flex flex-col items-center justify-center gap-5"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-7.5">
          Log In to <span className="text-red-500">VEE</span>
        </h1>

        <InputField
          type="email"
          placeholder="Enter your email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <PasswordField
          placeholder="Enter your password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {error.length > 0 && <p className="text-red-500">{error}</p>}

        <Button type="submit" disabled={loading}>
          Log In
        </Button>

        <AuthRedirectLink
          text="Don't have an account?"
          linkText="Sign Up"
          to="/signup"
        />
      </form>
    </div>
  );
};

export default LogIn;
