const express = require('express')
const app = express()
const dbConnect = require('./db_connect')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const host = 'localhost'
const port = 3000

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
		if (err) throw err
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

//verify token
function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization']
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ')
		const token = bearer[1]
		req.token = token
		next()
	} else {
		res.sendStatus(403)
	}
}

//get username
function getUsernameFromToken() {
	try {
		const decodedToken = jwt.verify(verifyToken(), '123')
		const username = decodedToken.username
		return username
	} catch (error) {
		console.error('Error decoding JWT token:', error)
		return null
	}
}

//get id_user
function getId() {
	const username = getUsernameFromToken()
	if (!username) {
		return res.status(401).json({ message: 'Unauthorized' })
	}
	dbConnect.query('SELECT id_user FROM users WHERE username = ?', [username], (err, result) => {
		if (err) {
			console.error(err)
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		if (result.length === 0) {
			return res.status(404).json({ message: 'User not found' })
		}

		const id_user = result[0].id_user
		return id_user
	})
}

//add todolist
app.post('/todolist', verifyToken, (req, res) => {
	const title = req.body.title
	const description = req.body.description
	const done = req.body.done
	const id_user = getId()

	dbConnect.query('INSERT INTO todolists (id_user, title, description, done) VALUES (?, ?, ?, ?)', [id_user, title, description, done], (err, result) => {
		if (err) {
			console.error(err)
			return res.status(500).json({ message: 'Internal Server Error' })
		}

		res.json({ message: 'Todolist added' })
	})
})

//todolist
app.get('/todolist', verifyToken, (req, res) => {
	dbConnect.query('SELECT * FROM todolists', (err, result) => {
		if (err) throw err
		res.json(result)
	})
})

app.put('todolist/:id', verifyToken, (req, res) => {
	const todolist_id = req.params.id
	const todolist_name = req.body.todolist
	dbConnect.query('UPDATE todolists SET todolist_name = ? WHERE todolist_id = ?', [todolist_name, todolist_id], (err, result) => {
		if (err) throw err
		res.json({ message: 'Todolist updated' })
	})
})

app.delete('/todolist/:id', verifyToken, (req, res) => {
	const todolist_id = req.params.id
	dbConnect.query('DELETE FROM todolists WHERE todolist_id = ?', [todolist_id], (err, result) => {
		if (err) throw err
		res.json({ message: 'Todolist deleted' })
	})
})

app.listen(port, () => console.log(`API running at ${host}:${port}!`))
