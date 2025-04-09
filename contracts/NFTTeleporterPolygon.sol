
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTTeleporterPolygon is ERC721URIStorage, Ownable {
    // State variables
    bytes32 public merkleRoot;
    mapping(uint256 => bool) public teleportedTokens;
    
    // Constructor
    constructor() ERC721("TeleporterNFT", "TPNFT") Ownable(msg.sender) {}
    
    // Update merkle root (called by relayer)
    function updateMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }
    
    // Verify Merkle proof
    function verifyProof(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;
        
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            
            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        
        // Check if the computed hash equals the root of the Merkle tree
        return computedHash == root;
    }
    
    // Receive teleported NFT with proof verification
    function receiveTeleport(
        uint256 tokenId,
        address owner,
        string memory tokenURI,
        bytes32[] memory proof
    ) public {
        // Check that token hasn't already been claimed
        require(!teleportedTokens[tokenId], "Token already teleported");
        
        // Create leaf from token data
        bytes32 leaf = keccak256(abi.encodePacked(tokenId, owner, tokenURI));
        
        // Verify proof against current merkle root
        require(verifyProof(proof, merkleRoot, leaf), "Invalid proof");
        
        // Mark token as teleported
        teleportedTokens[tokenId] = true;
        
        // Mint the token to the original owner
        _mint(owner, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}
