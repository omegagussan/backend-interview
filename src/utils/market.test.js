/* eslint-env jest */
const { isValid, currencyFromMarket } = require('./market')

describe('validating market', () => {
  test('Denmark', () => {
    expect(isValid('Denmark')).toEqual(true)
  })

  test('Aruba', () => {
    expect(isValid('Aruba')).toEqual(false)
  })
})

describe('get currency from market', () => {
  test('Denmark', () => {
    expect(currencyFromMarket('Denmark')).toEqual("DKK")
  })

  test('Aruba', () => {
    expect(() => currencyFromMarket('Aruba')).toThrow('Invalid market')
  })
})