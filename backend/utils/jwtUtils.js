const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId, userEmail, userName) => {
    return jwt.sign({ _id: userId, email: userEmail, name: userName }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

module.exports = generateToken;
