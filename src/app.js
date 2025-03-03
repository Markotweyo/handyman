const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { errorHandler, notFound } = require('./middleware/errorHandler')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const serviceRoutes = require('./routes/serviceRoutes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Handyman API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)

app.use(notFound)

app.use(errorHandler)

module.exports = app
