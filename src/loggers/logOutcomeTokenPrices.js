import accounts from '../utils/accounts'
import toWei from '../utils/toWei'
import fromWei from '../utils/fromWei'
import requireContract from '../utils/requireContract'

const LMSRMarketMaker = requireContract('LMSRMarketMaker')

export default async function logOutcomeTokenPrices (market) {

  const lmsr = await LMSRMarketMaker.deployed()
  const noBuyPrice = await lmsr.calcCost(market.address, 0, toWei(1))
  const yesBuyPrice = await lmsr.calcCost(market.address, 1, toWei(1))
  const noSellPrice = await lmsr.calcProfit(market.address, 0, toWei(1))
  const yesSellPrice = await lmsr.calcProfit(market.address, 1, toWei(1))

  console.log('OutcomeToken Prices')
  console.log('-------------------')
  console.log('NO  (buy)  : ', fromWei(noBuyPrice.toNumber()))
  console.log('NO  (sell) : ', fromWei(noSellPrice.toNumber()))
  console.log('YES (buy)  : ', fromWei(yesBuyPrice.toNumber()))
  console.log('YES (sell) : ', fromWei(yesSellPrice.toNumber()))

  return {
    noBuyPrice,
    yesBuyPrice,
    noSellPrice,
    yesSellPrice
  }
}
