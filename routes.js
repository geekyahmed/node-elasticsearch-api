const express = require('express')
const elastic = require('elasticsearch')
const bodyParser = require('body-parser').json()

const router = express.Router();

const elasticClient = elastic.Client({
    host: 'localhost:9200'
})

router.use((req, res, next) => {
    elasticClient.index({
        index: 'logs',
        body: {
            url: req.url,
            method: req.method
        }
    })
        .then(res => {
            console.log('Logs indexed')
        })
        .catch(err => {
            console.log(err)
        })
    next()
})

//Creates a product
router.post('/products', bodyParser, (req, res) => {
    elasticClient.index({
        index: 'products',
        body: req.body
    })
        .then(resp => {
            return res.status(200).json({
                msg: 'Products indexed',
                data: resp
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: 'Error',
                err
            })
        })
})

//Get a product
router.get('/products/:id', bodyParser, (req, res) => {
    let query = {
        index: 'products',
        id: req.params.id
    }
    elasticClient.get(query)
        .then(resp => {
            if (!resp)
                return res.status(404).json({
                    msg: 'Product not found',
                    data: resp
                })
            return res.status(200).json({
                msg: 'Product retrieved',
                data: resp
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: 'Error',
                err
            })
        })
})

module.exports = router