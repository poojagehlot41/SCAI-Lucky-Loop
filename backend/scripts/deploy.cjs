const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Deploying SCAI Lucky Loop Contracts...\n");

  // Deploy SCAI Token
  const ScaiToken = await hre.ethers.getContractFactory("ScaiToken");
  const token = await ScaiToken.deploy();
  await token.waitForDeployment();

  console.log("✅ SCAI Token Deployed");
  console.log("Token Address:", await token.getAddress());

  console.log("--------------------------------");

  // Deploy Lottery
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy();
  await lottery.waitForDeployment();

  console.log("✅ Lottery Contract Deployed");
  console.log("Lottery Address:", await lottery.getAddress());

  console.log("--------------------------------");
  console.log("🎉 Deployment Completed Successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});