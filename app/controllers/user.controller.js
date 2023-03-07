const Note = require('../models/user.model');
const userService = require('../services/user.service');


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('222456991365-f3ltlkb9utlauipdaq0shode452uh39i.apps.googleusercontent.com');


exports.registerMe = async (req, res,next) => {
	// return res.json("Sucess");

	// const ticket = await client.verifyIdToken({
	// 	idToken: req.body.idToken,
	// 	audience: '222456991365-f3ltlkb9utlauipdaq0shode452uh39i.apps.googleusercontent.com',  // Your client ID here
	//   });
	//   const payload = ticket.getPayload();
	//   console.log("`````````````````````````````````````````")
	//   console.log(payload)


	userService.create(req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

exports.loginMe = async (req, res, next) => {
	try {
		let user = await userService.login(req.body);
		if (user) {
			res.json(user);
		} else {
			res.status(400).json({ message: 'Username or password is incorrect' })
		}
	} catch (error) {
		next(err);
	}
}

exports.getToken = async (req, res, next) => {
	console.log("ïn getToken method")
	try {
		let user = await userService.getToken(req.body);
		if (user) {
			res.json(user);
		} else {
			res.status(400).json({ message: 'Username or password is incorrect' })
		}
	}
	catch (error) {
		next(error);
	}
}

exports.googleUserlogin = async (req, res, next) => {
	try {
		let user = await userService.googleUserLogin(req.body);
		if (user) {
			res.json(user);
		} else {
			res.status(400).json({ message: 'Ivalid login' })
		}
	} catch (error) {
		console.log("in catch!!!!!!!!!!!!!!!!!!")
		console.log(error)
		next(error);
	}
}

exports.getAll = async (req, res, next) => {
	try {
		console.log("12222222222222222")
		let users = await userService.getAll();
		res.json(users);
	} catch (error) {
		next(error)
	}
}

exports.getCurrent = async (req, res, next) => {
	userService.getById(req.user.sub)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

exports.getById = async (req, res, next) => {
	userService.getById(req.params.id)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

exports.getByUserName = async (req, res, next) => {
	userService.getByuserName(req.params.username)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}


exports.update = async (req, res, next) => {
	userService.update(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

exports._delete = async (req, res, next) => {
	userService.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}