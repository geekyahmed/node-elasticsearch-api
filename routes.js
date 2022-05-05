const express = require('express')
const elastic = require('elasticsearch')
const router = express.Router();

const elasticClient = elastic.Client({
    host: 'localhost:9200'
})

