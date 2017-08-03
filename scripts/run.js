require('babel-polyfill')
require('babel-register')

const runScript = require(`./${process.env.SCRIPT_PATH}`).default

module.exports = function (callback) {
  async function run () {
    await runScript()
    callback()
  }
  run()
}
