const generateMultipleValueTag = (key, props = {}, values = []) =>
  `<${key} ${Object.keys(props)
    .map(key => `${key}="${props[key]}"`)
    .join(' ')}>${values.join('')}</${key}>`

const generateSingleValueTag = (key, props, value) =>
  `<${key} ${Object.keys(props)
    .map(key => `${key}="${props[key]}"`)
    .join(' ')}>${value}</${key}>`

const generatePatterns = (patterns, template) =>
  patterns
    .map(pattern => `<category><pattern>${pattern}</pattern>${template}</category>`)
    .join('\n')

const generatePattern = (pattern, template) => generatePatterns([pattern], template)

const generateAiml = ({ version, encoding }, tags) =>
  `<?xml version="1.0" encoding="${encoding}"?>\n<aiml version="${version}">\n${tags.join(
    '\n'
  )}\n</aiml>`

module.exports = {
  aiml: generateAiml,
  template: tags => generateMultipleValueTag('template', {}, tags),
  patterns: generatePatterns,
  pattern: generatePattern,
  choices: choices => generateMultipleValueTag('choices', {}, choices),
  set: (props, value) => generateSingleValueTag('set', props, value),
  srai: value => generateSingleValueTag('srai', {}, value),
  condition: (props, tags) => generateMultipleValueTag('condition', props, tags),
  li: (props, value) => generateSingleValueTag('li', props, value),
  think: tags => generateMultipleValueTag('think', {}, tags)
}
