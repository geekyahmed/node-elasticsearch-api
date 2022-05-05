const express = require('express')
const elastic = require('elasticsearch')
const bodyParser = require('body-parser').json()
const products = require('./product')

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

//Get all product
router.get('/products', bodyParser, (req, res) => {
    let query = {
        index: 'products'
    }
    elasticClient.search(query)
        .then(resp => {
            if (!resp)
                return res.status(404).json({
                    msg: 'Product not found',
                    data: resp
                })
            return res.status(200).json({
                msg: 'Products retrieved',
                data: resp.hits.hits
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: 'Error',
                err
            })
        })
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

// Updates a product
router.put('/products/:id', bodyParser, (req, res) => {
    let query = {
        index: 'products',
        id: req.params.id,
        body: {
            doc: req.body
        }
    }
    elasticClient.update(query)
        .then(resp => {
            if (!resp)
                return res.status(404).json({
                    msg: 'Product not found',
                    data: resp
                })
            return res.status(200).json({
                msg: 'Product updated',
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

//delete a product
router.delete('/products/:id', bodyParser, (req, res) => {
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
                msg: 'Product deleted',
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