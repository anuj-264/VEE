import { useContext, useRef } from "react";
import {Card,BackButton,PageTitle} from "../components";
import { images } from "../utils/images";
import { RiImageAddLine } from "react-icons/ri";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";


import { Button } from "../components";
function CustomAgentImage() {
  const {
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);
  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] ">
    
      <BackButton to="/" />
      <PageTitle
        title="Select your"
        highlightedText="Assistant Avatar"
      />
      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">
        {/* diff pre-provided  images */}
        {images.map((image, index) => (
          <Card key={index} image={image} />
        ))}

        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
            selectedImage == "input"
              ? "border-4 border-white shadow-2xl shadow-blue-950 "
              : null
          }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <RiImageAddLine className="text-white w-[25px] h-[25px]" />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <Button
          onClick={() => {
            navigate("/custom-name");
          }}
        >
          Next
        </Button>
      )}
    </div>
  );
}

export default CustomAgentImage;
