const { Item } = require('../models');
const { transform } = require('./../utils') //not injected as no point to fake

class Buyer {
    constructor(dependencies = {Item}){
        this.Item = dependencies.Item;
    }

    async getItems(market){
        const mongooseResults = await this.Item.find({})
        const results = mongooseResults.map(r => r.toObject());
        const transformed_results = transform(market, results);
        //You should take into account that the price a seller chooses for an item is not necessarily the price that a buyer pays.
        //The prices can differ due to e.g. temporary price reductions where the marketplace steps in and pays the seller the difference.
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