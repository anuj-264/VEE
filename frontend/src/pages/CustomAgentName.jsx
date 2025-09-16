import { useContext, useState } from "react";
import { UserDataContext } from "../context/userContext";
import customFetch from "../utils/customFetch";
import { useNavigate } from "react-router-dom";
import { InputField, BackButton, PageTitle, Button } from "../components";
function CustomAgentName() {
  const { userData, backendImage, selectedImage, setUserData } =
    useContext(UserDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await customFetch.put(`/api/users/update-assistant`, formData, {
        withCredentials: true,
      });
      setLoading(false);
      console.log("Updated user data received from server:", result.data);
      setUserData(result.data);
      
      navigate("/");
    } catch (error) {
      if (error.response) {
      // This will log the specific validation error from your server
      console.error("Validation Error:", error.response.data);
      setLoading(false);
      }else{
      console.log("Error:", error.message);
      setLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative ">
      <BackButton to="/custom-image" />

      <PageTitle title="Give your" highlightedText="Assistant a name" />

      <InputField
        type="text"
        placeholder="eg. Orion"
        className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required={true}
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <Button
          className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer  bg-white rounded-full text-[19px] "
          disabled={loading}
          onClick={() => {
            handleUpdateAssistant();
          }}
        >
          {!loading ? "Finish Setup" : "Setting Up..."}
        </Button>
      )}
    </div>
  );
}

export default CustomAgentName;
