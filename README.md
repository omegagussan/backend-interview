# Sellpy backend interview

Welcome to Sellpy's backend interview repo!

## Prerequisites

NodeJS - if you don't already have it installed, check out nvm.

## Getting started

Fork the repository (see top-right button on GitHub) and clone the fork to your computer.

### To start the backend:

- Navigate to the project's root
- Run `npm ci`
- Run `npm start`

We recommend using [Postman](https://www.postman.com/) for calling the API endpoints.

### Development set-up

If you don't have a favorite editor we highly recommend VSCode. We've also had some ESLint rules set up which will help you catch bugs etc. If you're using VSCode, install the regular ESLint plugin and you should be good to go!

To use the correct Node version look at the `engines` properties in the `package.json` file. If you are using nvm just run `nvm use` and the correct version wil be used.

## Assignment

Your assignment is to create a REST API which supports a set of features described as user-stories below. You are provided with a very thin code skeleton written in nodejs with Express as the API framework and an in-memory Mongodb database with Mongoose. It's up to you to create a suitable data structure, set up an appropriate set of API endpoints and anything else that you think is necessary.

The user-stories presented below are the first and most basic features for the marketplace application that you are about to create. They consist of three mandatory ones and two optional extras which you can do if you have time. The application should have two kinds of users: sellers and buyers. Sellers will upload items that the buyers can purchase. The application should handle three different currencies (SEK, EUR, DKK), and all items sold on the marketplace should be for sale in all three currencies at the same time. However, sellers should only handle their items in one currency. You should take into account that the price a seller chooses for an item is not necessarily the price that a buyer pays. The prices can differ due to e.g. temporary price reductions where the marketplace steps in and pays the seller the difference.

### Features / User-stories

#### Mandatory

1. As a seller I want to be able to sell an item for a specified amount and currency, and the item should be put up for sale in all currencies. Functionality for currency conversion already exists in the project.
2. As a seller I want to be able to change the price for a currently selling item.
3. As a buyer I want to be able to see what items are for sale and how much they cost in my currency.

#### Optional

4. As a buyer I want to be able to put an item in my cart. An item can only be in one cart at a time.
5. As a buyer I want to be able to see an overview of my cart (what items are in there, how much they cost and how much my whole cart cost in my local currency)
6. As a seller I want to see the price history of my item.

### Notes

- Your application does not need to handle user accounts. It's OK that all API endpoints are available to everyone
- You can populate the database with some initial data on startup if you want (some items are probably needed to start things off). There is also a script (`npm run drop-db`) if you at any time want to reset the database and start from scratch.


## Solution thoughts.
Tradeoffs for implementing price history now that I know more of the mongoose of the __v field. By default prior version of an object are not persisted. Which makes sense as then no longer would the id field be unique but rather the combination of (version, id) would be what is the index.

Our options are then either keeping a list of prices on the ITEM object, where only the latest is returned by the /market/:market/item endpoint! Easy enough.

The drawback is that when updating we need to perform a read before write to ensure we append to the list of prices when someone submits the new item, rather then just replacing it (maybe slightly missleading for a PUT... technically that more like a PATCH). In general I tend to favor PATCH ahead of PUT as the backend owns more of the state. Any missing fields in the update are not UNSET but rather keep -- which helps keep the frontned thin.

The other option is that every PUT creates a new object under the hood with a new __id field. This will make the query for getting the market/:market/item endpoint more complex. As we need to store the "original created id" in the object and make a filter for it. Once we get all the results, we return the one with the highest __v value.

The benifits of this solution is that we have history for all fields, not just prices. We also get nice metadata from the MongoDB like when it was created etc.

However since ONLY price history is asked for -- and we will create fewer documents in the database. As well that its better to optimize for the serach path instead of the create path (assumption items are serached for more then created) I think the first option is better. Typically a tradeoff discussion to have in a team!

How to implement carts? New "collection" in mongoose where every ITEM knows what cart it belongs to (ensures only one person can have it their cart, return 400 if someone else tries to add it from a old cached view of the webpage). Carts api looks something like GET /cart/ (obs no POST) If there is nothing stored with your user-cookies as token. implicity create one behind the scenes thats empty for that user (server owns state). Overview of item in cart is simply this endpoint. Ensuring that any REMOVAL or additions to cart is handled by also mutating the items involved (this may seem absurt but since only item can be owned by one its ok). Basically this implies there is a PUT /cart only. Deletes are hanleded by putting a smaller list there.

## Interesting projects
https://www.npmjs.com/package/swagger-express-router => generate routes from swagger documentation