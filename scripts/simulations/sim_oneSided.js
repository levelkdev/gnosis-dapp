import accounts from '../../src/utils/accounts'
import { web3, web3Provider } from '../../src/utils/w3'
import toWei from '../../src/utils/toWei'
import fromWei from '../../src/utils/fromWei'
import {
  createMarket,
  approveMarketBuy,
  buyEthTokens,
  buyOutcomeToken,
  sellOutcomeToken,
  fundMarket,
  getOutcomeTokens,
  setOutcome,
  closeMarket,
  redeemWinnings
} from '../../src/market'
import logMarketState from '../../src/loggers/logMarketState'
import logOutcomeTokenPrices from '../../src/loggers/logOutcomeTokenPrices'
import logOutcomeTokenBalances from '../../src/loggers/logOutcomeTokenBalances'
import logEthTokenBalances from '../../src/loggers/logEthTokenBalances'

export default async function () {
  // initialize all the contracts to create a new market
  const { categoricalEvt, market, oracle } = await createMarket()

  console.log('')
  // buy eth tokens for accounts
  await buyEthTokens(100, accounts[0])
  await buyEthTokens(100, accounts[1])
  await buyEthTokens(100, accounts[2])
  
  // approve the transfer for 10 ethToken from accounts[0] to the market contract
  await approveMarketBuy(market, accounts[0], toWei(10))

  // accounts[0] funds the market with 10 ethToken
  await fundMarket(market, accounts[0], toWei(10))
  
  await approveMarketBuy(market, accounts[1], toWei(100))
  await approveMarketBuy(market, accounts[2], toWei(100))

  console.log('')
  await logOutcomeTokenPrices(market)
  console.log('')
  await logOutcomeTokenBalances(market)

  console.log('')
  await buyOutcomeToken(market, accounts[1], 0, toWei(5))
  
  console.log('')
  await buyOutcomeToken(market, accounts[2], 0, toWei(48))

  console.log('')
  const tx = await sellOutcomeToken(market, accounts[1], 0, toWei(5))

  console.log('')
  await setOutcome(market, 0)

  console.log('')
  await closeMarket(market)

  console.log('')
  await redeemWinnings(market, accounts[0])
  
  console.log('')
  await redeemWinnings(market, accounts[1])
  
  console.log('')
  await redeemWinnings(market, accounts[2])

  console.log('')
  await logMarketState(market)
}
