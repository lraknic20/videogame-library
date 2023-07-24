const JwtController = require('../controllers/JwtController');

module.exports = async function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    const tokenKorisnikId = JwtController.decodeToken(token).userId;

    if (tokenKorisnikId == 2) {
        return res.status(401).json({ error: 'Neautoriziran pristup!' });
    }
    else {
        next();
    }
};