const express = require('express');
const router = express.Router();
const config = require('../../config/config.json');
const redis = require('redis');
const client = redis.createClient();


/**
 * @swagger
 * /api:
 *  post:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
    res.json({api: config.homepage.url, result: "Hello world"});
});

/**
 * @swagger
 * /api/test:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/token', (req, res) => {
    client.get(config.redisContentPrefix + req.body.username)
        .then(result => {
            console.log("token found.", token);
            return res.status(200).json({status: "success", token: result})
        })
        .catch(err => {
            throw err;
        })
});

module.exports  = router;