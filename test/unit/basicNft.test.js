const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

const main = () => {
    return developmentChains.includes(network.name)
        ? describe("BasicNft", () => {
              let deployer
              let basicNft
              const TOKEN_URI = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4"
              beforeEach(async () => {
                  deployer = (await getNamedAccounts()).deployer
                  await deployments.fixture(["all"])

                  basicNft = await ethers.getContract("BasicNft", deployer)
              })

              describe("constructor", () => {
                  it("get token name", async () => {
                      const name = await basicNft.name()
                      assert.equal(name, "Dogie")
                  })

                  it("get token symbol", async () => {
                      const symbol = await basicNft.symbol()
                      assert.equal(symbol, "DOG")
                  })

                  it("get token URI", async () => {
                    const tokenURI = await basicNft.tokenURI(0)
                    assert.equal(tokenURI, TOKEN_URI)
                })
              })
          })
        : describe.skip
}

main()
