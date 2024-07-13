// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.7;

// contract trans{
//     string public result;
//     // function save(string memory _msg) public{
//     //     result = _msg;
//     // }
//     function save(bytes memory binary_result) public {
//         result = string(binary_result);
//     }
// }

pragma solidity ^0.8.20;

import {FHE, euint8, inEuint8} from "@fhenixprotocol/contracts/FHE.sol";

contract Example {
    
    euint8 _output;

    function setOutput(inEuint8 calldata _encryptedNumber) public  {
        _output = FHE.asEuint8(_encryptedNumber);
    }

    function getOutputEncrypted(bytes32 publicKey) public view returns (bytes memory) {
        return _output.seal(publicKey);
    }
}