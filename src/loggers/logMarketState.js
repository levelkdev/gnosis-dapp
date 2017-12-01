import logEthTokenBalances from './logEthTokenBalances'
import logOutcomeTokenPrices from './logOutcomeTokenPrices'
import logOutcomeTokenBalances from './logOutcomeTokenBalances'

export default async function logMarketState (market) {
  await logEthTokenBalances(market)
  console.log('')

  await logOutcomeTokenBalances(market)
  console.log('')

  return await logOutcomeTokenPrices(market)
}
