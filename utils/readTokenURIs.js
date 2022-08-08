const path = require("path")
const fs = require("fs")

const getTokenUris = async () => {
    const nftMetadataFilesDirPath = path.resolve("NFTMetadataFiles")
    const files = await fs.promises.readdir(nftMetadataFilesDirPath)
    const tokenURIS = []
    if (files.length) {
        for (let file of files) {
            const filePath = path.join(nftMetadataFilesDirPath, file)
            const fileContent = await fs.promises.readFile(filePath, "utf-8")
            const { url } = JSON.parse(fileContent)
            tokenURIS.push(url)
        }
    }
    return tokenURIS;
}

module.exports = {
    getTokenUris,
}
