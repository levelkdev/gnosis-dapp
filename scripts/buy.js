import { web3 } from '../src/utils/w3'
import requireContract from '../src/utils/requireContract'
import { buyEthTokens } from '../src/market'

const { accounts } = web3.eth

const EtherToken = requireContract('EtherToken')

export default async function () {
  const etherToken = await EtherToken.deployed()

  await buyEthTokens(50, accounts[0])
  await buyEthTokens(50, accounts[1])
  await buyEthTokens(50, accounts[2])

  const tokenState = await etherToken.state({
    calls: [
      ['balanceOf', accounts[0]],
      ['balanceOf', accounts[1]],
      ['balanceOf', accounts[2]]
    ]
  })
  console.log(tokenState.output())
}
