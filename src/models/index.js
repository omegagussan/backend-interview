const { model, Schema } = require('mongoose')

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
  asking_price: {
    type: [String],
    required: true
  }
})

module.exports = {
  Item: model('Item', itemSchema)
}