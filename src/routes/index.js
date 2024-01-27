const { isValid } = require('../utils/market')
const {buyerSingelton} = require('../services/buyer')

module.exports = (app) => {
  //debug purposes. Move to another file?
  app.get('/item', async (req, res) => {
    res.status(200).send(await Item.find({}))
  })

  app.get('/market/:market/item', async (req, res) => {
    try {
        const market = req.params.market;
        if (!isValid(market)) return res.status(400).json({ message: `market ${market} is not valid.` })
        res.status(200).send(await buyerSingelton.getItems(market))
      } catch (error) {
        //TODO: replace with logger framework
        console.error(error)
        return res.status(500).json({ message: "Internal server error." })
    }
  })

}