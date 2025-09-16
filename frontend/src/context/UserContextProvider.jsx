import { useEffect, useState } from "react";

import { UserDataContext } from "./userContext";
import customFetch from "../utils/customFetch";

const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const { data } = await customFetch.get("/api/users/current-user", {
        withCredentials: true,
      });
      console.log("Current user data:", data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching current user:", error);

      setUserData(null);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await customFetch.post(
        "/api/assistant/ask-to-assistant",
        {
          command,
        },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      throw error;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContextProvider;
