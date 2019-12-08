const doubtsIntents = require('../intents/doubts')
const compulsoryHolidaysEntities = require('../entities/compulsory_holidays')

const Aiml = require('../../node-aiml')

const aiml = new Aiml()

aiml.addIntentsToAction(doubtsIntents, 'type_doubts')

aiml.addAction('type_doubts', [
  {
    entities: compulsoryHolidaysEntities,
    response: 'Período compulsório é o período que antecede o vencimento do 2° período aquisitivo de férias. Então olha só, as férias compulsórias deverão ser gozadas antes do vencimento do 2º período aquisitivo e é prática da BASF enviar 2 e-mails de notificações, um com 120 dias e outro com 90 dias de antecedência. Caso o colaborador não realize a programação dentro de 30 dias após o recebimento da última notificação, o sistema realiza uma programação automática do período de gozo. Dica: melhor ficar sempre de olho e se programar, ok?'
  }
])

module.exports = aiml.compile()
