const User = require('../models/User');
const jwt = require('../lib/jwt');

const SECRET = process.env.SECRET;

exports.register = async (email, password) => {
    
    try{
        var existingUser = await User.findOne({email});

        if(existingUser){
            throw new Error('Вече има съществуващ акаунт с този имейл.');
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
    catch(error){
        throw new Error(`Грешка при регистриране: ${error.message}`);
    }
};

exports.login = async (email, password) => {
    try{
        var user = await User.findOne({email});

        if(!user){
            throw new Error('Невалиден имейл или парола.');
        }
    
        const correctPassword = await user.comparePassword(password);
    
        if(!correctPassword){
            throw new Error('Невалиден имейл или парола.');
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
        throw new Error(`Грешка при влизане: ${error.message}`);
    }
};

exports.getUsersWithEnabledNotifications = async () => {
    try {
        const users = await User.find({
            alertsEnabled: true,
            city: { $nin: [null, ""] },
            minTemp: { $ne: null },
            maxTemp: { $ne: null }
        });
        return users;
    }
    catch (error) {
        throw new Error(error.message);
    }
};

exports.getUsersWithEnabledRecommendations = async () => {
    try {
        const users = await User.find({
            recommendationsEnabled: true,
            city: { $nin: [null, ""] }
        });
        return users;
    }
    catch (error) {
        throw new Error(error.message);
    }
};

exports.getUserInfo = async (userId) => {
    try {
        console.log(userId);
        
        const user = await User.findById(userId);
        return user;
    }
    catch (error) {
        throw new Error(error.message);
    }
};

exports.updateUserInfo = async (userId, updatedData) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('Такъв потребител не съществува.');
        }

        user.email = updatedData.email;
        user.password = updatedData.password;
        user.alertsEnabled = updatedData.alertsEnabled;
        user.recommendationsEnabled = updatedData.recommendationsEnabled;
        user.city = updatedData.city;
        user.maxTemp = updatedData.maxTemp;
        user.minTemp = updatedData.minTemp;
        await user.save();

        return user;
    }
    catch (error) {
        throw new Error(`Грешка при редактиране на потребителските данни: ${error.message}`);
    }
}