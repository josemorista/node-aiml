const generateTemplate = template => {
  let code = ``
  Object.keys(template).forEach(key => {
    if (key !== 'msg') {
      code += `\t\t<${key}>\n\t\t\t${template[key]}\n\t\t</${key}>\n`
    }
  })
  if (template.msg) code += `\t\t${template.msg}`
  return code
}

const generatePatterns = (patterns, template) => {
  let code = ``
  patterns.forEach(pattern => {
    code += `\t\n<category>\n\t<pattern>${pattern.toUpperCase()}</pattern>\n\t<template>\n${generateTemplate(template)}\n\t</template>\n\t</category>\n`
  })
  return code
}

const generatePattern = (pattern, template) => {
  return generatePatterns([pattern], template)
}

const generateChoices = choices => {
  let code = ``
  choices.forEach(choice => {
    code += `<choice><value>${choice}</value></choice>`
  })
  return `\t<choices>${code}</choices>`
}

module.exports = {
  template: generateTemplate,
  patterns: generatePatterns,
  pattern: generatePattern,
  choices: generateChoices
}
