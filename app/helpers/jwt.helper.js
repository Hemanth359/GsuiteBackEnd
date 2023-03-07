const expressJwt = require('express-jwt');
const jwtConfig = require('../../config/jwt.config');
const userService = require('../services/user.service');
const algorithms = ['HS256', 'HS384', 'HS512','RS256'];

let isRevoked = async (req, payload, done) => {
	console.log("!@!@!@!@!@!@!@!@!!!!!!!!!!!!!!!!!!!!!!!!!!!")
	console.log(req.headers)
	const user = await userService.getById(payload.sub);
	console.log(user)
	if (!user) {
		console.log("qweqewewqeqweqwe")
		return done(null, true);
	}
	done();
};

exports.jwt = () => {
	const secret = jwtConfig.secret;
	console.log(secret)
	return expressJwt({ secret, isRevoked, algorithms }).unless({
		path: [
			'/users/loginMe',
			'/users/registerMe',
			'/users',
			'/users/googleUserLogin',
			'/users/getToken',
			'/users/userName/**'
		]
	});
}

