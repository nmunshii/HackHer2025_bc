import { ContractInterface, ethers } from "ethers";

// Blockchain initialization
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contractABI: ContractInterface[] = [{
    "inputs": [],
    "name": "myVariable",
    "outputs": [
        {
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
        {
            "name": "_value",
            "type": "uint256"
        }
    ],
    "name": "setMyVariable",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}];

// Initialize contract and export for routes to use
export const initializeContract = async () => {
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
};

export default provider;