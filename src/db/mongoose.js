const mongoose = require('mongoose');
const { port, host, dbName } = require('./config');

const mongoUrl = process.env.MONGO_URL || `mongodb://${host}:${port}/${dbName}`;

mongoose.set('useUnifiedTopology', true);

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});
