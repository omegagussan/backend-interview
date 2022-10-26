const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const crypto = require('crypto')
const { Item } = require('./models')
const routes = require('./routes')

const PORT = 3000

const initiateDb = async () => {
  const mongod = await MongoMemoryServer.create()

  const uri = mongod.getUri()
  await mongoose.connect(uri, { dbName: 'DemoDB' })
  console.log('Connected to db', uri)
  await createInitialData()
}

const createInitialData = async () => {

  const shirt = new Item({ description: 'A very nice button-down shirt', images: [`http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`, `http://example.image-${crypto.randomBytes(4).toString('hex')}.jpg`] })
  await shirt.save()
  console.log('Finished creating initial data')
}

initiateDb()

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World')
})

routes(app)

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
