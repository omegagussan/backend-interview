const { Item } = require('../models')
const { transform } = require('../utils')
const { isValid } = require('../utils/market')

module.exports = (app) => {
  //debug purposes. Move to another file?
  app.get('/item', async (req, res) => {
  res.status(200).send(await Item.find({}))
  })

  app.get('/market/:market/item', async (req, res) => {
    try {
      const market = req.params.market;
      if (!isValid(market)) return res.status(400).json({ message: `market ${market} is not valid.` })
      const results = (await Item.find({})).map(r => r.toObject());
      const market_adjusted_results = transform(market, results)
      res.status(200).send(market_adjusted_results)
    } catch (error) {
      //TODO: replace with logger framework
      console.error(error)
      return res.status(500).json({ message: "Internal server error." })
  }
  })

}