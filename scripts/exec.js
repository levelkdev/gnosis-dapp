require('babel-polyfill')
require('babel-register')

const { SCRIPT_PATH: scriptPath } = process.env

const runScript = require(`./${scriptPath}`).default

runScript().then(() => {
  console.log('SCRIPT SUCCEEDED')
}, (err) => {
  console.log(`${scriptPath} failed: `, err.stack)
})
