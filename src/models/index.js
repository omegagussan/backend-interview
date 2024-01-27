const { model, Schema } = require('mongoose')

const itemSchema = new Schema({
  description: String,
  images: [String],
  asking_price: String
})


module.exports = {
  Item: model('Item', itemSchema)
}