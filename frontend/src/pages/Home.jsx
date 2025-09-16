import { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";
import { Button } from "../components";

const Home = () => {
  const { userData, setUserData, getGeminiResponse } =
    useContext(UserDataContext);
  // const [assistantStatus, setAssistantStatus] = useState('idle');
  const navigate = useNavigate();
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const [ham, setHam] = useState(false);
  const isRecognizingRef = useRef(false);
  const SYNTH = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await customFetch.get(`/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    } else if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    } else if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    } else if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    } else if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };
  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };
  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition(); //  Delay se race condition avoid hoti hai
      }, 800);
    };
    SYNTH.cancel(); //  pehle se koi speech ho to band karo
    SYNTH.speak(utterence);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition(); // creating obj to use its all func

    recognition.continuous = true; // always working when we come to our website

    recognition.lang = "en-US"; // language

    recognitionRef.current = recognition;

    let isMounted = true; //flag to avoid setState on unmounted component

    // Start recognition after 1 second delay only if component still mounted
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };
    recognition.onresult = async (e) => {
      try {
        const lastIndex = e.results.length - 1;
        const result = e.results[lastIndex];
        if (!result || !result[0]) return;

        const transcript = result[0].transcript;
        console.log("User said:", transcript);

        if (
          userData?.assistantName &&
          transcript
            .toLowerCase()
            .includes(userData.assistantName.toLowerCase())
        ) {
          try {
            setAiText("");
            setUserText(transcript);
            recognition.stop();
            isRecognizingRef.current = false;
            setListening(false);
            const data = await getGeminiResponse(transcript);
            console.log("Gemini response:", data);
            handleCommand(data);
            setAiText(data.response);
            setUserText("");
          } catch (err) {
            console.error("Gemini call failed:", err);
          }
        }
      } catch (error) {
        console.error("Error processing speech recognition result:", error);
      }
    };
    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, I am your assistant ${userData.assistantName}, what can I help you with?`
    );
    greeting.lang = "hi-IN";

    window.speechSynthesis.speak(greeting);

    // Clean up when component unmounts
    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden">
      <CgMenuRight
        className="lg:hidden text-white absolute top-5 right-5 w-6 h-6"
        onClick={() => setHam(true)}
      />
      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-5 flex flex-col gap-5 items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <RxCross1
          className=" text-white absolute top-5 right-5 w-6 h-6"
          onClick={() => setHam(false)}
        />
        <Button
          className="min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] "
          onClick={handleLogOut}
        >
          Log Out
        </Button>
        <Button
          className="min-w-[150px] h-[60px]  text-black font-semibold  px-5 py-2.5 bg-white  rounded-full cursor-pointer text-[19px]  "
          onClick={() => navigate("/custom-image")}
        >
          Customize your Assistant
        </Button>

        <div className="w-full h-0.5 bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>

        <div className="w-full h-100 gap-5 overflow-y-auto flex flex-col truncate">
          {userData.history?.map((his) => (
            <div className="text-gray-200 text-[18px] w-full h-7.5  ">
              {his}
            </div>
          ))}
        </div>
      </div>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt="assistant image"
          className="h-full object-cover"
        />
      </div>
      <h1 className="text-white text-[18px] semi-bold">
        I'm {userData?.assistantName}
      </h1>
      {!aiText && <img src={userImg} alt="" className="w-50" />}
      {aiText && <img src={aiImg} alt="" className="w-50" />}
      <h1 className="text-white text-[18px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};
export default Home;
