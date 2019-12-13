const { cardinal, ordinal } = require('./utils')

const mapButtons = buttons => {
  if (!buttons || buttons.length === 0) return ''
  return `<oob><choices>${buttons.map(button => `<choice><value>${button}</value></choice>`).join('\n')}</choices></oob>`
}

const mapResponses = (response, buttons) => {
  if (Array.isArray(response)) {
    return `\n<random>\n${response.map(resp => `<li>${resp}${mapButtons(buttons)}</li>`).join('\n')}\n</random>\n`
  }
  return `${response}${mapButtons(buttons)}`
}

const searchForNumber = str => {
  let number = ``
  let isOrdinal = false
  let numbers = []
  for (let i = 0; i < 10; i++) {
    numbers[i] = `${i}`
  }
  for (let i = 0; i < str.length; i++) {
    if (numbers.includes(str[i])) {
      while (true) {
        if (i < str.length && numbers.includes(str[i])) {
          number += `${str[i]}`
          i++
        } else {
          if (i < str.length && str[i] === '°') {
            isOrdinal = true
          }
          return { number, isOrdinal }
        }
      }
    }
  }
  return null
}

const setCharAt = (strAccent, index, c) => {
  if (index >= strAccent.length) return strAccent
  let str = strAccent.split('')
  str[index] = c
  return str.join('')
}

const removeOneAccentOrSpecialChar = strAccent => {
  let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž'
  let accentsOut = 'AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz'
  let str = strAccent.split('')
  str.forEach((letter, index) => {
    let i = accents.indexOf(letter)
    if (i !== -1) {
      str[index] = accentsOut[i]
      return str.join('')
    }
  })
  return str.join('')
}

const wildCardsVariations = element => {
  let newSamples = []
  newSamples.push(`^ ${element} ^`)
  return newSamples
}

const removeDuplicates = v => {
  v.forEach(element => {
    v = v.filter(e => e !== element)
    v.push(element)
  })
  return v
}

const mapContext = context => {
  if (!context) return ''
  return `<think><set name="topic">${context.toUpperCase()}</set></think>`
}

const generateVariations = (variation, wildCards) => {
  let newSamples = []
  let processed = variation
  let str = variation
  newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(variation) : [variation])]
  let splt = str.split(' ')
  splt.forEach(word => {
    if (word[word.length - 1] === 's') {
      let index = variation.indexOf(word)
      processed = setCharAt(variation, index + word.length - 1, 'z')
      newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
      processed = setCharAt(variation, index + word.length - 1, '')
      newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
    }
    let z = word.indexOf('z')
    let cs = word.indexOf('ç')
    let ss = word.indexOf('ss')

    if (ss !== -1 && ss !== 0) {
      let index = variation.indexOf(word)
      processed = setCharAt(variation, index + ss, 'ç')
      processed = setCharAt(variation, index + ss + 1, '')
      newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
      processed = setCharAt(variation, index + ss, 's')
      newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
    } else {
      let s = word.indexOf('s')
      if (s !== -1 && s !== 0 && s !== word.length - 1 && ['a', 'e', 'i', 'o', 'u'].includes(word[s + 1])) {
        let index = variation.indexOf(word)
        processed = setCharAt(variation, index + s, 'ç')
        newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
        processed = `${variation.slice(0, index + s)}s${variation.slice(index + s, variation.length)}`
        newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
      }
    }
    if (cs !== -1 && cs !== 0 && cs !== word.length - 1 && ['a', 'e', 'i', 'o', 'u'].includes(word[cs + 1])) {
      let index = variation.indexOf(word)
      processed = setCharAt(variation, index + cs, 's')
      newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
      processed = setCharAt(variation, index + cs, 'c')
      newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
    }
    if (z !== -1 && z !== 0) {
      let index = variation.indexOf(word)
      processed = setCharAt(variation, index + z, 's')
      newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
    }

    let hasNumber = searchForNumber(word)
    if (hasNumber !== null) {
      let toText = hasNumber.isOrdinal ? ordinal(hasNumber.number) : cardinal(hasNumber.number)
      if (toText) {
        processed = processed.replace(word, toText)
        newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
      }
    }
  })
  while (true) {
    processed = removeOneAccentOrSpecialChar(str)
    if (str !== processed) {
      newSamples = [...newSamples, ...(wildCards ? wildCardsVariations(processed) : [processed])]
      str = processed
    } else {
      break
    }
  }
  return newSamples
}

module.exports = class AIML {
  constructor(version = '2.0', encoding = 'UTF-8') {
    this.version = version
    this.encoding = encoding
    this.intents = {}
    this.src = ''
  }

  static generateSamplesVariations(samples = [], wildCards = true) {
    let newSamples = []
    samples.forEach(sample => {
      let variations = generateVariations(sample.toLowerCase(), wildCards)
      variations.forEach(variation => {
        newSamples = [...newSamples, ...generateVariations(variation, false)]
      })
    })
    return removeDuplicates(newSamples)
  }

  addIntentsToAction(intents, action) {
    this.intents[action] = {
      intents: this.intents[action] ? [...intents, this.intents[action].intents] : Array.isArray(intents) ? intents : [intents],
      initialIndex: this.intents[action] ? this.intents[action].initialIndex : 0
    }
  }

  clearActionIntents(action) {
    if (this.intents[action]) {
      delete this.intents[action]
    }
  }

  addAction(action = '', entities = [], { response, buttons, context, setContext } = {}) {
    this.src += `${context ? `<topic name="${context.toUpperCase()}">\n` : '\n'}`
    if (entities.length > 0) {
      if (!this.intents[action]) {
        this.addIntentsToAction(['{{entity}}'], action)
      }
      this.intents[action].intents.forEach(intent => {
        entities.forEach((e, index) => {
          e.entities.forEach(entity => {
            this.src += `\n<category><pattern>${intent.replace('{{entity}}', entity).toUpperCase()}</pattern><template><srai>${action.toUpperCase()} ${this.intents[action].initialIindex +
              index}</srai></template></category>`
          })
        })
      })
      entities.forEach((e, index) => {
        this.src += `\n<category><pattern>${action.toUpperCase()} ${this.intents[action].initialIindex + index}</pattern><template>${mapContext(e.setContext || setContext)}${mapResponses(
          e.response,
          e.buttons
        )}\n${response ? mapResponses(response, buttons) : ''}</template></category>`
      })
      this.intents[action].initialIndex += entities.length
    } else {
      if (this.intents[action]) {
        this.intents[action].intents.forEach(intent => {
          this.src += `\n<category><pattern>${intent.toUpperCase()}</pattern><template><srai>${action.toUpperCase()}</srai></template></category>`
        })
      }
      this.src += `\n<category><pattern>${action.toUpperCase()}</pattern><template>${mapContext(setContext)}${mapResponses(response, buttons)}</template></category>`
    }
    this.src += `${context ? `</topic>\n` : '\n'}`
  }

  addCode(code = ``) {
    this.src += '\n'
    this.src += code
  }

  getSrc() {
    return this.src
  }

  compile() {
    Object.keys(this.intents).forEach(key => {
      this.clearActionIntents(key)
    })
    return `<?xml version="1.0" encoding="${this.encoding}"?>\n<aiml version="${this.version}">\n${this.src}\n</aiml>`
  }
}
