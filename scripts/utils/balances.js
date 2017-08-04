import requireContract from '../../src/utils/requireContract'
import { web3 } from '../../src/utils/w3'

const EtherToken = requireContract('EtherToken')

export default async function getBalances () {
  const etherToken = await EtherToken.deployed()
  const state = await etherToken.state({
    calls: web3.eth.accounts.map((account) => ['balanceOf', account])
  })
  console.log(state.output())
}
