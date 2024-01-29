const { Buyer } = require('./buyer');

describe('Buyer', () => {
    describe('getItems', () => {
        test('should return prices from the specified market', async () => {
            const mockItems = [{ name: 'Item 1', price_history: [{"SEK": {value: 1, currency: "SEK"}}]}];
            const expected = [{ name: 'Item 1', price: {value: 1, currency: "SEK"} }]

            const buyer = new Buyer({
                    Item: {
                        find: jest.fn().mockResolvedValue([{ toObject: () => mockItems[0] }]),
                    },

                });

            await expect(buyer.getItems("SEK")).resolves.toEqual(expected);
        });
        test('should return the latest price from the history', async () => {
            const mockItems = [{ name: 'Item 1', price_history: [{"SEK": {value: 1, currency: "SEK"}}, {"SEK": {value: 100, currency: "SEK"}}]}];
            const expected = [{ name: 'Item 1', price: {value: 100, currency: "SEK"} }]

            const buyer = new Buyer({
                    Item: {
                        find: jest.fn().mockResolvedValue([{ toObject: () => mockItems[0] }]),
                    }
                });

            await expect(buyer.getItems("SEK")).resolves.toEqual(expected);
        });
        test('nothing was found', async () => {

            const buyer = new Buyer({ Item: {
                find: () => []
            }});
            const result = await buyer.getItems("DKK");

            expect(result).toEqual([]);
        });
        test('rejected promise', async () => {
            const buyer = new Buyer({ Item: {
                find: () => Promise.reject('No good promise')
            }});
            await expect(buyer.getItems("DKK")).rejects.toMatch('No good promise');
        });
    });
});