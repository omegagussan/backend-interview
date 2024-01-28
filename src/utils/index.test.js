/* eslint-env jest */
const { convert, transform, allSet } = require('.')

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
})

describe('setAll', () => {
  test('isTruthy', () => {
    expect(allSet({"a": 1})).toEqual(true);
  })
  test('isTruthy', () => {
    expect(allSet({"b": []})).toEqual(true);
  })
  test('isFalsy', () => {
    expect(allSet({"a": 0})).toEqual(false);
  })
  test('isFalsy', () => {
    expect(allSet({"c": ""})).toEqual(false);
  })
})

describe('transforming items', () => {
  test('to DKK', () => {
    const given = [{ asking_price: '100 SEK', description: 'A very nice button-down shirt', images: [`http://example.jpg`]}]
    const expected = [{ asking_price: '70 DKK', description: 'A very nice button-down shirt', images: [`http://example.jpg`]}]
    expect(transform('Denmark', given)).toEqual(expected)
  })

  test('to EURO', () => {
    const given = [{ asking_price: '100 SEK', description: 'A very nice button-down shirt', images: [`http://example.jpg`]}]
    const expected = [{ asking_price: '10 EUR', description: 'A very nice button-down shirt', images: [`http://example.jpg`]}]
    expect(transform('Finland', given)).toEqual(expected)
  })

  test('to SEK', () => {
    const given = [{ asking_price: '10 EUR', description: 'A very nice button-down shirt', images: [`http://example.jpg`]}]
    const expected = [{ asking_price: '100 SEK', description: 'A very nice button-down shirt', images: [`http://example.jpg`]}]
    expect(transform('Sweden', given)).toEqual(expected)
  })

  test('no transform needed', () => {
    const given = [{ asking_price: '100 SEK', description: 'A very nice button-down shirt', images: [`http://example.jpg`]}]
    expect(transform('Sweden', given)).toEqual(given)
  })

  test('case insensative paths', () => {
    const given = [{ asking_price: '100 SEK', description: 'A very nice button-down shirt', images: [`http://example.jpg`]}]
    expect(transform('SWEDen', given)).toEqual(given)
  })
})