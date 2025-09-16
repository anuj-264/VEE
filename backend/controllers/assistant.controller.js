import User from "../models/user.model.js";
import geminiResponse from "../utils/gemini.js";
import moment from "moment";
import { GEMINI_DEFAULT_TYPES } from '../constant/gemini-constants.js';
export const askToAssistant = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const userName = user.name;
        const assistantName = user.assistantName;
        const { command } = req.body;
        if (!command?.trim()) {
            return res.status(400).json({ response: "Command is required." });
        }
        user.history.push(command);
        await user.save();
        const result = await geminiResponse(command, assistantName, userName);

        // Extract JSON object from model output
        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ response: "Sorry, I can't understand." });
        }

        const gemResult = JSON.parse(jsonMatch[0]);
        console.log("Parsed Gemini result:", gemResult);
        const type = gemResult.type;
        const userInput = gemResult.userInput; // ensure matches prompt key

        // Decide action based on type
        switch (type) {
            case GEMINI_DEFAULT_TYPES.get_date:
                return res.json({
                    type,
                    userInput,
                    response: `Current date is ${moment().format("YYYY-MM-DD")}`
                });

            case GEMINI_DEFAULT_TYPES.get_time:
                return res.json({
                    type,
                    userInput,
                    response: `Current time is ${moment().format("hh:mm A")}`
                });

            case GEMINI_DEFAULT_TYPES.get_day:
                return res.json({
                    type,
                    userInput,
                    response: `Today is ${moment().format("dddd")}`
                });

            case GEMINI_DEFAULT_TYPES.get_month:
                return res.json({
                    type,
                    userInput,
                    response: `Current month is ${moment().format("MMMM")}`
                });

            case GEMINI_DEFAULT_TYPES.google_search:
            case GEMINI_DEFAULT_TYPES.youtube_search:
            case GEMINI_DEFAULT_TYPES.youtube_play:
            case GEMINI_DEFAULT_TYPES.general:
            case GEMINI_DEFAULT_TYPES.calculator_open:
            case GEMINI_DEFAULT_TYPES.instagram_open:
            case GEMINI_DEFAULT_TYPES.facebook_open:
            case GEMINI_DEFAULT_TYPES.weather_show:
            case GEMINI_DEFAULT_TYPES.news_fetch:
            case GEMINI_DEFAULT_TYPES.reminder_set:
                return res.json({
                    type,
                    userInput,
                    response: gemResult.response
                });

            default:
                return res.status(400).json({ response: "I didn't understand that command." });
        }

    } catch (error) {
        console.error("askToAssistant error:", error);
        return res.status(500).json({ response: "Internal server error." });
    }

}