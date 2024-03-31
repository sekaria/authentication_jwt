const express = require('express')
const app = express()
const dbConnect = require('./db_connect')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const host = 'localhost'
const port = 3000
const { verifyToken, getUsernameFromToken } = require('./utils')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//welcome
app.get('/', (req, res) => {
	res.send('Welcome to your todo list!')
})

//register
app.post('/register', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	dbConnect.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
		if (err) {
			console.error(err)
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		if (result.length > 0) {
			return res.status(400).json({ message: 'Username already exists' })
		}

		bcrypt.hash(password, 10, (hashErr, hash) => {
			if (hashErr) {
				console.error(hashErr)
				return res.status(500).json({ message: 'Internal Server Error' })
			}

			dbConnect.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (insertErr, insertResult) => {
				if (insertErr) {
					console.error(insertErr)
					return res.status(500).json({ message: 'Internal Server Error' })
				}

				res.json({
					result: insertResult,
					message: 'User Registered!',
				})
			})
		})
	})
})

//login
app.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	dbConnect.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
		if (err) {
			console.error(err)
			return res.status(500).json({ message: 'Internal Server Error' })
		}
		if (result.length > 0) {
			console.log(result)
			bcrypt.compare(password, result[0].password, (err, response) => {
				if (response) {
					const token = jwt.sign({ username: result[0].username }, '123')
					res.json({ token: token })
				} else {
					res.json({ message: 'Invalid username/password' })
				}
			})
		} else {
			res.json({ message: 'User not found' })
		}
	})
})

//add todolist
app.post('/todolist', verifyToken, (req, res) => {
	const title = req.body.title
	const description = req.body.description
	const done = req.body.done
	if (done !== 0 && done !== 1) {
		return res.status(400).json({ message: 'Invalid value for done. Please provide 0 or 1.' })
	}
	const username = getUsernameFromToken(req.token)
	if (username === null) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	dbConnect.query('INSERT INTO todolists (username, title, description, done) VALUES (?, ?, ?, ?)', [username, title, description, done], (err, result) => {
		if (err) {
			console.error(err)
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		res.json({ message: 'Todolist added' })
	})
})

//show todolist
app.get('/todolist', verifyToken, (req, res) => {
	const username = getUsernameFromToken(req.token)
	if (username === null) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	dbConnect.query('SELECT * FROM todolists WHERE username = ?', [username], (err, result) => {
		if (err) {
			console.error(err)
			return res.status(500).json({ message: 'Internal Server Error' })
		}
		if (result.length === 0) {
			return res.status(200).json({ message: 'No todolist found for the user' })
		}
		res.json(result)
	})
})

//update status done todolist
app.put('/todolist/:id', verifyToken, (req, res) => {
	const todolist_id = req.params.id
	const done = req.body.done
	if (done !== 0 && done !== 1) {
		return res.status(400).json({ message: 'Invalid value for done. Please provide 0 or 1.' })
	}

	const username = getUsernameFromToken(req.token)
	if (username === null) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	dbConnect.query('SELECT * FROM todolists WHERE todolist_id = ? AND username = ?', [todolist_id, username], (selectErr, selectResult) => {
		if (selectErr) {
			console.error(selectErr)
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		if (selectResult.length === 0) {
			return res.status(403).json({ message: 'Forbidden' })
		}

		dbConnect.query('UPDATE todolists SET done = ? WHERE todolist_id = ?', [done, todolist_id], (updateErr, updateResult) => {
			if (updateErr) {
				console.error(updateErr)
				return res.status(500).json({ message: 'Internal Server Error' })
			}
			res.json({ message: 'Todolist updated' })
		})
	})
})

//delete todolist
app.delete('/todolist/:id', verifyToken, (req, res) => {
	const todolist_id = req.params.id
	const username = getUsernameFromToken(req.token)
	if (username === null) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	dbConnect.query('SELECT * FROM todolists WHERE todolist_id = ? AND username = ?', [todolist_id, username], (selectErr, selectResult) => {
		if (selectErr) {
			console.error(selectErr)
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		if (selectResult.length === 0) {
			return res.status(403).json({ message: 'Forbidden' })
		}

		dbConnect.query('DELETE FROM todolists WHERE todolist_id = ?', [todolist_id], (updateErr, updateResult) => {
			if (updateErr) {
				console.error(updateErr)
				return res.status(500).json({ message: 'Internal Server Error' })
			}
			res.json({ message: 'Todolist deleted' })
		})
	})
})

app.listen(port, () => console.log(`API running at ${host}:${port}!`))
