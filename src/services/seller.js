const { Item } = require('../models');
const { convertAll } = require('../utils')

class Seller {
    constructor(dependencies = {Item}){
        this.Item = dependencies.Item;
    }

    async create(item){
        //TODO: cast this error to Valdiation error as the data is not parsable
        const regionalisedPrices = convertAll(item.asking_price);
        const price_history = [{prices: regionalisedPrices}]
        delete item.asking_price;
        return await this.Item.create({...item, price_history})
    }

    async update(id, item){
        const regionalisedPrices = convertAll(item.asking_price);
        item.__v; // ensure, there is no __v in the update object, otherwise it would be editied twice => error
        item.$inc = { __v: 1};

        //read before write to persist history
        const old = await this.Item
        .findOne({_id: id})
        .populate({
            path: 'price_history',
            model: 'RegionalisedPrices',
            populate: {
              path: 'prices',
              model: 'Price'
            }
          });
        item.price_history = [...old.toObject().price_history, {prices: regionalisedPrices}]
        delete item.asking_price;
        //TODO: fix so this returns history as well resolved.
        const updated = await this.Item.findOneAndUpdate({_id: id}, item, {new: true});
        return updated.toObject();
    }

    async priceHistory(id, currency){
        const mongooseResults = await this.Item.findOne({_id: id}).populate({
            path: 'price_history',
            model: 'RegionalisedPrices',
            populate: {
              path: 'prices',
              model: 'Price'
            }
          })
        const pricePoints = mongooseResults.toObject()['price_history']
        return pricePoints.map(p => p.prices.get(currency))
    }
}

module.exports = {
    Seller,
    sellerSingelton: new Seller()
};