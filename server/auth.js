const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
    try {
      const token = req.header('Authorization');
      if (!token) {
        return res.status(401).send('Access denied. No token provided.');
      }
      const decoded = jwt.decode(token, process.env.your_jwt_secret_key);

      console.log(decoded.user.id);
      req.user = decoded.user.id;
      next();
    } catch (ex) {
      res.status(400).send('Invalid token.');
    }
  }
  
  module.exports = authenticate;
  