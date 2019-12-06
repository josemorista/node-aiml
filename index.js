const fs = require('fs')
const path = require('path')

fs.readdirSync(path.join(__dirname, 'sources', 'aiml')).forEach(file => {
  const src = require('./sources/aiml/' + file)
  fs.writeFileSync(`./results/${file.slice(0, file.length - 3)}.aiml`, src)
})
