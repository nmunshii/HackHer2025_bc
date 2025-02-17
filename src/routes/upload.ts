import express, { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { createHash } from "crypto";
import { ethers } from "hardhat"; // Correct import
import { initializeContract } from "../config/db";
import axios from "axios";
import FormData from "form-data";

const router = express.Router();

// Configure Multer to store the file in memory
// const upload = multer({ storage: multer.memoryStorage() });

// Extend the Request interface to include the uploaded file

// Configure Multer to store the file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


// POST /upload endpoint that accepts an image file named "image"
router.post("/upload", upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if a file was provided
    if (!req.file) {
      res.status(400).json({ message: "No image uploaded", req: req.file });
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
  
    const response = await axios.post("http://127.0.0.1:4000/image/upload", { tx }, {
      headers: {
      "Content-Type": "application/json"
      }
    }).catch(error => {
      if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ message: "Error uploading image to IPFS", error: error.response.data });
      } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ message: "No response received from IPFS server", error: error.request });
      } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ message: "Error setting up request to IPFS server", error: error.message });
      }
      return; // Ensure to return after sending a response
    });

    if (!response) {
      return; // Ensure to return if there was an error
    }
    // const response = await axios.get("http://127.0.0.1:4000/image/");

    if (response.status !== 200) {
      res.status(500).json({ message: "Error uploading image to IPFS", error: response.status });
      return; // Ensure to return after sending a response
    }

    // Generate the transaction hash

    res.status(200).json({ message: "Image uploaded successfully!", hash: tx });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image" });
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