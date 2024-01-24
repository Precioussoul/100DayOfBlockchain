import {MyContract} from "./../typechain-types/MyContract"
import {ethers} from "hardhat"

async function main() {
  const MyContract = await ethers.getContractFactory("MyContract")
  const myContract = await MyContract.deploy()

  await myContract.getDeployedCode()

  console.log("my contract deployed", myContract.getAddress())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
