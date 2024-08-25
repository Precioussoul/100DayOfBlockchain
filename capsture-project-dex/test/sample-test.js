const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

describe("Token", function() {
    let token, accounts, deployer, receiver, exchange

    beforeEach(async() => {
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy("Dapp University Token", "DUT", 1000000)
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        receiver = accounts[1]
        exchange = accounts[2]
    })

    describe("Deployment", () => {
        const name = "Dapp University Token"
        const symbol = "DUT"
        const decimal = 18
        const totalSupply = tokens(1000000)

        it("has correct name", async function() {
            expect(await token.name()).to.equal(name)
        })
        it("has correct symbol", async function() {
            expect(await token.symbol()).to.equal(symbol)
        })
        it("has correct decimals", async function() {
            expect(await token.decimal()).to.equal(decimal)
        })
        it("has correct totalSuply", async function() {
            expect(await token.totalSupply()).to.equal(totalSupply)
        })
        it("has correct token balance", async function() {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })

    })
    describe("Transfer", function() {
        let amount, transaction, result
        beforeEach(async() => {
            amount = tokens(100)
            transaction = await token.connect(deployer).transfer(receiver.address, amount)
            result = await transaction.wait()
        })

        it("transfer tokens", async function() {
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
            expect(await token.balanceOf(receiver.address)).to.equal(amount)
        })

        it("emits Transfer event", async function() {
            expect(result.events[0].event).to.equal("Transfer")
            expect(result.events[0].args.from).to.equal(deployer.address)
            expect(result.events[0].args.to).to.equal(receiver.address)
            expect(result.events[0].args.value).to.equal(amount)
        })

        it('reject insufficient balances', async() => {
            let invalidAmount = tokens(10000000)
            await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
        })

        it('reject invalid recipient', async() => {
            await expect(token.connect(deployer).transfer('0x00000000000000000000000000000000000', amount)).to.be.reverted
        })
    })

    describe('Approving Token', () => {
        let amount, transaction, result
        const invalidAddress = "0x0000000000000000000000000000000000000000"; // Valid but commonly used invalid address

        beforeEach(async() => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })

        describe('Success', () => {

            it('allocates on allowance for delegated token spending', async() => {

                expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
            })

            it("emits Approval event", async function() {
                expect(result.events[0].event).to.equal("Approval")
                expect(result.events[0].args.owner).to.equal(deployer.address)
                expect(result.events[0].args.spender).to.equal(exchange.address)
                expect(result.events[0].args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects invalid spenders', async() => {
                await expect(token.connect(deployer).approve(invalidAddress, amount)).to.be.reverted
            })
        })

    })


    describe('Delegated token transfer', () => {

        let amount, transaction, result
        const invalidAddress = "0x0000000000000000000000000000000000000000"; // Valid but commonly used invalid address

        beforeEach(async() => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount)
            result = await transaction.wait()
        })


        describe('Success', () => {
            beforeEach(async() => {
                transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
                result = await transaction.wait()
            })

            it('transfer token', async() => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            })
        })
        describe('Failure', () => {
            let invalidAmount = tokens(100000000)
            it('rejects invalid amount', async() => {
                await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
            })
        })
    })


})