const express = require('express');
const router = new express.Router();
const axios = require('axios').default;
const decrypt = require('../middleware/decrypt');

// send sms message
router.get('/places', decrypt, async (req, res) => {
  try {
    const { query } = req.query;
    const formattedQuery = query.trim().replace(/ /g, '+');
    const { GOOGLE_MAPS_GEOCODE_API, GOOGLE_MAPS_API_KEY } = process.env;
    const url = GOOGLE_MAPS_GEOCODE_API + GOOGLE_MAPS_API_KEY + '&address=' + formattedQuery;
    const response = await axios.get(url);
    res.send(response.data.results);
  } catch(err) { 
    console.log(err);
    res.status(400).send();
  }
});

module.exports = router;
