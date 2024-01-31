const { Item } = require('../models');

const get_last = (arr) => {
    return arr.slice(-1)[0];
}
class Buyer {
    constructor(dependencies = {Item}){
        this.Item = dependencies.Item;
    }

    async getItems(currency){
        const mongooseResults = await this.Item.find({}).populate({
            path: 'price_history',
            model: 'RegionalisedPrices',
            populate: {
              path: 'prices',
              model: 'Price'
            }
          })

        //gets the last price from price_history
        // key out the relevant currency from prices!
        return mongooseResults.map(r => r.toObject())
        .map(r => {
            const price = get_last(r.price_history)
            delete r.price_history;
            return {...r, price: price.prices.get(currency)}
        });
    }
}

module.exports = {
    Buyer,
    buyerSingelton: new Buyer()
};