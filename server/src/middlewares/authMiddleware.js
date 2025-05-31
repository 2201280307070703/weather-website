const jwt = require('../lib/jwt');

const SECRET = process.env.SECRET;

async function verifyToken (req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if(!token){
        return res.status(401).json({msg: 'Missing authorization token!'});
    }

    try{
        const user = await jwt.verify(token, SECRET);
        req.user = user;
        next();
    }
    catch(error){
        res.status(403).json({msg: 'Invalid authorization token provided!'});
    }
}

module.exports = verifyToken