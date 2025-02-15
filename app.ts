import express from "express";
import mongoose from "mongoose";
import { ethers } from "ethers";
import uploadRouter from "./api/routes/upload";

const app = express();
const PORT = process.env.PORT || 3000;


// Initialize app
async function initializeApp() {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb://localhost:27017/yourdbname", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

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