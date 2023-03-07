const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../../config/jwt.config');
const User = require('../models/user.model');
const fs = require('fs');
const jwt1 = require('../helpers/jwt.helper');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('222456991365-f3ltlkb9utlauipdaq0shode452uh39i.apps.googleusercontent.com');


exports.login = ({ username, password }) => {
	console.log("hi")
	return new Promise(async (resolve, reject) => {
		console.log("checking for user:")
		const user = await User.findOne({ username });
		console.log("user: ", user)
		if (user && bcrypt.compareSync(password, user.hash)) {
			const { hash, ...userWithoutHash } = user.toObject();
			const token = jwt.sign({ sub: user.id }, jwtConfig.secret);
			// , { algorithm: 'RS256' }
			resolve({ ...userWithoutHash, token });
		}
		console.log("user check failed:")
		resolve({ram: "hello" });
	})
}


exports.getToken = ({ username, password }) => {
	console.log("hi")
	const privateKey = fs.readFileSync('C:/Users/NITHIN REDDY SEELAM/Downloads/pem/pem/private.key');
	console.log("äfter pem")
	return new Promise(async (resolve, reject) => {
		console.log("checking for user:")
		const user = await User.findOne({ username });
		console.log("user: ", user)
		if (user && bcrypt.compareSync(password, user.hash)) {
			const { hash, ...userWithoutHash } = user.toObject();
			//const token = jwt.sign({ sub: user.id }, jwtConfig.secret);

			const token = jwt.sign(username, privateKey, { algorithm: 'RS256' });
			// , { algorithm: 'RS256' }
			console.log(token)
			console.log("token!!!!!!!!!!!!!!!!!1")
			resolve({ ...userWithoutHash, token });
			
		}
		console.log("user check failed:")
		resolve({ram: "hello" });
	})
}



exports.authorizeToken = async (req, res, next) => {
	// Get the token from the request headers
	const publicKey = fs.readFileSync('C:/Users/NITHIN REDDY SEELAM/Downloads/pem/pem/public.key');
	//const token = req.headers.authorization;
	const provider=req.headers.provider;

	if (!req.headers.authorization) {
		return res.status(401).json({ message: 'Missing authorization token' });
	  }
	var parts = req.headers.authorization.split(' ');
	if (parts.length == 2) {
	  var scheme = parts[0];
	  var token = parts[1];
	}

	console.log(token)
	console.log("12212121212121233424224")

	console.log("in authorize token method")
	// Check if token is present
	

	if(1){
		var check=0;
		console.log("ïn ifff")
		const payload= await this.googleUserLogin({"idToken" : token, "client_id" :'222456991365-f3ltlkb9utlauipdaq0shode452uh39i.apps.googleusercontent.com'})
		console.log("payload")
		console.log(payload.email_verified)
		if(payload.email_verified){check=1;next()}
		else{

			jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
				check=1;
				if (err) {
				  return res.status(401).json({ message: 'Invalid authorization token' });
				}
			
				// Set the decoded payload in the request object for later use
				req.user = decoded;
			console.log(req.user)
			  //   // Call the next middleware function
				next();
			  });
			  if(check==0)
			return res.status(401).json({ message: 'Invalid authorization token' });
		}
		
	}
//   else{
// 	console.log("in else")
	
// 	jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
// 	  if (err) {
// 		return res.status(401).json({ message: 'Invalid authorization token' });
// 	  }
  
// 	  // Set the decoded payload in the request object for later use
// 	  req.user = decoded;
//   console.log(req.user)
// 	//   // Call the next middleware function
// 	  next();
// 	});
// }
  }


exports.googleUserLogin=async ({idToken,client_id}) =>{

	console.log(idToken)
	console.log(client_id)
	try{
	const ticket = await client.verifyIdToken({
		idToken: idToken,
		audience:client_id,  // Your client ID here
	  });
	  const payload = ticket.getPayload();
	  //console.log(payload)
	  if(payload.email_verified){
		return payload
	  }
	  return payload;
	}
	catch(error){
		return 0;
	}
}

exports.getAll = async () => {
	return await User.find().select('-hash');
}

exports.getById = async (id) => {
	return await User.findById(id).select('-hash');
}

exports.getByuserName = async (username) => {
	return await User.findOne({ username: username });
}

exports.create = async (userParam) => {
	// validate
	if (await User.findOne({ username: userParam.username })) {
		throw 'Username "' + userParam.username + '" is already taken';
	}
	const user = new User(userParam);
	// hash password
	if (userParam.password) {
		user.hash = bcrypt.hashSync(userParam.password, 10);
	}
	// save user
	await user.save();
}

exports.update = async (id, userParam) => {
	const user = await User.findById(id);
	// validate
	if (!user) throw 'User not found';
	if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
		throw 'Username "' + userParam.username + '" is already taken';
	}
	// hash password if it was entered
	if (userParam.password) {
		userParam.hash = bcrypt.hashSync(userParam.password, 10);
	}
	// copy userParam properties to user
	Object.assign(user, userParam);
	await user.save();
}

exports._delete = async (id) => {
	await User.findByIdAndRemove(id);
}