const { Item } = require('../models');
const { convertAll } = require('../utils')

class Seller {
    constructor(dependencies = {Item}){
        this.Item = dependencies.Item;
    }

    async create(item){
        const saveableItem = convertAll(item);
        const price_history = [saveableItem.price]
        delete saveableItem.price;
        return await this.Item.create({...saveableItem, price_history})
    }

    async update(id, item){
        const saveableItem = convertAll(item);
        saveableItem.__v; // ensure, there is no __v in the update object, otherwise it would be editied twice => error
        saveableItem.$inc = { __v: 1};
        const findOne = await this.Item.findOne({_id: id}) //read before write to persist history
        const old = findOne.toObject();
        saveableItem.price_history = [...old.price_history, saveableItem.price]
        delete saveableItem.price;
        const updated = await this.Item.findOneAndUpdate({_id: id}, saveableItem, {new: true});
        return updated.toObject();
    }

    async priceHistory(id, currency){
        const mongooseResults = await this.Item.findOne({_id: id})
        const pricePoints = mongooseResults.toObject()['price_history']
        return pricePoints.map(p => p[currency])
    }
}

module.exports = {
    Seller,
    sellerSingelton: new Seller()
};