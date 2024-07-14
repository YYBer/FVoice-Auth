const { ethers } = require("ethers");

// Set up provider for Calibration testnet
const provider = new ethers.providers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");

// Set up wallet
const privateKey = "<YOUR_PRIVATE_KEY>";
const wallet = new ethers.Wallet(privateKey, provider);

// Contract ABI and address
const abi = [
    "function storeVoiceprint(string _ipfsHash) public",
    "function getVoiceprint(address _user) public view returns (string)"
];
const contractAddress = "0xba2db7b4d21c13aaf23e050faceb26d4e177f333";

// Create contract instance
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Store voiceprint
async function storeVoiceprint(ipfsHash) {
    const tx = await contract.storeVoiceprint(ipfsHash);
    await tx.wait();
    console.log(`Voiceprint stored: ${ipfsHash}`);
}

// Retrieve voiceprint
async function getVoiceprint(userAddress) {
    const ipfsHash = await contract.getVoiceprint(userAddress);
    console.log(`Voiceprint for ${userAddress}: ${ipfsHash}`);
}

// Example usage
const ipfsHash = "QmT6N9CZvGyyv9jdKg7mThF8PZkYm1sK3YmT6N9CZvGyyv9";
storeVoiceprint(ipfsHash);
getVoiceprint(wallet.address);
