const { Item } = require('../models');

class Seller {
    constructor(dependencies = {Item}){
        this.Item = dependencies.Item;
    }

    async create(item){
        return await this.Item.create(item)
    }

    async update(id, item){
        item.__v; // ensure, there is no __v in the update object, otherwise it would be editied twice => error
        item.$inc = { __v: 1};
        const old = await this.Item.findOne({_id: id}) //read before write to persist history
        item.asking_price = [...old.toObject()['asking_price'], item.asking_price]
        return await this.Item.findOneAndUpdate({_id: id}, item, {new: true});
    }

    async priceHistory(id){
        const mongooseResults = await this.Item.findOne({_id: id})
        return mongooseResults.toObject()['asking_price'];
    }
}

module.exports = {
    Seller,
    sellerSingelton: new Seller()
};