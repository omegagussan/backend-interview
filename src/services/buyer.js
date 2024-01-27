const { Item } = require('../models');
const { transform } = require('./../utils') //not injected as no point to fake

class Buyer {
    constructor(dependencies = {Item}){
        this.Item = dependencies.Item;
    }

    async getItems(market){
        const mongooseResults = await this.Item.find({})
        const results = mongooseResults.map(r => r.toObject());
        return transform(market, results);
    }
}

module.exports = {
    Buyer,
    buyerSingelton: new Buyer()
};