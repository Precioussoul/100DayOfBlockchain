const {expect} = require("chai")
const {ethers} = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether")
}

describe("Token", function () {
  const name = "Ethereum"
  const symbol = "ETH"
  const decimal = "18"
  const totalSupply = tokens("100000")

  let token, accounts, deployer

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token")
    token = await Token.deploy("Ethereum", "ETH", 100000)
    accounts = await ethers.getSigners()
    deployer = accounts[0]
  })

  it("has correct name", async function () {
    expect(await token.name()).to.equal(name)
  })
  it("has correct symbol", async function () {
    expect(await token.symbol()).to.equal(symbol)
  })
  it("has correct totalSuply", async function () {
    expect(await token.totalSupply()).to.equal(totalSupply)
  })
  it("has correct token balance", async function () {
    expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
  })
})
