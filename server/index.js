const express = require('express');
const knex = require('knex')(require('./config/db')[process.env.NODE_ENV || 'development']);
const app = express();
const port = process.env.PORT || 3000;


async function checkConnection() {
    try {
      await knex.raw('SELECT 1+1 as result');
      console.log('Connected to the database.');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }
  
checkConnection();


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});