const { Seller } = require('./seller');

describe('Seller', () => {
    describe('create', () => {
        test('should create an item with price history', async () => {
            const expected = {
                name: 'Item 1',
                price_history: [
                    {   prices : new Map([
                        ["SEK", {value: 1, currency: "SEK"}],
                        ["DKK", {value: 0.7, currency: "DKK"}],
                        ["EUR", {value: 0.1, currency: "EUR"}]
                        ])
                    }
                ]
            };
            const given = { name: 'Item 1', asking_price: {value: 1, currency: "SEK"}};

            const seller = new Seller({
                Item: {
                    create: jest.fn().mockResolvedValue(expected),
                }
            });
            await expect(seller.create(given)).resolves.toEqual(expected);

            expect(seller.Item.create.mock.calls[0][0]).toEqual(expected);
        });
        //TODO: negative tests here
    });
    describe('update', () => {
        test('should append a new item to the price history', async () => {
            const oldItem = { name: 'Item 1', price_history: [{SEK: {value: 1, currency: "SEK"}}]};
            const mockedReturn = {
                name: 'Item 1',
                price_history: [
                    {SEK: {value: 1, currency: "SEK"}},
                    {
                        SEK: {value: 100, currency: "SEK"},
                        DKK: {value: 70, currency: "DKK"},
                        EUR: {value: 10, currency: "EUR"}
                    }
                ]
            };
            const given = { name: 'Item 1', asking_price: {value: 100, currency: "SEK"}};

            const seller = new Seller({
                Item: {
                    findOne: jest.fn().mockResolvedValue({ toObject: () => oldItem }),
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
        test('price history gets prices by currency', async () => {
            const mockItem = { name: 'Item 1', price_history: [
                {SEK: {value: 1, currency: "SEK"}, DKK: {}},
                {SEK: {value: 100, currency: "SEK"}, DKK: {}}
            ]};

            const seller = new Seller({
                    Item: {
                        findOne: jest.fn().mockResolvedValue({ toObject: () => mockItem }),
                    }
                });
            await expect(seller.priceHistory("id", "SEK")).resolves.toEqual(mockItem.price_history.map(p => p["SEK"]));
        });
    });
});