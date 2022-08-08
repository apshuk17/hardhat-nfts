const { network, ethers } = require("hardhat")
const path = require("path")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { storeNFTs } = require("../utils/uploadToNftStorage")
const { getTokenUris } = require("../utils/readTokenURIs")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("10");

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let tokenURIS = await getTokenUris()
    if (!tokenURIS.length) {
        const imagesPath = path.resolve("images", "randomIpfs")
        tokenURIS = await storeNFTs(imagesPath)
    }

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

        // Create Subscription
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId

        // Fund the subscription
        // Usually' you'd need a link token on a real network
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("-------------------------------------------------------")

    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        tokenURIS,
        ethers.utils.parseEther(networkConfig[chainId].mintFee),
    ]

    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        log: true,
        args,
        waitConfirmations: network.config.blockConfirmations,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(randomIpfsNft.address, args)
    }
    log("-----------------------------------")
}

module.exports.tags = ["all", "randomipfs", "main"]
