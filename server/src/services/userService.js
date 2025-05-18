const User = require('../models/User');
const jwt = require('../lib/jwt');

const SECRET = process.env.SECRET;

exports.register = async (email, password, alertsEnabled, city, minTemp, maxTemp) => {
    
    try{
        var existingUser = await User.findOne({email});

        if(existingUser){
            throw new Error('User with this email already exist!');
        }
    
        const user = await User.create({email, password, alertsEnabled, city, minTemp, maxTemp});
    
        const payload = {
            _id: user._id,
            username: user.email
        }
    
        const token = await jwt.sign(payload, SECRET, { expiresIn: '1d'});
        return {
            userId: user._id,
            email: user.email,
            token: token
        };
    }
    catch(error){
        throw new Error(`Register error: ${error.message}`);
    }
}

exports.login = async (email, password) => {
    try{
        var user = await User.findOne({email});

        if(!user){
            throw new Error('Invalid credentials!');
        }
    
        const correctPassword = await user.comparePassword(password);
    
        if(!correctPassword){
            throw new Error('Invalid credentials!');
        }
    
        const payload = {
            _id: user._id,
            username: user.email
        }
    
        const token = await jwt.sign(payload, SECRET, { expiresIn: '1d'});
        return {
            userId: user._id,
            email: user.email,
            token: token
        };
    }
    catch(error){
        throw new Error(`Login error: ${error.message}`);
    }
}

exports.getUsersWithEnabledNotifications = async () => {
    const users = await User.find({
        alertsEnabled: true,
        city: { $nin: [null, ""] }
      });
    return users;
};