import accounts from '../utils/accounts'
import toWei from '../utils/toWei'
import fromWei from '../utils/fromWei'
import requireContract from '../utils/requireContract'

const LMSRMarketMaker = requireContract('LMSRMarketMaker')

export default async function logOutcomeTokenPrices (market) {

  const lmsr = await LMSRMarketMaker.deployed()
  const cost0 = await lmsr.calcCost(market.address, 0, toWei(1))
  console.log('NO: ', fromWei(cost0.toNumber()))
  const cost1 = await lmsr.calcCost(market.address, 1, toWei(1))
  console.log('YES: ', fromWei(cost1.toNumber()))

  return cost1

  /* const maxCost = toWei(100)

  const costBigNum_0 = await market.buy.call(0, toWei(1), maxCost, { from: accounts[1] })
  const cost_0 = fromWei(costBigNum_0.toNumber())
  console.log('NO:  ', cost_0)

  const costBigNum_1 = await market.buy.call(1, toWei(1), maxCost, { from: accounts[1] })
  const cost_1 = fromWei(costBigNum_1.toNumber())
  console.log('YES: ', cost_1)

  return costBigNum_1 */
}
