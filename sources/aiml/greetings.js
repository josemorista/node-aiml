const greetingsSmallTalks = require('../smallTalks/greetings')
const { patterns, choices, pattern, template } = require('../../node-aiml')

module.exports = `
<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
${patterns(
  greetingsSmallTalks,
  template({
    srai: 'INITIAL_OPTIONS',
    msg: 'Hi!'
  })
)}
${pattern(
  'INITIAL_OPTIONS',
  template({
    oob: choices(['button1', 'button2'])
  })
)}
</aiml>
`
