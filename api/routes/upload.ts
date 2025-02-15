import express, { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { createHash } from "crypto";
import Image from "../models/Image";  // Adjust the path as needed
import { ethers } from "ethers"; // Correct import

const router = express.Router();

// Configure Multer to store the file in memory
const upload = multer({ storage: multer.memoryStorage() });

// Extend the Request interface to include the uploaded file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Connect to the Ethereum network and the contract
const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Adjust the provider URL
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
const contractABI = [ /* ABI from compiled contract */ ]; // Replace with your contract's ABI
const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// POST /upload endpoint that accepts an image file named "image"
router.post("/upload", upload.single("image"), async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    // Check if a file was provided
    if (!req.file) {
      res.status(400).json({ message: "No image uploaded" });
      return; // Ensure to return after sending a response
    }

    const { buffer, mimetype, originalname } = req.file;

    // Use Sharp to extract metadata from the image
    const metadata = await sharp(buffer).metadata();

    // Compute a SHA‑256 hash of the image buffer
    const hash = createHash("sha256").update(buffer).digest("hex");

    // Create a new Image document with the file data and metadata
    const newImage = new Image({
      data: buffer,
      contentType: mimetype,
      name: originalname,         // mapping originalname to the "name" field
      width: metadata.width,
      height: metadata.height,
      hash: hash,
    });

    // Save the new image to MongoDB
    await newImage.save();

    // Store image metadata in the blockchain
    const tx = await contract.storeImage(originalname, mimetype, metadata.width, metadata.height, hash);
    await tx.wait(); // Wait for the transaction to be mined

    res.status(201).json({ message: "Image uploaded successfully!", imageId: newImage._id });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
});

export default router; 