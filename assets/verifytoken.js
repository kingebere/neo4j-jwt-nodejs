// 
// auth: Fadi Mabsaleh <fadimoubassaleh@gmail.com>
// 
// description: verify the token from the header
// use:     import the module like "const verify = require('./verifytoken')"
//          add verify in the route like "app.post('/', verify,function(req,res){...})"
// 
// 

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token')
    }
}