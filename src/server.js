const app = require('./app')
require('dotenv').config()

// Set port
const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    console.log(`API available at http://localhost:${PORT}`)
})
