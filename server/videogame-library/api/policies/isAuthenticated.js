const JwtController = require('../controllers/JwtController');

module.exports = async function (req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Neautoriziran pristup. Potreban je JWT token!' });
	}

	try {
		const decoded = JwtController.verifyToken(token);

		req.user = decoded;

		next();
	} catch (error) {
		return res.status(401).json({ error: 'Neautoriziran pristup. JWT token nije valjan!' });
	}
};