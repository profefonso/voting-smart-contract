const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

// Simple check whether we use the hardhat network
const isHardHatNetwork = () => {
    return hre.network.name === "hardhat";
  };
  
  async function waitNextBlock() {
    if (isHardHatNetwork()) {
      return helpers.mine();
    }
  
    const startBlock = await ethers.provider.getBlockNumber();
  
    return new Promise((resolve, reject) => {
      const isNextBlock = async () => {
        const currentBlock = await ethers.provider.getBlockNumber();
        if (currentBlock > startBlock) {
          resolve();
        } else {
          setTimeout(isNextBlock, 300);
        }
      };
      setTimeout(isNextBlock, 300);
    });
  }

describe("Voting", function () {
  let owner, player;
  let voting;

  // Setup only once at the beginning of the test
  this.beforeAll(async function () {
    [owner, player] = await ethers.getSigners();
    voting = await ethers.deployContract("Voting");
  });

  it("Vote", async function () {
    const voteResult = await voting.vote(2);
    await waitNextBlock();
    //expect(voteResult).to.be.equal(true)
    console.log(voteResult)
  });

  it("Winner", async function () {
    const win = await voting.getWinner();
    await waitNextBlock();
    expect(win).to.be.equal(2);
  });

});