const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

const main = () => {
    return developmentChains.includes(network.name)
        ? describe("RandomIpfsNft", () => {
              let accounts, deployer, randomIpfsNft, vrfCoordinatorV2Mock
              const chainId = network.config.chainId

              beforeEach(async () => {
                  accounts = await ethers.getSigners()
                  deployer = (await getNamedAccounts()).deployer
                  await deployments.fixture(["all"])

                  randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
                  vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              })

              it("Dog Token Uris", async () => {
                const dog = await randomIpfsNft.getDogTokenUris(0);
                console.log('##dog', dog);
                assert.include(dog, 'metadata.json')
              })
          })
        : describe.skip
}

main()
