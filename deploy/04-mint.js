const { ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { log } = deployments;


    // Mint Basic NFT
    // const basicNft = await ethers.getContract('BasicNft', deployer);
    // const basicMintTx = await basicNft.mintNft();
    // await basicMintTx.wait(1);
    // const basicNftTokenURI = await basicNft.tokenURI(0)
    // log('##Basic NFT Token URI', basicNftTokenURI)


    // Random Ipfs NFT
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
    const mintFee = await randomIpfsNft.getMintFee();

    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 300000) // 5 seconds
        randomIpfsNft.once('NFTMinted', async () => resolve())

        // Request NFT
        const requestNftTx = await randomIpfsNft.requestNft({ value: mintFee });
        const requestNftTxReceipt = await requestNftTx.wait(1)
        if (developmentChains.includes(network.name)) {
            const requestId = requestNftTxReceipt.events[1].args.requestId.toString();
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address);
        }
    })
    const randomNftTokenURI = await randomIpfsNft.tokenURI(0)
    log('##RandomIpfs Token URI', randomNftTokenURI)


    // Dynamic SVG NFT
    const highValue = ethers.utils.parseEther('4000');
    const dynamicSvgNft = await ethers.getContract('DynamicSvgNft', deployer);
    const dynamicSvgMintTx = await dynamicSvgNft.mintNft(highValue);
    await dynamicSvgMintTx.wait(1);
    const dynamicSvgNftTokenUri = await dynamicSvgNft.tokenURI(0)
    log('##Dynamic SVG NFT Token URI', dynamicSvgNftTokenUri)
}

module.exports.tags = ["all", "mint"]