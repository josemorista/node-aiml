const getEntityIndex = intent => {
  const index = intent.indexOf('{{entity}}')
  let count = 1
  for (let i = 0; i < index; i++) {
    if (intent[i] === '*' || intent[i] === '#' || intent[i] === '_') count++
  }
  return count
}

mapEntities = ({ entities = [], response = `` }) => {
  return `<condition var="entity">\n${entities
    .map(entity => `<li value="${entity.toLowerCase()}">${response}</li>`)
    .join('\n')}\n</condition>`
}

module.exports = class AIML {
  constructor(version = '2.0', encoding = 'UTF-8') {
    this.version = version
    this.encoding = encoding
    this.src = ''
  }

  addIntentsToAction(intents, action) {
    this.src += '\n'
    this.src += intents
      .map(
        intent =>
          `<category><pattern>${intent.replace(
            `{{entity}}`,
            '*'
          )}</pattern><template><srai>${action.toUpperCase()} <lowercase><star index="${getEntityIndex(
            intent
          )}" /></lowercase></srai></template></category>`
      )
      .join('\n')
  }

  addAction(action, entities = [], response = '') {
    this.src += '\n'
    if (entities.length === 0) {
      this.src = `<category><pattern>${action.toUpperCase()}</pattern><template>${response}</template></category>`
    } else {
      this.src += entities
        .map(
          entity =>
            `<category><pattern>${action.toUpperCase()} *</pattern>\n<template>\n<think>\n<set var="entity"><star/></set>\n</think>\n${mapEntities(
              entity
            )}\n</template>\n</category>`
        )
        .join('\n')
    }
  }

  addCode(code = ``) {
    this.src += '\n'
    this.src += code
  }

  compile() {
    return `<?xml version="1.0" encoding="${this.encoding}"?>\n<aiml version="${this.version}">\n${this.src}\n</aiml>`
  }
}
