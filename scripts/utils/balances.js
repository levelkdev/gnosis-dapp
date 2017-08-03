/* global web3 artifacts */
import truffleExt from 'truffle-ext'
const { requireContract } = truffleExt(web3)

const EtherToken = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Token/EtherToken')
)

module.exports = function (callback) {
  async function run () {
    await getBalances()
    console.log('done')
    callback()
  }
  run()
}

async function getBalances () {
  const etherToken = await EtherToken.deployed()
  const state = await etherToken.state({
    calls: web3.eth.accounts.map((account) => ['balanceOf', account])
  })
  console.log(state.output())
}
