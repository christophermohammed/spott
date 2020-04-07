const express = require('express');
const router = new express.Router();
const decrypt = require('../middleware/decrypt');
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// send sms message
router.post('/messages', decrypt, async (req, res) => {
  const { phoneNumber, selectedLocation } = req.body;
  try {
    res.header('Content-Type', 'application/json');
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
      body: `\n
        Google Maps:\n
        ${process.env.GOOGLE_MAPS_LINK + selectedLocation.lat},${selectedLocation.lng}\n
        Apple Maps:\n
        ${process.env.APPLE_MAPS_LINK + selectedLocation.lat},${selectedLocation.lng}`
    });
    res.send(); 
  } catch(err) { 
    console.log(err);
    res.status(400).send();
  }
});

module.exports = router;
