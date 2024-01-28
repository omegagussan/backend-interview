const { markets } = require("./market")

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

const transform = (market, items) => {
  let target_currency = currencyFromMarket(market)
  return items
  .map(i => {
    if (!target_currency || ! i['asking_price']) return undefined; //invalid from database removed
    const [value, currency] = i['asking_price'].split(" ");
    if (currency === target_currency) return i;
    const asking_price = convert(target_currency)({value, currency})
    return {...i, 'asking_price': asking_price.value + " " + asking_price.currency}
  })
  .filter(i => !!i);
}

const currencyFromMarket = (value) => {
  let target_currency;
  switch (value.toUpperCase()) {
    case markets.Denmark:
      target_currency = "DKK"
      break
    case markets.Sweden:
      target_currency = "SEK"
      break
    case markets.Finland:
      target_currency = "EUR"
      break
  }
  return target_currency
}

const all = (arr, fn = Boolean) => arr.every(fn);

const allSet = (item) => {
  return all(Object.values(item), i => !!i);
}

module.exports = {
  convert,
  transform,
  allSet
}
