import accounts from '../utils/accounts'
import fromWei from '../utils/fromWei'
import requireContract from '../utils/requireContract'
import addressName from '../utils/addressName'
import { getOutcomeTokens } from '../market'

const CategoricalEvent = requireContract('CategoricalEvent')
const OutcomeToken = requireContract('OutcomeToken')

export default async function logEthTokenBalances (market) {
  const outcomeTokens = await getOutcomeTokens(market)
  const outcomeNo = outcomeTokens[0]
  const outcomeYes = outcomeTokens[1]

  let stateNo = await outcomeNo.state({
    calls: [
      ['balanceOf', accounts[0]],
      ['balanceOf', accounts[1]],
      ['balanceOf', accounts[2]],
      ['balanceOf', market.address]
    ]
  })

  let stateYes = await outcomeYes.state({
    calls: [
      ['balanceOf', accounts[0]],
      ['balanceOf', accounts[1]],
      ['balanceOf', accounts[2]],
      ['balanceOf', market.address]
    ]
  })

  console.log('')
  console.log('NO OutcomeToken Balances')
  console.log('------------------------')
  let call, address, result
  for(var i = 0; i < 4; i++) {
    call = stateNo.props.balanceOf.calls[i]
    address = call.args[0]
    result = fromWei(call.result.toNumber())
    console.log(`${addressName(address)}: ${result}`)
  }
  
  console.log('')
  console.log('YES OutcomeToken Balances')
  console.log('-------------------------')
  for(var i = 0; i < 4; i++) {
    call = stateYes.props.balanceOf.calls[i]
    address = call.args[0]
    result = fromWei(call.result.toNumber())
    console.log(`${addressName(address)}: ${result}`)
  }

  return {
    stateNo,
    stateYes
  }
}
