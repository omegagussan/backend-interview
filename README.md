# Sellpy backend interview

Welcome to Sellpy's backend interview repo!

## Assignment

Your assignment is to create a REST API which supports a set of features described as user-stories below. You are provided with a very thin code skeleton written in nodejs with Express as the API framework and an in-memory Mongodb database with Mongoose. It's up to you to create a suiting data structure, set up a appropriate set of API endpoints and anything else that you think is necessary.

### Features / User-stories

- As a seller I want to be able to sell an item for a specified amount in my local currency.
- As a buyer I want to be able to see what items are for sale and how much they cost in my local currency.

#### Extra 
- As a seller I want to be able to change the price for a currently selling item.
- As a buyer I want to be able to reserve an item by putting it in my cart. An item can only exist in one cart at a time. 
- As a buyer I want to be able to see an overview of my cart (what items are in there, how much they cost and how much my whole cart cost in my local currency)

### Notes

- You can populate the database with some initial data on startup if you want (some items are probably needed to start things off).
- You should take into account that the amount a seller's item is on sale for and the amount the buyer pays is not necessarily the same. They could differ because of eg. promo codes or temporary lowered prices where the marketplace steps in and pays the seller the difference.
- Use simple (probably hard-coded) currency exchange rates.
- Your application does not need to handle users accounts. It's okey that all API endpoints are available to everyone

