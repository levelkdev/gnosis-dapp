import accounts from '../utils/accounts'
import fromWei from '../utils/fromWei'
import requireContract from '../utils/requireContract'
import addressName from '../utils/addressName'

const EtherToken = requireContract('EtherToken')

export default async function logEthTokenBalances () {
  const etherToken = await EtherToken.deployed()
  
  let state = await etherToken.state({
    calls: [
      ['balanceOf', accounts[0]],
      ['balanceOf', accounts[1]],
      ['balanceOf', accounts[2]]
    ]
  })

  console.log('EthToken Balances')
  console.log('-----------------')
  let call, address, result
  for(var i = 0; i < 3; i++) {
    call = state.props.balanceOf.calls[i]
    address = call.args[0]
    result = fromWei(call.result.toNumber())
    console.log(`${addressName(address)}: ${result}`)
  }

  return state
}