const { Item } = require('../models')

module.exports = (app) => {
  app.get('/item', async (req, res) => {
  res.status(200).send(await Item.find({}))
  })
}