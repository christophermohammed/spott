const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv/config');

const userRouter = require('./src/routers/user');
const mediaRouter = require('./src/routers/media');
const locationRouter = require('./src/routers/locations');
const twilioRouter = require('./src/routers/twilio');
const placeRouter = require('./src/routers/places');
const playgroundRouter = require('./src/routers/playground');

const PORT = process.env.PORT || 5000;

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(mediaRouter);
app.use(locationRouter);
app.use(twilioRouter);
app.use(placeRouter);

if (process.env.NODE_ENV !== 'production') {
    app.use(playgroundRouter);
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
