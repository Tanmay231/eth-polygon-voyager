
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTTeleporterEthereum is ERC721URIStorage, Ownable {
    // Events
    event TeleportInitiated(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 timestamp,
        bytes32 metadataHash
    );
    
    // Constructor
    constructor() ERC721("TeleporterNFT", "TPNFT") Ownable(msg.sender) {}
    
    // Mint function (for testing)
    function mint(address to, uint256 tokenId, string memory tokenURI) public onlyOwner {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
    
    // Teleport function - burns the NFT and emits a teleport event
    function teleportToPolygon(uint256 tokenId) public {
        // Ensure caller owns the token
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this NFT");
        
        // Get metadata
        string memory uri = tokenURI(tokenId);
        bytes32 metadataHash = keccak256(abi.encodePacked(uri));
        
        // Emit teleport event
        emit TeleportInitiated(
            tokenId,
            msg.sender,
            block.timestamp,
            metadataHash
        );
        
        // Burn the token
        _burn(tokenId);
    }
}
