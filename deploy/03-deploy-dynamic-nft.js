const { ethers, network } = require("hardhat")
const fsp = require("fs/promises")
const path = require("path")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify");

module.exports = async ({ deployments, getNamedAccounts, getChainId }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = mockV3Aggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    log("-----------------------------------")

    const filePath = path.resolve("images", "dynamicNft")
    const lowSVG = await fsp.readFile(path.join(filePath, "frown.svg"), "utf8")
    const highSVG = await fsp.readFile(path.join(filePath, "happy.svg"), "utf8")

    const args = [ethUsdPriceFeedAddress, lowSVG, highSVG]

    const dynamicSVGNft = await deploy("DynamicSvgNft", {
        from: deployer,
        log: true,
        args,
        waitConfirmations: network.config.blockConfirmations,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(dynamicSVGNft.address, args)
    }
    log("-----------------------------------")
}

module.exports.tags = ["all", "dynamicsvg", "main"]
