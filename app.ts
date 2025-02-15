import express from "express";
import mongoose from "mongoose";
import uploadRouter from "./api/routes/upload"; // Adjust the path as needed

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourdbname", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use the upload router
app.use("/api", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 