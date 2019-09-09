// 
// auth: Fadi Mabsaleh <fadimoubassaleh@gmail.com>
// 
// description: the main file of the server
// use:     copy .example.env -> change name to .env -> change all the variables
//          
// 
// 

const express = require('express');
const app = express();
const neo4j = require('neo4j-driver').v1;
const userAPI = require('./assets/user'); // import user apis
const dotenv = require('dotenv'); // env

dotenv.config(); // run env variables

// Middleware
app.use(express.json());
//

// neo4j setup
var driver = neo4j.driver(
    process.env.NEO_BOLT,
    neo4j.auth.basic(process.env.NEO_USERNAME, process.env.NEO_PASSWORD)
)
const session = driver.session()
    // 

// test neo4j
app.post('/test', function(req, res) {
        session
            .run('CREATE (user:Person {email:{emailParam}, password:{passwordParam}}) RETURN user', { emailParam: 'ask@fadi.solutions', passwordParam: '1234' })
            .then(function(result) {
                res.status(200).send(result)
                session.close();
                driver.close();
            })
            .catch(function(err) {
                res.status(500).send(err);
                console.log(err)
            })
    })
    // 

// send user APIs request to user API router
app.use('/api/user', userAPI);

// run server (node - express)
// server variables
const port = process.env.SERVER_PORT
    // 
app.listen(port, () => console.log('Express run on port ' + port))
    //