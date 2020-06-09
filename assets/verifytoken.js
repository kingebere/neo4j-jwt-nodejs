

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ','');
     console.log(token);
    if (!token) return res.status(401).json({
        success: false,
        message: [
            'Access Denied'
        ]
    });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verified)
        req.user = verified;
        console.log(req.user.email)
        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            message: [
                'Invalid Token'
            ]
        });
    }
}