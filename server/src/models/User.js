const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    alertsEnabled: {
        type: Boolean,
        default: false
    },
    city: {
        type: String,
        default: null
    },
    minTemp: {
        type: Number,
        default: 0
    },
    maxTemp: {
        type: Number,
        default: 35
    }
});

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = function (pass) {
    return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model('User', UserSchema);