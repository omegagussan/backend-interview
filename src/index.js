const express = require('express')
const app = express()
const { Item } = require('./models')
const routes = require('./routes')
const { initiateMongoose, createInitialData } = require('./database')

const PORT = 3000

initiateMongoose()
createInitialData()

app.use(express.json())
app.get('/item', async (req, res) => {
  res.send(await Item.find({}))
})

routes(app)

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
