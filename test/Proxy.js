const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Proxy", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();

    const Logic1 = await ethers.getContractFactory("Logic1");
    const logic1 = await Logic1.deploy();

    const Logic2 = await ethers.getContractFactory("Logic2");
    const logic2 = await Logic2.deploy();

    const proxyAsLogic1 = await ethers.getContractAt(proxy.address, "Logic1");
    const proxyAsLogic2 = await ethers.getContractAt(proxy.address, "Logic2");

    return { proxy, logic1, logic2, proxyAsLogic1, proxyAsLogic2 };
  }

  it("Should work with logic1", async function () {
    const { proxy, logic1, proxyAsLogic1 } = await loadFixture(deployFixture);

    await proxy.changeImplementation(logic1.address);

    expect(await logic1.x()).to.equal(0);

    await proxyAsLogic1.changeX(52);

    expect(await logic1.x()).to.equal(52);
  });

  it("Should work with logic2", async function () {
    const { proxy, logic2 } = await loadFixture(deployFixture);

    await proxy.changeImplementation(logic2.address);

    await proxy.changeX(99);

    expect(await logic2.x()).to.equal(198);
  });
});
