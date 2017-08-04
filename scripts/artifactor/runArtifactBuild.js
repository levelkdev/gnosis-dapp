require('babel-polyfill')
require('babel-register')

const fs = require('fs')
const saveArtifact = require('./saveArtifact').default

fs.readdirSync('./build/contracts').forEach(file => {
  const contractData = JSON.parse(fs.readFileSync(`./build/contracts/${file}`, 'utf8'))
  saveArtifact(contractData, artifactName(file))
})

function artifactName (fileName) {
  return fileName.replace('.json', '')
}
