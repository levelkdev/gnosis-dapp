/* global artifacts */

let Math = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Utils/Math')
let EventFactory = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Events/EventFactory')
let EtherToken = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Token/EtherToken')
let CentralizedOracleFactory = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Oracles/CentralizedOracleFactory')
let MajorityOracleFactory = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Oracles/MajorityOracleFactory')
let DifficultyOracleFactory = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Oracles/DifficultyOracleFactory')
let FutarchyOracleFactory = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Oracles/FutarchyOracleFactory')
let UltimateOracleFactory = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Oracles/UltimateOracleFactory')
let LMSRMarketMaker = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/MarketMakers/LMSRMarketMaker')
let StandardMarketFactory = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Markets/StandardMarketFactory')
let CampaignFactory = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Markets/CampaignFactory')

let StandardMarketFactoryMod = artifacts.require('@gnosis.pm/gnosis-core-contracts/contracts/Markets/StandardMarketFactoryMod')

module.exports = function (deployer) {
  deployer.deploy(Math)
  deployer.link(Math, [EventFactory, UltimateOracleFactory, LMSRMarketMaker, StandardMarketFactory, EtherToken, StandardMarketFactoryMod])

  deployer.deploy(EventFactory).then(() => {
    deployer.deploy(FutarchyOracleFactory, EventFactory.address)
  })

  deployer.deploy(CentralizedOracleFactory)
  deployer.deploy(MajorityOracleFactory)
  deployer.deploy(DifficultyOracleFactory)

  deployer.link(Math, UltimateOracleFactory)
  deployer.deploy(UltimateOracleFactory)

  deployer.link(Math, LMSRMarketMaker)
  deployer.deploy(LMSRMarketMaker)

  deployer.link(Math, StandardMarketFactory)
  deployer.deploy(StandardMarketFactory)

  deployer.link(Math, EtherToken)
  deployer.deploy(EtherToken)

  deployer.link(Math, CampaignFactory)
  deployer.deploy(CampaignFactory)

  deployer.link(Math, StandardMarketFactoryMod)
  deployer.deploy(StandardMarketFactoryMod)
}
