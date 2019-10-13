const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const app = express();

app.use(body_parser.json());
app.use(cors());


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

const salt_rounds = 10;


app.get('/', (req,res)=>{
	res.json(database.users);
});

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {

		bcrypt.compare(req.body.password, data[0]['hash']).then(function(isValid) {
			if (isValid){
				return db.select('*').from('users')
				.where('email', '=', req.body.email)
				.then(user => res.json(user[0]))
				.catch(err => res.status(400).json('enable to get user'))
			} else {
				res.status(400).json('wrong credentials');			
			}
		});
	})
	.catch(err => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
	const {name, email, password} = req.body;

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
    			console.log('debug, hash is ', hash);
    			return trx('users')
					.returning('*')
					.insert({
						name: name,
						email: email,
						joined: new Date()
					})
					.then(user => {
						console.log('debug, user is ', user);
						res.json(user[0]);
						})
		    		})
	    	.then(trx.commit)
	    	.catch(trx.rollback);
			})
		.catch(err => res.status(400).json('unable to register'));

	})	
});

app.get("/profile/:id/", (req, res) => {
	const {id} = req.params;
	db.select('*').from('users').where({id})
	.then(user => {
		if (user.length){
			res.json(user[0]);
		} else {
			res.json('user not found');
		}

	})
	.catch(err => res.status(400).json('unable to get user data'));
})

app.put("/image", (req, res) => {
	const {id} = req.body;
	db('users').where('id','=',id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries =>{
		if (entries.length){
			res.json(entries[0]);
		} else {
			res.json('user not found');
		}
	})
	.catch(err => res.status(400).json('unable to get entries'))

});

app.listen(3000, () => {
	console.log('Running on port 3000...');
})