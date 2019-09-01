const router = require('express').Router();
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs'); // encryption
const neo4j = require('neo4j-driver').v1;
const dotenv = require('dotenv'); // env

dotenv.config();

// neo4j setup
var driver = neo4j.driver(
    'bolt://localhost',
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
        .run('CREATE (user:Person {email:{emailParam}, password:{passwordParam}}) RETURN user', { emailParam: email, passwordParam: hashedPassword })
        .then(function(result) {
            res.sendStatus(200)
            console.log(result)
            session.close();
            driver.close();
        })
        .catch(function(err) {
            console.log(err)
        })
})

module.exports = router;