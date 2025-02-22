import { ethers } from "hardhat";

const contractABI: string[] = [
    "function getImageByHash(string memory _hash,string[] memory hashes) public view returns (Image memory)",
    "function storeImage(string memory _name, string memory _contentType, uint256 _width, uint256 _height, string memory _hash) public returns (uint256)",
    "function getImage(uint256 _id) public view returns (Image memory)",
    "function getImageById(uint256 _id) public view returns (Image memory)",
    "function checkHash(bytes32 _hash) public view returns (bool)",
    "function checkHash(bytes32 _hash) public view returns (bool)",
    "function getHashCount() public view returns (uint256)",
    "function stringToBytes32(string memory source) public pure returns (bytes32 result)",
    "function storeHash(bytes32 _hash) public"
    
];

export const initializeContract = async () => {
    try {
        // Get the first signer from Hardhat
        const [signer] = await ethers.getSigners();
        const ImageStorage = await ethers.getContractFactory("ImageStorage");
        const imageStorage = await ImageStorage.deploy();
        // Get the deployed contract instance
        const contract = await ethers.getContractAt(
            "ImageStorage", // Replace with your actual contract name
            await imageStorage.getAddress() || "", // Get contract address from environment variable
            signer
        );

        return contract;
    } catch (error) {
        console.error("Failed to initialize contract:", error);
        throw new Error("Contract initialization failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export const provider = ethers.provider;
