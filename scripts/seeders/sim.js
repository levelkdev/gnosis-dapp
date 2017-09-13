import _ from 'lodash'
import { web3 } from '../../src/utils/w3'
import toWei from '../../src/utils/toWei'
import fromWei from '../../src/utils/fromWei'
import requireContract from '../../src/utils/requireContract'
import shortAddress from '../../src/utils/shortAddress'
import addressName from '../../src/utils/addressName'
import {
  approveAndBuy,
  approveMarketContractTransfer,
  buyEthTokens
} from '../../src/market'
import logMarketState from '../utils/logMarketState'

const StandardMarketFactory = requireContract('StandardMarketFactory')
const StandardMarket = requireContract('StandardMarket')
const EventFactory = requireContract('EventFactory')
const CategoricalEvent = requireContract('CategoricalEvent')
const LMSRMarketMaker = requireContract('LMSRMarketMaker')
const CentralizedOracleFactory = requireContract('CentralizedOracleFactory')
const CentralizedOracle = requireContract('CentralizedOracle')
const EtherToken = requireContract('EtherToken')
const OutcomeToken = requireContract('OutcomeToken')

const { accounts } = web3.eth

const delay = 0
let ipfsHash = 'Qmcpo2iLBikrdf1d6QU6vXuNb6P7hwrbNPW9kLAH8eG67z'

let etherToken, oracle, categoricalEvt, marketContractAddress, lmsrMarketMaker
let outcomeTokens = []

export default async function () {
  // buy a lot of eth tokens for accounts
  await purchaseInitialTokens()
  await wait(delay)

  // initialize all the contracts to create a new market
  const market = await createMarket()
  await wait(delay)

  // approve the transfer for 10 ethToken from accounts[0] to the market contract
  await approveMarketContractTransfer(market, accounts[0], toWei(10))
  await wait(delay)

  // accounts[0] funds the market with 10 ethToken
  await fundMarket(toWei(10))
  await wait(delay)

  await approveAndBuy(market, accounts[1], 1, toWei(2))
  await approveAndBuy(market, accounts[2], 0, toWei(18))

  await logMarketState()

  await wait(delay)

  async function fundMarket (amount) {
    console.log(`${addressName(accounts[0])} funded market with ${fromWei(amount)} EthToken`)
    await market.fund(amount, { from: accounts[0] })
  }

  function wait (t) {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve()
        }, t)
      } catch (err) {
        reject(err)
      }
    })
  }

  async function createMarket () {
    const standardMarketFactory = await StandardMarketFactory.deployed()
    const eventFactory = await EventFactory.deployed()
    lmsrMarketMaker = await LMSRMarketMaker.deployed()
    const centralizedOracleFactory = await CentralizedOracleFactory.deployed()

    etherToken = await EtherToken.deployed()

    // console.log('creating oracle')
    let oracleTx = await centralizedOracleFactory.createCentralizedOracle(ipfsHash)
    const oracleAddress = oracleTx.logs[0].args.centralizedOracle
    oracle = await CentralizedOracle.at(oracleAddress)

    await wait(delay)

    // console.log('creating categorical event')
    const eventTx = await eventFactory.createCategoricalEvent(
      etherToken.address,
      oracle.address,
      2
    )
    const categoricalEvtAddress = eventTx.logs[0].args.categoricalEvent
    categoricalEvt = await CategoricalEvent.at(categoricalEvtAddress)
    const catEvtState = await categoricalEvt.state()
    _.forEach(catEvtState.props.getOutcomeTokens, async (outcomeTokenAddress, i) => {
      let outcomeToken = await OutcomeToken.at(outcomeTokenAddress)
      // console.log(` ${i}: outcomeToken `, shortAddress(outcomeToken.address))
      outcomeTokens.push(outcomeToken)
    })

    await wait(delay)

    // console.log('creating market')
    const marketTx = await standardMarketFactory.createMarket(
      categoricalEvt.address,
      lmsrMarketMaker.address,
      0
    )
    marketContractAddress = marketTx.logs[0].args.market
    // console.log(`market created: ${marketContractAddress}`)
    const market = await StandardMarket.at(marketContractAddress)
    return market
  }

  async function purchaseInitialTokens () {
    await buyEthTokens(75, accounts[0])
    await wait(delay)

    await buyEthTokens(75, accounts[1])
    await wait(delay)

    await buyEthTokens(75, accounts[2])
    await wait(delay)
  }
}
