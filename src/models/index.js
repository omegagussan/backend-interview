const { model } = require('mongoose')

const Item = model('Item', { description: String, images: [String] })

module.exports = {
  Item
}