const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./app/helpers/error-handler.helper');
const jwt1 = require('./app/helpers/jwt.helper');
const app = express();
const cors = require('cors');
const jwt = require('express-jwt');
const expressJwt = require('express-jwt');
const jwtConfig = require('./app/helpers/jwt.helper');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
app.options('*', cors());

//jwtConfig.isRevoked
 //app.use(jwt1.jwt());
 //const secret = jwtConfig.secret;
// const excludeAuth=jwt({
// 	secret,
// 	algorithms: ['HS256', 'RS256']
//   }).unless({ path: ['/users/loginMe',
//   					 '/users/registerMe'] });



// const verifyAuth = (req, res, next) => {
// 	console.log("in verifyyyyyyyyyyyyyyyy")
//   const token = req.headers.authorization?.split(' ')[1];
//   if (token) {
//     verifyJwtToken(token)
//       .then((decoded) => {
//         req.user = decoded;
//         next();
//       })
//       .catch((err) => {
//         res.status(401).json({ message: 'Invalid token' });
//       });
//   } else {
//     res.status(401).json({ message: 'Missing token' });
//   }
// };
  
//app.use(excludeAuth);
//app.use(verifyAuth);

// function getToken(req) {
// 	console.log("in gettokennnnnnnnn")
// 	console.log(req.headers)
//   // check for the first token type
//   const token1 = req.headers['authorization'];
//   if (token1) {
// 	console.log("1111111111111111")
// 	//jwt1.jwt()
// 	return token1;}

//   // check for the second token type
//   const token2 = req.headers['authoriz'];
//   if (token2){ 
// 	console.log("22222222222222222222")
// 	return token2;}

//   // return null if no valid token found
//   return null;
// }

const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');

mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('mongodb is connected!');
});

app.use((req, res, next) => {
	console.log("::::::::::::::::req.body", req.body);
	console.log("::::::::::::::::req.url", req.url);
	next();
})
const userRoute = require('./app/routes/user.route');
app.use('/users', userRoute);

// app.post('/users/registerMe',(req,res) => {

// 	console.log("Hello");

// })

// app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// listen for requests
app.listen(3000, () => {
	console.log("Server is listening on port 3000");
});