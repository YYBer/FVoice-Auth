// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VoiceprintStorage {
    mapping(address => string) private voiceprints;

    event VoiceprintStored(address indexed user, string ipfsHash);
    function storeVoiceprint(string memory _ipfsHash) public {
        voiceprints[msg.sender] = _ipfsHash;
        emit VoiceprintStored(msg.sender, _ipfsHash);
    }
    function getVoiceprint(address _user) public view returns (string memory) {
        return voiceprints[_user];
    }
}
