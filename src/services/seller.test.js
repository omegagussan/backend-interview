const { Seller } = require('./seller');

describe('Seller', () => {
    describe('update', () => {
        test('should append a new item to the price history', async () => {
            const mockItem = { name: 'Item 1', asking_price: ["1 SEK"]};
            const mockedReturn = { name: 'Item 1', asking_price: ["1 SEK", "100 SEK"]};
            const given = { name: 'Item 1', asking_price: "100 SEK"};

            const seller = new Seller({
                    Item: {
                        findOne: jest.fn().mockResolvedValue({ toObject: () => mockItem }),
                        findOneAndUpdate: jest.fn().mockResolvedValue({ toObject: () => mockedReturn }),
                    }
                });
            await expect(seller.update("id", given)).resolves.toEqual(mockedReturn);

            //looking at 2nd element, 1st is id, 3rd is "new=true"
            expect(seller.Item.findOneAndUpdate.mock.calls[0][1]).toEqual({...mockedReturn, "$inc": {"__v": 1}});
        });
        //TODO: add both negative tests as well as functionallity to handle if the item does not exist since before
    });

    describe('get price history', () => {
        test('price history', async () => {
            const mockItem = { name: 'Item 1', asking_price: ["1 SEK", "100 EUR"]};

            const seller = new Seller({
                    Item: {
                        findOne: jest.fn().mockResolvedValue({ toObject: () => mockItem }),
                    }
                });
            await expect(seller.priceHistory("id")).resolves.toEqual(mockItem.asking_price);
        });
    });
});