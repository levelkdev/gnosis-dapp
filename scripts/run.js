require('babel-polyfill')
require('babel-register')

const { SCRIPT_PATH: scriptPath } = process.env

const runScript = require(`./${scriptPath}`).default

module.exports = function (callback) {
  async function run () {
    try {
      await runScript()
    } catch (err) {
      console.log(`${scriptPath} failed: `, err)
    } finally {
      callback()
    }
  }
  run()
}
