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
    // 

// Middleware
app.use(express.json());
//

router.post('/register', async(req, res) => {
    const email = req.body.email;
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // 
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