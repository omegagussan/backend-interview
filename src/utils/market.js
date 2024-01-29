const markets = Object.freeze({
	Denmark: "DENMARK",
	Finland: "FINLAND",
	Sweden: "SWEDEN"
})

const isValid = (market) => {
	return Object.values(markets).includes(market.toUpperCase())
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
	  default:
		throw new Error("Invalid market")
	}
	return target_currency
  }

module.exports = {
  markets, isValid, currencyFromMarket
}