const { Item } = require('../models');
const { transform } = require('../utils') //not injected as no point to fake

class Buyer {
    constructor(dependencies = {Item}){
        this.Item = dependencies.Item;
    }

    async getItems(market){
        const mongooseResults = await this.Item.find({})

        //gets the last price from a list of prices
        const results = mongooseResults.map(r => r.toObject()).map(r => ({...r, asking_price: r.asking_price.slice(-1)[0]}));
        const transformed_results = transform(market, results);
        //You should take into account that the price a seller chooses for an item is not necessarily the price that a buyer pays.
        return transformed_results.map(r => {
            delete Object.assign(r, {['price']: r['asking_price'] })['asking_price'];
            return r;
        })
    }
}

module.exports = {
    Buyer,
    buyerSingelton: new Buyer()
};