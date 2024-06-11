const knex = require('knex')(require('../config/db')[process.env.NODE_ENV || 'development']);

module.exports = knex;