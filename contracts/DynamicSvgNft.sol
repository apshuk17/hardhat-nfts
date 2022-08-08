// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private s_lowImageUri;
    string private s_highImageUri;
    string private constant BASE64_ENCODED_SVG_PREFIX = "data:image/svg+xml;base64,";
    string private constant BASE64_ENCODED_JSON_PREFIX = "data:application/json;base64,";
    AggregatorV3Interface private immutable i_priceFeed;
    mapping (uint256 => int256) public s_tokenIdToHighValue;

    event CreatedNFT(uint256 indexed tokenId, int256 highValue);

    constructor(address priceFeedAddress, string memory _lowSvg, string memory _highSvg) ERC721("Dynamic Svg Nft", "DSN") {
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
        s_tokenCounter = 0;
        s_lowImageUri = svgToImgUri(_lowSvg);
        s_highImageUri = svgToImgUri(_highSvg);
    }

    function svgToImgUri(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        string memory imageURI = string(
            abi.encodePacked(BASE64_ENCODED_SVG_PREFIX, svgBase64Encoded)
        );
        return imageURI;
    }

    function _baseURI() internal override pure returns (string memory) {
        return BASE64_ENCODED_JSON_PREFIX;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token query for a non-existent token");
        (, int256 price, , , ) = i_priceFeed.latestRoundData();

        string memory imageUri = s_lowImageUri;
        if (price >= s_tokenIdToHighValue[tokenId]) {
            imageUri = s_highImageUri;
        }

        string memory base64EncodedNftMetadata = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name":"',
                    name(),
                    '", "description":"An NFT that changes based on the Chainlink Feed",',
                    '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                    imageUri,
                    '"}'
                )
            )
        );
        string memory nftMetaData = string(abi.encodePacked(_baseURI(), base64EncodedNftMetadata));
        return nftMetaData;
    }

    function mintNft(int256 highValue) public {
        s_tokenIdToHighValue[s_tokenCounter] = highValue;
        emit CreatedNFT(s_tokenCounter, highValue);
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;

    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getLowImageUri() public view returns (string memory) {
        return s_lowImageUri;
    }

    function getHighImageUri() public view returns (string memory) {
        return s_highImageUri;
    }
}
