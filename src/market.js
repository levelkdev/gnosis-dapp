import _ from 'lodash'
import toWei from './utils/toWei'
import fromWei from './utils/fromWei'
import addressName from './utils/addressName'
import outcomeTokenName from './utils/outcomeTokenName'
import requireContract from './utils/requireContract'

const StandardMarketFactory = requireContract('StandardMarketFactory')
const StandardMarket = requireContract('StandardMarket')
const EventFactory = requireContract('EventFactory')
const CategoricalEvent = requireContract('CategoricalEvent')
const LMSRMarketMaker = requireContract('LMSRMarketMaker')
const CentralizedOracleFactory = requireContract('CentralizedOracleFactory')
const CentralizedOracle = requireContract('CentralizedOracle')
const EtherToken = requireContract('EtherToken')
const OutcomeToken = requireContract('OutcomeToken')

let ipfsHash = 'Qmcpo2iLBikrdf1d6QU6vXuNb6P7hwrbNPW9kLAH8eG67z'

export async function createMarket () {
  let outcomeTokens = []
  const standardMarketFactory = await StandardMarketFactory.deployed()
  const eventFactory = await EventFactory.deployed()
  const lmsrMarketMaker = await LMSRMarketMaker.deployed()
  const centralizedOracleFactory = await CentralizedOracleFactory.deployed()

  const etherToken = await EtherToken.deployed()

  // console.log('creating oracle')
  let oracleTx = await centralizedOracleFactory.createCentralizedOracle(ipfsHash)
  const oracleAddress = oracleTx.logs[0].args.centralizedOracle
  const oracle = await CentralizedOracle.at(oracleAddress)

  // console.log('creating categorical event')
  const eventTx = await eventFactory.createCategoricalEvent(
    etherToken.address,
    oracle.address,
    2
  )
  const categoricalEvtAddress = eventTx.logs[0].args.categoricalEvent
  const categoricalEvt = await CategoricalEvent.at(categoricalEvtAddress)
  const catEvtState = await categoricalEvt.state()
  _.forEach(catEvtState.props.getOutcomeTokens, async (outcomeTokenAddress, i) => {
    let outcomeToken = await OutcomeToken.at(outcomeTokenAddress)
    // console.log(` ${i}: outcomeToken `, shortAddress(outcomeToken.address))
    outcomeTokens.push(outcomeToken)
  })

  // console.log('creating market')
  const marketTx = await standardMarketFactory.createMarket(
    categoricalEvt.address,
    lmsrMarketMaker.address,
    0
  )
  const marketContractAddress = marketTx.logs[0].args.market
  // console.log(`market created: ${marketContractAddress}`)
  const market = await StandardMarket.at(marketContractAddress)
  return {
    categoricalEvt,
    market,
    outcomeTokens,
    oracle
  }
}

export async function buyEthTokens (amount, address) {
  const etherToken = await EtherToken.deployed()
  const numTokens = toWei(amount)
  console.log(`${addressName(address)} bought ${amount} EthToken`)
  const depositTx = await etherToken.deposit({ value: numTokens, from: address })
  return depositTx
}

export async function approveAndBuy (market, buyer, outcome, amount) {
  await approveMarketBuy(market, buyer, amount)
  return await buyOutcomeToken(market, buyer, outcome, amount)
}

export async function buyOutcomeToken (market, buyer, outcomeTokenIndex, numTokens) {
  const maxCost = toWei(100)
  const costBigNum = await market.buy.call(
    outcomeTokenIndex, numTokens, maxCost, { from: buyer }
  )
  const cost = fromWei(costBigNum.toNumber())
  const mkTx = await market.buy(outcomeTokenIndex, numTokens, maxCost, { from: buyer, gas: 4500000 })
  console.log(`${addressName(buyer)} bought ${fromWei(numTokens)} ${outcomeTokenName(outcomeTokenIndex)} for ${cost}`)
  
  return mkTx
}

export async function sellOutcomeToken (market, seller, outcomeTokenIndex, numTokens) {
  const outcomeTokens = await getOutcomeTokens(market)
  const outcomeToken = outcomeTokens[outcomeTokenIndex]
  await outcomeToken.approve(market.address, numTokens, { from: seller })
  const minProfit = toWei(0.01)
  const profitBigNum = await market.sell.call(
    outcomeTokenIndex, numTokens, minProfit, { from: seller }
  )
  const profit = fromWei(profitBigNum.toNumber())
  const mkTx = await market.sell(outcomeTokenIndex, numTokens, minProfit, { from: seller, gas: 4500000 })
  console.log(`${addressName(seller)} sold ${fromWei(numTokens)} ${outcomeTokenName(outcomeTokenIndex)} for ${profit}`)
  
  return mkTx
}

export async function approveMarketBuy (market, tokenOwner, numEthTokens) {
  const etherToken = await EtherToken.deployed()
  // console.log(`market approved to spend ${fromWei(numEthTokens)} EthToken owned by ${addressName(tokenOwner)}`)
  return await etherToken.approve(market.address, numEthTokens, { from: tokenOwner, gas: 4500000 })
}

/*
export async function approveMarketSell (market, tokenOwner, numEthTokens) {
  const etherToken = await EtherToken.deployed()
  // console.log(`market approved to spend ${fromWei(numEthTokens)} EthToken owned by ${addressName(tokenOwner)}`)
  return await etherToken.approve(market.address, numEthTokens, { from: tokenOwner, gas: 4500000 })
}
*/

export async function fundMarket (market, account, amount) {
  console.log(`${addressName(account)} funded market with ${fromWei(amount)} EthToken`)
  return await market.fund(amount, { from: account })
}

export async function getOutcomeTokens (market) {
  const evtAddress = await market.eventContract.call()
  const categoricalEvent = await CategoricalEvent.at(evtAddress)
  const outcomeNoAddress = await categoricalEvent.outcomeTokens.call(0)
  const outcomeNo = await OutcomeToken.at(outcomeNoAddress)
  const outcomeYesAddress = await categoricalEvent.outcomeTokens.call(1)
  const outcomeYes = await OutcomeToken.at(outcomeYesAddress)
  return [outcomeNo, outcomeYes]
}
