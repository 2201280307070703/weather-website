const User = require("../models/User");
const jwt = require('../lib/jwt');
const { SECRET } = require('../constants');

exports.register = async (email, password) => {
    
    var existingUser = await User.findOne({email});

    if(existingUser){
        throw new Error("User with this email already exist!");
    }

    const user = await User.create({email, password});

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

exports.login = async (email, password) => {
    
    var user = await User.findOne({email});

    if(!user){
        throw new Error("Invalid credentials!");
    }

    const correctPassword = await user.comparePassword(password);

    if(!correctPassword){
        throw new Error("Invalid credentials!");
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