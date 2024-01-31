/* eslint-env jest */
const { convert, convertAll } = require('.')

describe('correct conversion between currencies', () => {
  test('Unsupported currencies are handled', () => {
    expect(() => convert('NOK')({ value: 10, currency: 'SEK' })).toThrowError('Non-supported currency')
    expect(() => convert('SEK')({ value: 10, currency: 'NOK' })).toThrowError('Non-supported currency')
  })

  test('Converts SEK <-> EUR correct', () => {
    expect(convert('EUR')({ value: 25, currency: 'SEK'})).toEqual({ value: 2.5, currency: 'EUR' })
    expect(convert('SEK')({ value: 2.5, currency: 'EUR'})).toEqual({ value: 25, currency: 'SEK' })
  })
  test('Converts SEK <-> DKK correct', () => {
    expect(convert('DKK')({ value: 25, currency: 'SEK'})).toEqual({ value: 17.5, currency: 'DKK' })
    expect(convert('SEK')({ value: 17.5, currency: 'DKK'})).toEqual({ value: 25, currency: 'SEK' })
  })
  test('Converts EUR <-> DKK correct', () => {
    expect(convert('DKK')({ value: 25, currency: 'EUR'})).toEqual({ value: 192.31, currency: 'DKK' })
    expect(convert('EUR')({ value: 192.31, currency: 'DKK'})).toEqual({ value: 25, currency: 'EUR' })
  })

  test('convertAll', () => {
    const given = { value: 25, currency: 'SEK' }
    const all_prices = new Map([["SEK", { value: 25, currency: 'SEK' }], ["EUR", { value: 2.5, currency: 'EUR' }], ["DKK", { value: 17.5, currency: 'DKK'}]])
    expect(convertAll(given)).toEqual(all_prices)
  })
})