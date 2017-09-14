import accounts from '../../src/utils/accounts'
import toWei from '../../src/utils/toWei'
import requireContract from '../../src/utils/requireContract'
import {
  createMarket,
  approveMarketBuy,
  buyEthTokens,
  buyOutcomeToken,
  fundMarket
} from '../../src/market'
import logMarketState from '../../src/loggers/logMarketState'
import logOutcomeTokenPrices from '../../src/loggers/logOutcomeTokenPrices'

export default async function () {
  // initialize all the contracts to create a new market
  const { market, outcomeTokens, oracle } = await createMarket()

  console.log('')
  // buy eth tokens for accounts
  await buyEthTokens(100, accounts[0])
  await buyEthTokens(100, accounts[1])
  await buyEthTokens(100, accounts[2])

  console.log('')
  // approve the transfer for 10 ethToken from accounts[0] to the market contract
  await approveMarketBuy(market, accounts[0], toWei(10))

  // accounts[0] funds the market with 10 ethToken
  await fundMarket(market, accounts[0], toWei(10))
  
  await approveMarketBuy(market, accounts[1], toWei(100))
  await approveMarketBuy(market, accounts[2], toWei(100))

  await account1Buy(market)
  /* await account1Buy(market)
  await account1Buy(market)
  await account1Buy(market)
  
  await account2Buy(market)
  await account2Buy(market)
  await account2Buy(market)
  await account2Buy(market) */

  console.log('')
  await logMarketState(market)
}

async function account1Buy (market) {
  return buy(market, accounts[1], 1)
}

async function account2Buy (market) {
  return buy(market, accounts[2], 0)
}

async function buy (market, account, outcomeIdx) {
  console.log('')
  await buyOutcomeToken(market, account, outcomeIdx, toWei(1))

  console.log('')
  return await logOutcomeTokenPrices(market)
}
