import { web3 } from './w3'

export default function toEth (n) {
  return web3.fromWei(n, 'ether')
}
