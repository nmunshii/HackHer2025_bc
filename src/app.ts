import express from "express";
import uploadRouter from "./routes/upload";
import { initializeContract } from "./config/db";
import axios from "axios";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
}));
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const PORT = process.env.PORT || 3010;

axios.defaults.baseURL = process.env.DB_URL || "http://localhost:3010";

// Initialize app
async function initializeApp() {
    try {
        // Initialize blockchain provider
        await initializeContract();

        // Middleware
        app.use(express.json());
        
        // Routes
        app.use("/api", uploadRouter);

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Initialization error:", error);
        process.exit(1);
    }
}

initializeApp();