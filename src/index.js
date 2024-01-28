const express = require('express')
const app = express()
const routes = require('./routes')
const swagger = require('./swagger')

const { initiateMongoose, createInitialData } = require('./database')

const PORT = 3000

initiateMongoose()
createInitialData()

app.use(express.json())

routes(app)
swagger(app)


app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
