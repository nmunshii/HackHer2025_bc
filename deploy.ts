import { ethers } from "hardhat";

async function main() {
  const ImageStorage = await ethers.getContractFactory("ImageStorage");
  const imageStorage = await ImageStorage.deploy();
  await imageStorage.deployed();
  console.log("ImageStorage deployed to:", imageStorage.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 