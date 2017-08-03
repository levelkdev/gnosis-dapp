/* global web3 artifacts */

require('babel-polyfill')
require('babel-register')

/* const truffleExt = require('truffle-ext')

const { requireContract } = truffleExt(web3, { logEvents: false })

const StandardMarketFactory = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Markets/StandardMarketFactory')
)

const StandardMarket = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Markets/StandardMarket')
)

const EventFactory = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Events/EventFactory')
)

const CategoricalEvent = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Events/CategoricalEvent')
)

const MarketMaker = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/MarketMakers/LMSRMarketMaker')
)

const CentralizedOracleFactory = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Oracles/CentralizedOracleFactory')
)

const CentralizedOracle = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Oracles/CentralizedOracle')
)

const EtherToken = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Token/EtherToken')
)

const OutcomeToken = requireContract(
  artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Token/OutcomeToken')
)

const sim = require('./sim') */

const runScript = require(`./${process.env.SCRIPT_NAME}`).default

module.exports = function (callback) {
  async function run () {
    await runScript()
    callback()
  }
  run()
}
