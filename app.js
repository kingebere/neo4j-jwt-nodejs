const express = require('express');
const app = express();
const neo4j = require('neo4j-driver').v1;
const userAPI = require('./routes/user'); // import user apis
// neo4j setup
var driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'password')
)
const session = driver.session()
    // 

// test neo4j
app.get('/test', function(req, res) {
        session
            .run('CREATE (user:Person {email:{emailParam}, password:{passwordParam}}) RETURN user', { emailParam: 'ask@fadi.solutions', passwordParam: '1234' })
            .then(function(result) {
                res.sendStatus(200).json({
                    success: true
                })
                console.log('result')
                session.close();
                driver.close();
            })
            .catch(function(err) {
                console.log(err)
            })
    })
    // 

// send user APIs request to user API router
app.use('/api/user', userAPI);

// run server (node - express)
// server variables
const port = 8080
    // 
app.listen(port, () => console.log('Express run on port ' + port))
    //