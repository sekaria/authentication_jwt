const mysql = require('mysql')

const dbConnect = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'rahasia',
	database: 'daftar_tugas',
})

dbConnect.connect((err) => {
	if (err) {
		console.error('Error connecting to database: ' + err.stack)
		return
	}
	console.log('Connected to database as id ' + dbConnect.threadId)
})

module.exports = dbConnect
