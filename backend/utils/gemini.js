import axios from "axios";
import buildPrompt from "./prompt.js";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL     = process.env.GEMINI_API_URL;



  async function geminiResponse(command, assistantName, userName) {
   try {
    const finalPrompt = `${buildPrompt(assistantName, userName, command)}`;

    const { data } = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: finalPrompt }] }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        }
      }
    );

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Gemini raw response:", answer);
    return answer;
  } catch (err) {
    console.error("Error calling Gemini:", err.response?.data || err.message);
    throw err;
  }
}

export default geminiResponse;