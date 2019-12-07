const greetingsSmallTalks = require('../smallTalks/greetings')
const morningEntities = require('../entities/morning')
const { aiml, pattern, template, set, condition, srai, think, li } = require('../../node-aiml')

module.exports = aiml(
  {
    version: '2.0',
    encoding: 'UTF-8'
  },
  [
    greetingsSmallTalks
      .map(smallTalk =>
        pattern(
          smallTalk.pattern,
          template([
            srai(
              `INITIAL_OPTIONS${
                smallTalk.entityAt !== null || smallTalk.entityAt !== undefined
                  ? ` <star index="${smallTalk.entityAt}" />`
                  : ''
              }`
            )
          ])
        )
      )
      .join('\n'),
    pattern(
      'INITIAL_OPTIONS *',
      template([
        think([
          set(
            {
              var: 'entity'
            },
            '<star />'
          )
        ]),
        condition(
          {
            var: 'entity'
          },
          [
            morningEntities
              .map(entity =>
                li(
                  {
                    value: entity
                  },
                  `Bom dia!`
                )
              )
              .join('')
          ]
        )
      ])
    )
  ]
)
