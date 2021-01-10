const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('../../config/config.json')
const jwt = require('jsonwebtoken');
const https = require('http');
const passport = require('passport');
const redis = require("redis");
const client = redis.createClient();
const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');
const mysql = require('mysql');

const Worker = require('../../models/Worker');

const db = mysql.createConnection(config.dbConnection);

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log("MySQL Connected");
})

/**
 * @swagger
 * /worker:
 *  post:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/", (req, res) => {
    Worker.find()
        .then(items => res.json(items));
});

router.post('/login', (req, res) => {
    // const {errors, isValid} = validateLoginInput(req.body);

    // if(!isValid) {
    //     return res.status(400).json(errors);
    // }

    const errors = {};

    const username = req.body.username;
    const password = req.body.password;

    let sql = "SELECT * FROM user WHERE username = ? LIMIT 1";

    let query = db.query(sql, username, function(err, user) {
        if(err) throw err;
        if(user.length === 0) {
            errors.message = "Username or password not matched";
            return res.status(404).json(errors);
        }
        user = user[0];
        
        console.log(user);

        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch) {
                    const payload = {
                        id: user.id,
                        lastname: user.lastname,
                        firstname: user.firstname,
                    }
                    jwt.sign(payload, 'secret', {
                        expiresIn: 3600
                    }, (err, token) => {
                        if(err) console.error('There is some error in token', err);
                        else {
                            client.set(config.redisContentPrefix + user.username, token, redis.print);
                            client.get(config.redisContentPrefix + user.username, redis.print)
                            
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        }
                    })
                } else {
                    errors.message = "Username or password not matched"
                    return res.status(404).json(errors);
                }
            })
        
    })
    
    // Worker.findOne({username})
    //     .then(user => {
    //         if(!user) {
    //             errors.username = "Username or password not matched"
    //             return res.status(404).json(errors);
    //         }
    //         bcrypt.compare(password, user.password)
    //             .then(isMatch => {
    //                 if(isMatch) {
    //                     const payload = {
    //                         id: user.id,
    //                         lastname: user.lastname,
    //                         firstname: user.firstname,
    //                     }
    //                     jwt.sign(payload, 'secret', {
    //                         expiresIn: 3600
    //                     }, (err, token) => {
    //                         if(err) console.error('There is some error in token', err);
    //                         else {
    //                             res.json({
    //                                 success: true,
    //                                 token: `Bearer ${token}`
    //                             });
    //                         }
    //                     })
    //                 } else {
    //                     errors.username = "Username or password not matched"
    //                     return res.status(404).json(errors);
    //                 }
    //             })

    //     })
});

router.post('/register', (req, res) => {
    // const { errors, isValid } = validateRegisterInput(req.body);

    // if(!isValid) {
    //     return res.status(400).json(errors);
    // }

    // if(user) {
    //     return res.status(400).json({
    //         username: 'Username is exists'
    //     });
    // }
    // else {
        console.log("req.body", req.body);
        const newUser = {
            lastname : req.body.lastname,
            firstname : req.body.firstname,
            username : req.body.username,
            password : req.body.password,
            create_date: new Date()
        };
        
        bcrypt.genSalt(config.salt, (err, salt) => {
            if(err) console.error('There was an error', err);
            else {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) console.error('There was an error', err);
                    else {
                        newUser.password = hash;
                        let sql = 'INSERT INTO user SET ?';
                        let query = db.query(sql, newUser, err => {
                            if(err) {
                                throw err;
                            }
                            let options = {
                                host: config.microservice.host,
                                port: config.microservice.port,
                                path: "/api",
                                // headers: {
                                //     Authorization:
                                //     "Basic " + Buffer("developer:Password1").toString("base64"),
                                // },
                            };
                            https.get(options, function(resp) {
                                if(resp.statusCode == 200) {
                                    resp.on("data", (d) => {
                                        console.log("data: ", JSON.parse(d));
                                        res.send(JSON.parse(d));
                                    })
                                }
                            })
                            
                        })
                    }
                });
            }
        });
    // }
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name
    });
});

module.exports = router;