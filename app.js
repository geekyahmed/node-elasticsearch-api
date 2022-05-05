const express = require('express')
const app = express()
const routes = require('./routes')

let port = 3000

app.use('/api/v1', routes);

app.listen(port, () => {
    console.log('API running at port' + 3000)
})