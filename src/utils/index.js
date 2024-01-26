const { Markets } = require("./markets")

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
  let target_currency;
  switch(market.toUpperCase()){
    case Markets.Denmark:
      target_currency = "DKK"
      break;
    case Markets.Sweden:
      target_currency = "SEK"
      break;
    case Markets.Finland:
      target_currency = "EUR"
      break;
  }
  console.error(target_currency)

  return items.map(i => {
    const [value, currency] = i['asking_price'].split(" ");
    if (currency === target_currency) return i;
    const asking_price = convert(target_currency)({value, currency})
    return {...i, 'asking_price': asking_price.value + " " + asking_price.currency}
  });
}

module.exports = {
  convert,
  transform
}