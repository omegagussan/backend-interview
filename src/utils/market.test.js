/* eslint-env jest */
const { isValid } = require('./market')

describe('validating market', () => {
  test('Denmark', () => {
    expect(isValid('Denmark')).toEqual(true)
  })

  test('Aruba', () => {
    expect(isValid('Aruba')).toEqual(false)
  })
})