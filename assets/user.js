// 
// auth: Fadi Mabsaleh <fadimoubassaleh@gmail.com>
// 
// description: user section (register + sign-in) after /api/user/...
// use:     
//          
// 
// 

const router = require('express').Router();
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs'); // encryption
const neo4j = require('neo4j-driver').v1;
const dotenv = require('dotenv'); // env
const jwt = require('jsonwebtoken'); // token

dotenv.config(); // run env variables

// neo4j setup
var driver = neo4j.driver(
    process.env.NEO_BOLT,
    neo4j.auth.basic(process.env.NEO_USERNAME, process.env.NEO_PASSWORD)
)
const session = driver.session()
    // neo4j setup END

// Middleware
app.use(express.json());
// Middleware END

// VALIDATION
const joi = require('@hapi/joi')

const schema = {
    // name: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required()
}

// VALIDATION END

router.post('/register', async(req, res) => {
    // validate body variables
    const { error } = joi.validate(req.body, schema);
    if (error) { return res.status(400).send(error.details[0].message) }
    // validate body variables END
    const email = req.body.email;
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Hash passwords END
    session
        .run('MATCH (user:Person{email: {email}}) RETURN user', { email: email })
        .then(function(result) {
            if (result.records[0]) { return res.status(400).send('Email already exists') }
            session
                .run('CREATE (user:Person {email:{emailParam}, password:{passwordParam}}) RETURN user', { emailParam: email, passwordParam: hashedPassword })
                .then(function() {
                    res.status(200).send("Done registration")
                })
                .catch(function(err) {
                    console.log(err)
                })
        })
        .catch(function(err) {
            console.log(err)
        })
})

router.post('/login', async(req, res) => {
    // Create and assign a token
    const token = jwt.sign({ _id: 'hello' }, process.env.TOKEN_SECRET)
    res.header('auth-token', token)
    res.status(200).send(token)
})

module.exports = router;