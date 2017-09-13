import toWei from './utils/toWei'
import fromWei from './utils/fromWei'
import addressName from './utils/addressName'
import outcomeTokenName from './utils/outcomeTokenName'
import requireContract from './utils/requireContract'
const EtherToken = requireContract('EtherToken')

export async function buyEthTokens (amount, address) {
  const etherToken = await EtherToken.deployed()
  const numTokens = toWei(amount)
  console.log(`${addressName(address)} bought ${amount} EthToken`)
  const depositTx = await etherToken.deposit({ value: numTokens, from: address })
  return depositTx
}

export async function approveAndBuy (market, buyer, outcome, amount) {
  await approveMarketContractTransfer(market, buyer, amount)
  await buyOutcomeToken(market, buyer, outcome, amount)
}

export async function buyOutcomeToken (market, buyer, outcomeTokenIndex, numTokens) {
  console.log(`${addressName(buyer)} bought ${fromWei(numTokens)} ${outcomeTokenName(outcomeTokenIndex)}`)
  const maxCost = toWei(100)
  const cost = await market.buy.call(
    outcomeTokenIndex, numTokens, maxCost, { from: buyer }
  )
  console.log('GOT COST: ', fromWei(cost.toNumber()))
  await market.buy(outcomeTokenIndex, numTokens, maxCost, { from: buyer, gas: 4500000 })
}

export async function approveMarketContractTransfer (market, tokenOwner, numEthTokens) {
  const etherToken = await EtherToken.deployed()
  // console.log(`market approved to spend ${fromWei(numEthTokens)} EthToken owned by ${addressName(tokenOwner)}`)
  await etherToken.approve(market.address, numEthTokens, { from: tokenOwner, gas: 4500000 })
}
