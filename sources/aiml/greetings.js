const greetingsSmallTalks = require('../smallTalks/greetings')
const { patterns, choices, pattern } = require('../../node-aiml')

module.exports = `
<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
${patterns(greetingsSmallTalks, { srai: 'INITIAL_OPTIONS', msg: 'Hi!' })}
${pattern('INITIAL_OPTIONS', {
  oob: choices(['button1', 'button2'])
})}
</aiml>
`
