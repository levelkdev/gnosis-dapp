import _ from 'lodash'
import { web3 } from '../../src/utils/w3'
import shortAddress from './shortAddress'

const { accounts } = web3.eth

const names = [
  'Bill',
  'Alice',
  'Jim',
  'Sarah',
  'Travis',
  'Lisa',
  'Walter',
  'Beth',
  'Rick',
  'Jill'
]

export default function (address) {
  return names[_.indexOf(accounts, address)] || shortAddress(address)
}
