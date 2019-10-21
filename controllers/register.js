const validation = require('./validation');

const handleRegister = (req, res, db, bcrypt, salt_rounds) => {
	const {name, email, password} = req.body;
	if(!validation.validate_register_fields(name, email, password)){
		return res.status(400).json('unable to register');
	}
	
	bcrypt.hash(password, salt_rounds)
	.then(function(hash) {
    	db.transaction(trx => {
    		// Insert the hash to the 'login' table
    		trx.insert({
    			hash: hash,
    			email: email
    		})
    		.into('login')
    		// Insert the user data to the 'users' table
    		.then(() =>{
    			return trx('users')
					.returning('*')
					.insert({
						name: name,
						email: email,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
						})
		    		})
	    	.then(trx.commit)
	    	.catch(trx.rollback);
			})
		.catch(err => res.status(400).json('unable to register'));

	})	
}

module.exports = {
	handleRegister: handleRegister
}