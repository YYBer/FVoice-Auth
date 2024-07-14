// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VoiceprintStorage {
    // Mapping from user address to their voiceprint IPFS hash
    mapping(address => string) private voiceprints;

    // Event to emit when a voiceprint is stored
    event VoiceprintStored(address indexed user, string ipfsHash);

    // Function to store the IPFS hash of the voiceprint
    function storeVoiceprint(string memory _ipfsHash) public {
        voiceprints[msg.sender] = _ipfsHash;
        emit VoiceprintStored(msg.sender, _ipfsHash);
    }

    // Function to retrieve the IPFS hash of the voiceprint
    function getVoiceprint(address _user) public view returns (string memory) {
        return voiceprints[_user];
    }
}
