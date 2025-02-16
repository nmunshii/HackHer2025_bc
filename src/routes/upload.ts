import express, { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { createHash } from "crypto";
import { ethers } from "hardhat"; // Correct import
import { initializeContract } from "../config/db";
import axios from "axios";

const router = express.Router();

// Configure Multer to store the file in memory
const upload = multer({ storage: multer.memoryStorage() });

// Extend the Request interface to include the uploaded file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// POST /upload endpoint that accepts an image file named "image"
router.post("/upload", upload.single("image"), async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    // Check if a file was provided
    if (!req.file) {
      res.status(400).json({ message: "No image uploaded" });
      return; // Ensure to return after sending a response
    }

    // Connect to the Ethereum network and the contract

    const contract = await initializeContract();

    const { buffer } = req.file;

    const metadata = await sharp(buffer).metadata();

    if (metadata.comments) {
      if (metadata.comments.find((comment) => comment.keyword === "FauxHash")) {
        res.status(400).json({ message: "Image already uploaded" });
        return; // Ensure to return after sending a response
      }
    }

    // Store image metadata in the blockchain
    const tx = await contract.giveImageHash(buffer);

    // Add tx as the value to the key-value pair with key "FauxHash" to metadata.comments
    if (!metadata.comments) {
      metadata.comments = [];
    }
    metadata.comments.push({ keyword: "FauxHash", text: tx });

    const formData = new FormData();
    const blob = new Blob([buffer], { type: "image/png" });
    formData.append("image", blob, "image.png");
    formData.append("metadata", JSON.stringify(metadata));

    const response = await axios.post("/image/upload", formData, {
      headers: {
      "Content-Type": "multipart/form-data"
      }
    });

    if (response.status !== 200) {
      res.status(500).json({ message: "Error uploading image to IPFS" });
      return; // Ensure to return after sending a response
    }

    // Generate the transaction hash

    res.status(200).json({ message: "Image uploaded successfully!", hash: tx });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
});


router.get("/verify", async (req: Request, res: Response) => {
  try {
    const { hash } = req.query;

    if (!hash) {
      res.status(400).json({ message: "No hash provided" });
      return; // Ensure to return after sending a response
    }

    const contract = await initializeContract();

    const allHashes = await axios.get("/image/allHashes");

    if (!allHashes.data) {
      res.status(500).json({ message: "Error fetching hashes from db" });
      return; // Ensure to return after sending a response
    }

    const image = await contract.getImageByHash(hash.toString(), allHashes.data);

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return; // Ensure to return after sending a response
    }

    res.status(200).json({ message: "Image verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying image", error });
  }
});

export default router;