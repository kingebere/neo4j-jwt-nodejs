// 
// auth: Fadi Mabsaleh <fadimoubassaleh@gmail.com>
// 
// description: the main file of the server
// use:     copy .example.env -> change name to .env -> change all the variables
//          
// 
// 

const express = require('express');

var neo4j = require('neo4j-driver');
const userAPI = require('./assets/user'); // import user apis
const dotenv = require('dotenv'); // env
const app = express();
dotenv.config(); // run env variables

// Middleware
app.use(express.json());
//

// neo4j setup

var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic(process.env.NEO_USERNAME,process.env.NEO_PASSWORD))
var session =driver.session({database:process.env.NEO_DATABASE,defaultAccessMode:neo4j.session.WRITE})


// test neo4j
app.post('/test', function(req, res) {
        session.run('CREATE(name:Persony {email:$email, password:$password}) RETURN name ', { email: 'gudoskui@gmail.com', password: 'edjffikvj' })
        .then((result) => {       
            res.send(result)
            console.log('result')
          }).catch((err) => {
            res.status(400).send(err)
          });
          });
     

// send user APIs request to user API router

app.use(userAPI);

// run server (node - express)
// server variables
const port = process.env.PORT || 6000;
    // 
app.listen(port, () => console.log('Express run on port ' + port))
    //