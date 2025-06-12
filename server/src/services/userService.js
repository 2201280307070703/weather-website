const User = require('../models/User');
const jwt = require('../lib/jwt');

const SECRET = process.env.SECRET;

exports.register = async (email, password) => {
    
    try{
        var existingUser = await User.findOne({email});

        if(existingUser){
            throw new Error('User with this email already exist!');
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
        throw new Error(`Register error: ${error.message}`);
    }
};

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
        throw new Error(`Error getting users with enabled notifications: ${error.message}`);
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
        throw new Error(`Error getting users with enabled notifications: ${error.message}`);
    }
};

exports.getUserInfo = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    }
    catch (error) {
        throw new Error(`Error getting user by user id: ${error.message}`);
    }
};

exports.updateUserInfo = async (userId, updatedData) => {
    if (updatedData.recommendationsEnabled && !updatedData.city.trim()) {
        throw new Error('To receive weekend recommendations, please select a city!');
    }

    if (updatedData.alertsEnabled && (!updatedData.city.trim() || !updatedData.maxTemp && !updatedData.minTemp)) {
        throw new Error('To receive critical weather alerts, please select a city and set both maximum and minimum temperatures!');
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('This user does not exist!');
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
        throw new Error(`An error occurred when updating the user's data: ${error.message}`);
    }
}