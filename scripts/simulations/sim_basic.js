import accounts from '../../src/utils/accounts'
import toWei from '../../src/utils/toWei'
import fromWei from '../../src/utils/fromWei'
import requireContract from '../../src/utils/requireContract'
import {
  createMarket,
  approveMarketContractTransfer,
  buyEthTokens,
  buyOutcomeToken,
  fundMarket
} from '../../src/market'
import logMarketState from '../../src/loggers/logMarketState'
import logEthTokenBalances from '../../src/loggers/logEthTokenBalances'
import logOutcomeTokenPrices from '../../src/loggers/logOutcomeTokenPrices'

const LMSRMarketMaker = requireContract('LMSRMarketMaker')

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
  await approveMarketContractTransfer(market, accounts[0], toWei(10))

  // accounts[0] funds the market with 10 ethToken
  await fundMarket(market, accounts[0], toWei(10))
  
  await approveMarketContractTransfer(market, accounts[1], toWei(100))
  await approveMarketContractTransfer(market, accounts[2], toWei(100))



  /* const lmsr = await LMSRMarketMaker.deployed()
  const cost0 = await lmsr.calcCost(market.address, 0, toWei(1))
  console.log('COST 0: ', fromWei(cost0.toNumber()))
  const cost1 = await lmsr.calcCost(market.address, 1, toWei(1))
  console.log('COST 1: ', fromWei(cost1.toNumber())) */

  // const fee = await market.calcMarketFee.call(0)
  // console.log('FEE: ', fromWei(fee.toNumber()))
  
  console.log('')
  await logOutcomeTokenPrices(market)

  console.log('')
  await buyOutcomeToken(market, accounts[1], 1, toWei(2))

  console.log('')
  await logOutcomeTokenPrices(market)

  console.log('')
  await buyOutcomeToken(market, accounts[2], 1, toWei(18))
  
  console.log('')
  await logOutcomeTokenPrices(market)

  console.log('')
  await logMarketState(market)
}
