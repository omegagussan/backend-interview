const { Item } = require('../models')

module.exports = (app) => {
  app.get('/items', async (req, res) => {
    const items = await Item.find().exec()
    res.status(200).send(items)
  })
}