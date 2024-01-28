const { isValid } = require('../utils/market')
const { allSet } = require('../utils')
const {buyerSingelton} = require('../services/buyer')
const {sellerSingelton} = require('../services/seller')
const {Item} = require('../models');

const parseItem = (body) => {
  return {asking_price: body.asking_price || "", description: body.description || "", images: body.images || []};
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
   * /item/{id}/history:
   *   get:
   *     description:  Get the price history by id
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *     responses:
   *          '200':
   *              description: history!
   *              content:
   *                  'application/json':
   *                      schema:
   *                          type: array
   *                          description: list of prices
   *          '403':
   *              description: Not enough permissions
   */

  app.get('/item/:id/history', async (req, res) => {
    res.status(200).send(await sellerSingelton.priceHistory(req.params.id))
  })

  app.post('/item', async (req, res) => {
    try {
      const item = parseItem(req.body);
      if (!allSet(item)) return res.status(400).json({ message: `item is not valid.`, item})
      res.status(200).send(await sellerSingelton.create(item))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error." })
    }
  })

  app.put('/item/:id', async (req, res) => {
    try {
      const item = parseItem(req.body);
      const id = req.params.id;
      if (!allSet(item)) return res.status(400).json({ message: `item is not valid.`, item})
      res.status(200).send(await sellerSingelton.update(id, item))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error." })
    }
  })

  app.get('/market/:market/item', async (req, res) => {
    try {
        const market = req.params.market;
        if (!isValid(market)) return res.status(400).json({ message: `market ${market} is not valid.` })
        res.status(200).send(await buyerSingelton.getItems(market))
      } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error." })
    }
  })

}
