const bcrypt = require('bcryptjs');

const decrypt = (req, res, next) => {
    const hash = req.header('Hash');
    try {
        if(!(bcrypt.compareSync(process.env.SPOTT_APP_SECRET, hash))) {
            return res.status(401).send('You shall not pass');
        }
        next();
    } catch(error) {
        res.status(500).send(error);
    }
}

module.exports = decrypt;
