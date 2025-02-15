// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImageStorage {
    struct Image {
        string name;
        string contentType;
        uint width;
        uint height;
        string hash; // SHA-256 hash of the image
        address owner; // Address of the image owner
    }

    // Mapping from image ID to Image struct
    mapping(uint256 => Image) private images;
    uint256 private imageCount;

    // Event emitted when a new image is stored
    event ImageStored(uint256 indexed imageId, string name, string hash, address indexed owner);

    // Function to store image metadata
    function storeImage(string memory _name, string memory _contentType, uint _width, uint _height, string memory _hash) public {
        imageCount++;
        images[imageCount] = Image(_name, _contentType, _width, _height, _hash, msg.sender);
        emit ImageStored(imageCount, _name, _hash, msg.sender);
    }

    // Function to retrieve image metadata by ID
    function getImage(uint256 _imageId) public view returns (string memory, string memory, uint, uint, string memory, address) {
        Image memory img = images[_imageId];
        return (img.name, img.contentType, img.width, img.height, img.hash, img.owner);
    }

    // Function to get the total number of images stored
    function getImageCount() public view returns (uint256) {
        return imageCount;
    }
}