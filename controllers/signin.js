const validation = require('./validation');

 const handleSignin = (req, res, db, bcrypt) => {
	const {email, password} = req.body;
	if(!validation.validate_signin_fields(email, password)){
		return res.status(400).json('wrong credentials');
	}

	db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {

		bcrypt.compare(password, data[0]['hash']).then(function(isValid) {
			if (isValid){
				return db.select('*').from('users')
				.where('email', '=', email)
				.then(user => res.json(user[0]))
				.catch(err => res.status(400).json('enable to get user'))
			} else {
				res.status(400).json('wrong credentials');			
			}
		});
	})
	.catch(err => res.status(400).json('wrong credentials'));
}

module.exports = {
	handleSignin: handleSignin
}