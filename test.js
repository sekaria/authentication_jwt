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