const { Buyer } = require('./buyer');

describe('Buyer', () => {
    describe('getItems', () => {
        test('should return prices from the specified market', async () => {
            const mockItems = [{ name: 'Item 1', price_history: [{prices: new Map([["SEK", {value: 1, currency: "SEK"}]])}]}];
            const expected = [{ name: 'Item 1', price: {value: 1, currency: "SEK"} }]

            const buyer = new Buyer({
                Item: {
                    find: jest.fn().mockReturnThis(),
                    populate: jest.fn().mockResolvedValue(mockItems.map(item => ({ toObject: () => mockItems[0]}))),
                }
            });


            await expect(buyer.getItems("SEK")).resolves.toEqual(expected);
        });
        test('should return the latest price from the history', async () => {
            const mockItems = [{ name: 'Item 1', price_history: [{prices: new Map([["SEK", {value: 1, currency: "SEK"}]])}, {prices: new Map([["SEK", {value: 100, currency: "SEK"}]])}]}];
            const expected = [{ name: 'Item 1', price: {value: 100, currency: "SEK"} }]

            const buyer = new Buyer({
                Item: {
                    find: jest.fn().mockReturnThis(),
                    populate: jest.fn().mockResolvedValue(mockItems.map(item => ({ toObject: () => mockItems[0]}))),
                }
            });

            await expect(buyer.getItems("SEK")).resolves.toEqual(expected);
        });
        //TODO: add negative test cases
    });
});