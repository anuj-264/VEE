import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import assistantRoutes from './routes/assistant.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/assistant",assistantRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})