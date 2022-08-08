const networkConfig = {
    default: {
        name: "hardhat",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // Gas lane for the hardhat n/w does not matter, we could use any random value
        callbackGasLimit: "500000",
        interval: "30",
    },
    4: {
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subscriptionId: "9102",
        callbackGasLimit: "500000",
        interval: "30",
        mintFee: "0.01",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    },
    31337: {
        name: "localhost",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // Gas lane for the hardhat n/w does not matter, we could use any random value
        callbackGasLimit: "500000",
        interval: "30",
        mintFee: "0.01"
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = { developmentChains, networkConfig }
