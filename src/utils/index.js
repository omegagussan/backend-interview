const { markets, currencyFromMarket } = require("./market")

const CONVERSION_RATES = {
  SEK: {
    EUR: 0.1,
    DKK: 0.7,
  },
  EUR: {
    SEK: 1 / 0.1,
    DKK: 1 / 0.13,
  },
  DKK: {
    SEK: 1 / 0.7,
    EUR: 0.13,
  }
}

const convert = (toCurrency) => ({ value, currency }) => {
  if (!value || !currency) throw new Error('ValidatorError: value and currency is required for conversion')
  const rate = CONVERSION_RATES[currency]?.[toCurrency]
  if (!rate) throw new Error('ValidatorError: Non-supported currency')
  return { value: Math.round(value * rate * 100) / 100, currency: toCurrency }
}

const convertAll = (asking_price) => {
  const allPrices = new Map()
  Object.keys(CONVERSION_RATES).map(currency => {
    if (currency !== asking_price.currency){
      allPrices.set(currency, convert(currency)(asking_price))
    } else {
      allPrices.set(currency, asking_price)
    }
  })
  return allPrices
}

module.exports = {
  convert,
  convertAll
}
