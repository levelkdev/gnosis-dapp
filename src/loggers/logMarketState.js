import logEthTokenBalances from './logEthTokenBalances'
import logOutcomeTokenPrices from './logOutcomeTokenPrices'

export default async function logMarketState (market) {
  await logEthTokenBalances()
  console.log('')
  console.log('OutcomeToken Prices')
  console.log('-------------------')
  return await logOutcomeTokenPrices(market)
}
