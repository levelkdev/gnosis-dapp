import truffleContract from 'truffle-contract'
import truffleExt from 'truffle-ext'
import {
  web3,
  web3Provider
} from './w3'
const { requireContract } = truffleExt(web3)

export default (contractName) => {
  return requireContract(truffleArtifact(contractName))
}

export function truffleArtifact (contractName) {
  const contractJSON = require(`../../build/contracts/${contractName}.json`)
  const contract = truffleContract(contractJSON)
  contract.setProvider(web3Provider)
  contract.defaults({
    from: web3.eth.accounts[0],
    gas: 4500000
  })
  return contract
}
