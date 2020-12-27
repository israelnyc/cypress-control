const runner = require('./runner')

module.exports = function() {
    console.log('cypress-dashboard server')

    runner.start()    
}