const express = require('express');
const knex = require('./knex/knexfile');
const {app} = require('./routeHandler')


const port = process.env.PORT || 5000;
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