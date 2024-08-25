const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

describe("Exchange", function() {
    let deployer, feeAccount, exchange, token1, user1

    const feePercent = 10
    beforeEach(async() => {
        const Exchange = await ethers.getContractFactory("Exchange")
        const Token = await ethers.getContractFactory("Token")

        token1 = await Token.deploy("Dapp University Token", "DUT", 1000000)
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]
        exchange = await Exchange.deploy(feeAccount.address, feePercent)


        // users
        user1 = accounts[2]

        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
        await transaction.wait()
    })

    describe("Deployment", () => {

        it("has correct name", async function() {
            expect(await exchange.feeAccount()).to.equal(feeAccount.address)
        })

        it('tracks the fee per account', async function() {
            expect(await exchange.feePercent()).to.equal(feePercent)
        })

    })

    describe('Deposit Tokens', () => {
        let transaction, result
        let amount = tokens(10)
        beforeEach(async() => {
            console.log(user1.address, exchange.address, amount.toString());
            // approve token
            transaction = await token1.connect(user1).approve(exchange.address, amount);
            result = await transaction.wait()
                // deposit token 
            transaction = await exchange.connect(user1).depositToken(token1.address, amount);
            result = await transaction.wait()
        })

        describe('Success', () => {
            it('tracks the token deposit', async function() {
                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(amount)
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
            })

            it('emits Deposit event', async function() {
                const event = result.events[1]
                console.log('====================================');
                console.log('events', result.events);
                console.log('====================================');
                expect(event.event).to.equal("Deposit")
                expect(event.args.token).to.equal(token1.address)
                expect(event.args.user).to.equal(user1.address)
                expect(event.args.amount).to.equal(amount)
                expect(event.args.balance).to.equal(amount)
            })

        })

        describe('Failure', () => {

        })

    })

})