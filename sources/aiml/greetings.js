const greetingsIntents = require('../intents/greetings')
const morningEntities = require('../entities/morning')

const Aiml = require('../../node-aiml')

const aiml = new Aiml()

aiml.addIntentsToAction(greetingsIntents, 'initial_action')

aiml.addAction('initial_action', [
  {
    entities: morningEntities,
    response: 'Bom dia!'
  }
])

module.exports = aiml.compile()
