const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");

const wallet = new ethers.Wallet(privateKey, provider);

const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "VoiceprintStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getVoiceprint",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "storeVoiceprint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const contractAddress = "0xba2db7b4d21c13aaf23e050faceb26d4e177f333";

const contract = new ethers.Contract(contractAddress, abi, wallet);

async function storeVoiceprint(ipfsHash) {
    const tx = await contract.storeVoiceprint(ipfsHash);
    await tx.wait();
    console.log(`Voiceprint stored: ${ipfsHash}`);
}

async function getVoiceprint(userAddress) {
    const ipfsHash = await contract.getVoiceprint(userAddress);
    console.log(`Voiceprint for ${userAddress}: ${ipfsHash}`);
}
const ipfsHash = "QmT6N9CZvGyyv9jdKg7mThF8PZkYm1sK3YmT6N9CZvGyyv9";
storeVoiceprint(ipfsHash);
getVoiceprint(wallet.address);
