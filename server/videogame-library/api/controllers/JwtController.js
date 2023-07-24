/**
 * JwtController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwt = require('jsonwebtoken');

module.exports = {
  createToken: function (userId, username, userType) {
    const token = jwt.sign({ userId, username, userType }, sails.config.secret, { expiresIn: '1h' });
    
    return token;
  },

  verifyToken: function (token) {
    return jwt.verify(token, sails.config.secret);
  },

  decodeToken: function (token) {
    return jwt.decode(token, sails.config.secret);
  }
};

