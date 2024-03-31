const jwt = require('jsonwebtoken')

verifyToken({}, {}, function() {
  console.log('Verification done!');
});


// function getUsernameFromToken(verifyToken) {
// 	try {
// 		const decodedToken = jwt.verify(verifyToken, '123')
// 		const username = decodedToken.username
// 		return username
// 	} catch (error) {
// 		console.error('Error decoding JWT token:', error)
// 		return null
// 	}
// }

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cnlvYXJpb2EiLCJpYXQiOjE3MTE4NjI0MjJ9.M1NBrYu964-kaomxN_uOSrFraoL-G8XpmFnfdiSJZMk'
// const userId = getUsernameFromToken(token)
// console.log('User ID from token:', userId)
