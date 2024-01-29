const { model, Schema } = require('mongoose')

const priceSchema = new Schema({
  value: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  }
})

const regionalisedPrices = new Schema({
  prices: {
    type: Map,
    of: priceSchema
  }
});

//TODO: required fields here means we can refactor the routes handler
//to catch an exception instead of look before we leap for missing fields!
const itemSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  price_history: {
    type: [regionalisedPrices],
    required: true
  }
})

module.exports = {
  Item: model('Item', itemSchema)
}