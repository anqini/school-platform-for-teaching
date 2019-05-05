const config = require('config');
const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send("Access denied. No token provided.");

	try {
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
		if(!decoded.teacher) return res.status(403).send("Access denied. You are not an admin.")
		req.login = decoded;
		next();
	} catch(ex) {
		res.status(400).send('Invalid token.');
	}
}

module.exports = adminAuth;
