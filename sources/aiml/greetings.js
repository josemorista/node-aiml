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
            srai(`INITIAL_OPTIONS${smallTalk.entity ? `<star index="${smallTalk.entity}" />` : ''}`)
          ])
        )
      )
      .join(''),
    pattern(
      'INITIAL_OPTIONS *',
      template([
        think([
          set(
            {
              name: 'entity'
            },
            '<star />'
          )
        ]),
        condition(
          {
            var: 'count'
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
