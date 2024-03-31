const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization']
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ')
		const token = bearer[1]
		jwt.verify(token, '123', (err, authData) => {
			if (err) {
				res.status(403).json({ message: 'Forbidden' })
			} else {
				req.authData = authData
				next()
			}
		})
	} else {
		res.status(403).json({ message: 'Forbidden' })
	}
}

//get username
// function getUsernameFromToken(token) {
// 	try {
// 		const decodedToken = jwt.verify(token, '123')
// 		const username = decodedToken.username
// 		return username
// 	} catch (error) {
// 		console.error('Error decoding JWT token:', error)
// 		return null
// 	}
// }

module.exports = {
	verifyToken,
}
