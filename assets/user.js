
const router = require('express').Router();
const bcrypt = require('bcryptjs'); // encryption
const neo4j = require('neo4j-driver');
const dotenv = require('dotenv'); // env
const jwt = require('jsonwebtoken'); // token

dotenv.config(); // run env variables

// neo4j setup
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic(process.env.NEO_USERNAME,process.env.NEO_PASSWORD))
var session =driver.session({database:process.env.NEO_DATABASE,defaultAccessMode:neo4j.session.WRITE})
const verify = require('./verifytoken')

    // neo4j setup END

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
    if (error) {
        return res.status(400).json({
            success: false,
            message: [
                error.details[0].message
            ]
        })
    }
    // validate body variables END
    const email = req.body.email;
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Hash passwords END
    session
        .run('MATCH (usery:Personi{email: $email}) RETURN usery', { email: email })
        .then(function(result) {
            if (result.records[0]) { return res.status(400).send('Email already exists') } // check if email exist
            session
                .run('CREATE (usery:Personi {email:$email, password:$password}) RETURN usery', { email: email, password: hashedPassword })
                .then(function() {
                    res.status(200).json({
                        success: true,
                        message: [
                            'Done Registration.'
                        ]
                    })
                })
                .catch(function(err) {
                    res.status(500).json({
                        success: false,
                        message: [
                            err
                        ]
                    })
                    console.log(err)
                })
        })
        .catch(function(err) {
            res.status(500).json({
                success: false,
                message: [
                    err
                ]
            })
            console.log(err)
        })
})
router.post('/accept', verify,(req,res)=>{
session.run('create(nodee:jeez{namey:$namey,grade:$grade}) return nodee',{namey:'dike goodluck',grade:req.user.email})
.then((result) => {       
    res.send(result)
    console.log('result')
  }).catch((err) => {
    res.status(400).send(err)
  });
  });
  


router.post('/login', async(req, res) => {
    // validate body variables
    const { error } = joi.validate(req.body, schema);
    if (error) { return res.status(400).send(error.details[0].message) }
    // get the email from body
    const email = req.body.email
        // let userDetails = []
    session
        .run('MATCH (usery:Personi{email: $email}) RETURN usery', { email: email })
        .then(async(result) => {
            // check if email not exist
            if (!result.records[0]) {
                return res.status(400).json({
                    success: false,
                    message: [
                        'User not exist.'
                    ]
                })
            }
            // password is correct
            const validPass = await bcrypt.compare(req.body.password, result.records[0]._fields[0].properties.password)
            if (!validPass) {
                return res.status(400).json({
                    success: false,
                    message: [
                        'Invalid password.'
                    ]
                })
            }

            // Create and assign a token
            const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET)
            res.header('auth-token', token)
            res.status(200).json({
                success: true,
                message: [
                    'Login success.'
                ]
            })
        })
        .catch(function(err) {
            res.status(500).json({
                success: false,
                message: [
                    err
                ]
            })
            console.log(err)
        })
})

module.exports = router;