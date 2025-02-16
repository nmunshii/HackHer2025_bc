import express from "express";
import { ethers } from "ethers";
import uploadRouter from "./routes/upload";

const app = express();
const PORT = process.env.PORT || 3000;


// Initialize app
async function initializeApp() {
    try {
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