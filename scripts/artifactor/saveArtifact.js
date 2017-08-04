const artifactor = require('truffle-artifactor')

export default (contractData, contractName) => {
  artifactor.save(contractData, `./build/artifacts/${contractName}.sol.js`)
}
