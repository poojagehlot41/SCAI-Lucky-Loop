const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Deploying updated SCAI Lucky Loop Lottery...\n");

  const SCAI_TOKEN =
    "0xC6831944F79B197C54465509B2dE5BB66F65adA5";

  console.log("SCAI Token:", SCAI_TOKEN);

  const Lottery =
    await hre.ethers.getContractFactory("Lottery");

  const lottery =
    await Lottery.deploy(SCAI_TOKEN);

  await lottery.waitForDeployment();

  const lotteryAddress =
    await lottery.getAddress();

  console.log("✅ Updated Lottery Contract Deployed");
  console.log("Lottery Address:", lotteryAddress);

  console.log("--------------------------------");
  console.log("🎉 Lottery Deployment Completed Successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});