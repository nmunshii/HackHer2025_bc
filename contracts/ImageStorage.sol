// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImageStorage {
    struct Image {
        string name;
        string contentType;
        uint width;
        uint height;
        string hash; // SHA-256 hash of the image
        bytes data; // Raw image data (optional, can be omitted for large images)
        address owner; // Address of the image owner
    }

    // Mapping from image ID to Image struct
    mapping(uint256 => Image) private images;
    uint256 private imageCount;
    // Function to get image details by hash
    function getImageByHash(
        string memory _hash,
        string[] memory hashes
    ) public view returns (Image memory) {
        for (uint256 i = 0; i < hashes.length; i++) {
            if (compareStrings(hashes[i], _hash)) {
                return images[i + 1];
            }
        }
        revert("Image not found");
    }

    function giveImageHash(bytes memory data) public pure returns (string memory) {
        bytes32 hash = sha256(data);
        return bytes32ToString(hash);
    }

    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        bytes memory bytesArray = new bytes(64);
        for (uint256 i = 0; i < 32; i++) {
            bytes1 char = bytes1(uint8(_bytes32[i] >> 4));
            bytes1 char2 = bytes1(uint8(_bytes32[i] & 0x0f));
            bytesArray[i * 2] = char < bytes1(uint8(10)) ? bytes1(uint8(char) + 48) : bytes1(uint8(char) + 87);
            bytesArray[i * 2 + 1] = char2 < bytes1(uint8(10)) ? bytes1(uint8(char2) + 48) : bytes1(uint8(char2) + 87);
        }
        return string(bytesArray);
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return
            (bytes(a).length == bytes(b).length) &&
            (sha256(bytes(a)) == sha256(bytes(b)));
    }

    // Function to get the total number of images stored
    function getImageCount() public view returns (uint256) {
        return imageCount;
    }
}
