const { Item } = require('../models');

const get_last = (arr) => {
    return arr.slice(-1)[0];
}
class Buyer {
    constructor(dependencies = {Item}){
        this.Item = dependencies.Item;
    }

    async getItems(market){
        const mongooseResults = await this.Item.find({})

        //gets the last price from price_history
        // key out the relevant currency from prices!
        return mongooseResults.map(r => r.toObject())
        .map(r => {
            const price = get_last(r.price_history)
            delete r.price_history;
            return {...r, price: price[market]}
        });
    }
}

module.exports = {
    Buyer,
    buyerSingelton: new Buyer()
};