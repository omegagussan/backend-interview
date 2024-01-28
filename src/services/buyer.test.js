const { transform } = require('../utils');
const { Buyer } = require('./buyer');

describe('Buyer', () => {
    describe('getItems', () => {
        test('should return prices from the specified market', async () => {
            const mockItems = [{ name: 'Item 1', asking_price: ["1 SEK"]}];
            const expected = [{ name: 'Item 1', price: "0.7 DKK" }]

            const buyer = new Buyer({
                    Item: {
                        find: jest.fn().mockResolvedValue([{ toObject: () => mockItems[0] }]),
                    }
                });

            await expect(buyer.getItems("DENMARK")).resolves.toEqual(expected);
        });
        test('should return the latest price from the history', async () => {
            const mockItems = [{ name: 'Item 1', asking_price: ["1 SEK", "100 SEK"] }];
            const expected = [{ name: 'Item 1', price: "70 DKK" }]

            const buyer = new Buyer({
                    Item: {
                        find: jest.fn().mockResolvedValue([{ toObject: () => mockItems[0] }]),
                    }
                });

            await expect(buyer.getItems("DENMARK")).resolves.toEqual(expected);
        });
        test('nothing was found', async () => {

            const buyer = new Buyer({ Item: {
                find: () => []
            }});
            const result = await buyer.getItems("DENMARK");

            expect(result).toEqual([]);
        });
        test('rejected promise', async () => {
            const buyer = new Buyer({ Item: {
                find: () => Promise.reject('No good promise')
            }});
            await expect(buyer.getItems("DENMARK")).rejects.toMatch('No good promise');
        });
    });
});