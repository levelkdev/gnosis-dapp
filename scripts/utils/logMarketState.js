import _ from 'lodash'
import { web3 } from '../../src/utils/w3'
import toWei from '../../src/utils/toWei'
import fromWei from '../../src/utils/fromWei'
import requireContract from '../../src/utils/requireContract'
import shortAddress from '../../src/utils/shortAddress'
import addressName from '../../src/utils/addressName'
import {
  approveAndBuy,
  approveMarketContractTransfer,
  buyEthTokens
} from '../../src/market'

const StandardMarketFactory = requireContract('StandardMarketFactory')
const StandardMarket = requireContract('StandardMarket')
const EventFactory = requireContract('EventFactory')
const CategoricalEvent = requireContract('CategoricalEvent')
const LMSRMarketMaker = requireContract('LMSRMarketMaker')
const CentralizedOracleFactory = requireContract('CentralizedOracleFactory')
const CentralizedOracle = requireContract('CentralizedOracle')
const EtherToken = requireContract('EtherToken')
const OutcomeToken = requireContract('OutcomeToken')

const { accounts } = web3.eth

export default async function logMarketState () {
  const etherToken = await EtherToken.deployed()
  // const market = await StandardMarket.deployed()

  let state = await etherToken.state({
    calls: [
      ['balanceOf', accounts[0]],
      ['balanceOf', accounts[1]],
      ['balanceOf', accounts[2]]
      // ['balanceOf', market.address]
    ]
  })
  // console.log(state.output())

  console.log('')
  console.log('EthToken Balances')
  console.log('-----------------')
  let call, address, result
  for(var i = 0; i < 3; i++) {
    call = state.props.balanceOf.calls[i]
    address = call.args[0]
    result = fromWei(call.result.toNumber())
    console.log(`${addressName(address)}: ${result}`)
  }
  console.log('')

  /*
  state = await oracle.state()
  console.log(state.output())

  state = await categoricalEvt.state()
  console.log(state.output())

  await logMarketState()

  await logMarketMakerState()

  _.forEach(outcomeTokens, async (outcomeToken) => {
    state = await outcomeToken.state({
      calls: [
        ['balanceOf', accounts[0]],
        ['balanceOf', accounts[1]],
        ['balanceOf', accounts[2]],
        ['balanceOf', marketContractAddress]
      ]
    })
    console.log(state.output())
  })
  */
}

async function logMarketState () {
  const state = await market.state({
    calls: [
      ['netOutcomeTokensSold', 0],
      ['netOutcomeTokensSold', 1]
    ]
  })
  console.log(state.output())
}

async function logMarketMakerState () {
  const state = await lmsrMarketMaker.state({
    calls: [
      ['calcCost', marketContractAddress, 0, 10000],
      ['calcCost', marketContractAddress, 1, 10000]
    ]
  })
  console.log(state.output())
}