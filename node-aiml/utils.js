const cardinals = {
  0: 'zero',
  1: 'um',
  2: 'dois',
  3: 'três',
  4: 'quatro',
  5: 'cinco',
  6: 'seis',
  7: 'sete',
  8: 'oito',
  9: 'nove',
  10: 'dez',
  11: 'onze',
  12: 'doze',
  13: 'treze',
  14: 'quatorze',
  15: 'quinze',
  16: 'dezesseis',
  17: 'dezessete',
  18: 'dezoito',
  19: 'dezenove',
  20: 'vinte',
  30: 'trinta',
  40: 'quarenta',
  50: 'cinquenta',
  60: 'sessenta',
  70: 'setenta',
  80: 'oitenta',
  90: 'noventa',
  100: 'cem',
  200: 'duzentos',
  300: 'trezentos',
  400: 'quatrocentos',
  500: 'quinhentos',
  600: 'seicentos',
  700: 'setecentos',
  800: 'oitocentos',
  900: 'novecentos',
  1000: 'mil'
}

const ordinals = {
  1: 'primeiro',
  2: 'segundo',
  3: 'terceiro',
  4: 'quarto',
  5: 'quinto',
  6: 'sexto',
  7: 'sétimo',
  8: 'oitavo',
  9: 'nono',
  10: 'décimo',
  20: 'vigésimo',
  30: 'trigésimo',
  40: 'quadragésimo',
  50: 'quinquagésimo',
  60: 'sexagésimo',
  70: 'septuagésimo',
  80: 'oitagésimo',
  90: 'nonagésimo',
  100: 'centésimo',
  1000: 'milésimo'
}

const getCardinal = str => {
  if (str.length === 1) return cardinals[str] || null

  let deg = Math.pow(10, str.length - 1)
  let aprox = parseInt(str[0]) * deg

  let process = parseInt(str) % deg
  process = String(process)

  if (str.length <= 4) {
    return `${cardinals[aprox]}${process === '0' ? '' : ` e ` + getCardinal(process)}`
  }

  return null
}

const getOrdinal = str => {
  if (str.length === 1) return ordinals[str] || null

  let deg = Math.pow(10, str.length - 1)
  let aprox = parseInt(str[0]) * deg

  let process = parseInt(str) % deg
  process = String(process)

  if (str.length <= 4) {
    return `${ordinals[aprox]}${process === '0' ? '' : ` ` + getOrdinal(process)}`
  }

  return null
}

module.exports = {
  cardinal: getCardinal,
  ordinal: getOrdinal
}
