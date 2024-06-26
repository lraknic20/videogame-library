const JwtController = require('../controllers/JwtController');

module.exports = async function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    const tokenKorisnikId = JwtController.decodeToken(token).userType;

    if (tokenKorisnikId != 3) {
        return res.status(401).json({ error: 'Neautoriziran pristup! Nemate odgovarajuće ovlasti!' });
    }
    else {
        next();
    }
};