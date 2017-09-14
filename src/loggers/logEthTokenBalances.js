import accounts from '../utils/accounts'
import { web3 } from '../utils/w3'
import fromWei from '../utils/fromWei'
import requireContract from '../utils/requireContract'
import addressName from '../utils/addressName'

const EtherToken = requireContract('EtherToken')

export default async function logEthTokenBalances (market) {
  const etherToken = await EtherToken.deployed()
  
  let state = await etherToken.state({
    calls: [
      ['balanceOf', accounts[0]],
      ['balanceOf', accounts[1]],
      ['balanceOf', accounts[2]],
      ['balanceOf', market.address]
    ]
  })

  console.log('EthToken Balances')
  console.log('-----------------')
  console.log('ETHER: ' + fromWei(state.balance))
  let call, address, result
  for(var i = 0; i < 4; i++) {
    call = state.props.balanceOf.calls[i]
    address = call.args[0]
    result = fromWei(call.result.toNumber())
    console.log(`${addressName(address)}: ${result}`)
  }

  return state
}