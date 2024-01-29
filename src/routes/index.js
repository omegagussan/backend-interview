const { isValid, currencyFromMarket } = require('../utils/market')
const { allSet } = require('../utils')
const {buyerSingelton} = require('../services/buyer')
const {sellerSingelton} = require('../services/seller')
const {Item} = require('../models');

const parseItem = (body) => {
  return {asking_price: body.asking_price || {amount: 0, currency: undefined}, description: body.description || "", images: body.images || []};
};

//TODO: replace console.error() with logger framework
module.exports = (app) => {
/**
 * @swagger
 * /item:
 *   get:
 *     description:  Internal debug endpoint returning raw state from Mongoose. Unpaignated from the database.
 */
  app.get('/item', async (req, res) => {
    res.status(200).send(await Item.find({}))
  })

  /**
   * @swagger
   * /market/{market]/item/{id}/history:
   *   get:
   *     description: Get the price history by id in respective market
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *      - in: path
   *        name: market
   *        schema:
   *          type: string
   *        required: true
   *     responses:
   *          '200':
   *              description: price history by id in desired market
   *              content:
   *                  'application/json':
   *                      schema:
   *                          type: array
   *                          description: list of prices
   *          '40':
   *              description: Bad request
   */

  app.get('/market/:market/item/:id/history', async (req, res) => {
    try {
      const currency = currencyFromMarket(req.params.market)
      res.status(200).send(await sellerSingelton.priceHistory(req.params.id, currency))
    } catch (error) {
      if (error.message == "Invalid market") return res.status(400).json({ message: `market ${req.params.market} is not valid.` })
      console.error(error)
      return res.status(400).json({ message: "Internal server error." })
    }
  })

  app.post('/item', async (req, res) => {
    try {
      const item = parseItem(req.body);
      //if (!allSet(item)) return res.status(400).json({ message: `item is not valid.`, item})
      res.status(200).send(await sellerSingelton.create(item))
    } catch (error) {
      if (!allSet(item)) return res.status(400).json({ message: `item is not valid.`, item})
      console.error(error)
      return res.status(500).json({ message: "Internal server error." })
    }
  })

  app.put('/item/:id', async (req, res) => {
    try {
      const item = parseItem(req.body);
      const id = req.params.id;
      //if (!allSet(item)) return res.status(400).json({ message: `item is not valid.`, item})
      res.status(200).send(await sellerSingelton.update(id, item))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error." })
    }
  })

  app.get('/market/:market/item', async (req, res) => {
    try {
        const currency = currencyFromMarket(req.params.market)
        res.status(200).send(await buyerSingelton.getItems(market))
      } catch (error) {
        if (error.message == "Invalid market") return res.status(400).json({ message: `market ${req.params.market} is not valid.` })
        console.error(error)
        return res.status(500).json({ message: "Internal server error." })
    }
  })

}
