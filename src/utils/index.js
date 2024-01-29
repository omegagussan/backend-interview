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
  if (!value || !currency) throw new Error('value and currency is required for conversion')
  const rate = CONVERSION_RATES[currency]?.[toCurrency]
  if (!rate) throw new Error('Non-supported currency')
  return { value: Math.round(value * rate * 100) / 100, currency: toCurrency }
}

const convertAll = (item) => {
  const allPrices = {}
  Object.keys(CONVERSION_RATES).map(currency => {
    if (currency !== item.asking_price.currency){
      allPrices[currency] = convert(currency)(item.asking_price)
    } else {
      allPrices[currency] = item.asking_price
    }
  })
  delete item['asking_price'];
  return {...item, price: allPrices}
}

module.exports = {
  convert,
  convertAll
}
