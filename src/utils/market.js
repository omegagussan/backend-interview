const markets = Object.freeze({
	Denmark: "DENMARK",
	Finland: "FINLAND",
	Sweden: "SWEDEN"
})

const isValid = (market) => {
	return Object.values(markets).includes(market.toUpperCase())
}

module.exports = {
  markets, isValid
}