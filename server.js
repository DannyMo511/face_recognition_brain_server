const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

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

// DEBUG
console.log('DEBUG');			
db.select('*').from('users').then(data => console.log(data));

const database = {
	users: [
		{
			id: '123',
			name: 'Kukoo',
			email: 'Kukoo@yahoo.com',
			password: 'qwerty',
			entries: 0,
			joined: new Date()
		},
		{
			id: '222',
			name: 'HowHow',
			email: 'HowHow@yahoo.com',
			password: 'asdf',
			entries: 0,
			joined: new Date()
		}
	]
}


const find_user_id = (id, res, res_value) =>{
	let found = false;
	console.log(res_value);
	database.users.forEach(user => {
		if (user.id === id){
			found = true;
			
			switch(res_value){
				case "": return res.json(user);
				case "entries":
						console.log(user);
						user["entries"]++;
				defualt:
					return res.json(user[res_value]);
			}
		}
	});
	console.log('found', found);
	if (!found){
		res.status(404).json('user not found.');
	}
}

app.get('/', (req,res)=>{
	res.json(database.users);
});

app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password){
		res.json(database.users[0]);
	} else{
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const {name, email, password} = req.body;
	db('users')
		.returning('*')
		.insert({
			name: name,
			email: email,
			joined: new Date()
		})
		.then(user => {
			res.json(user[0]);
		})
		.catch(err => res.status(400).json('unable to register'));
});

app.get("/profile/:id/", (req, res) => {
	const {id} = req.params;
	find_user_id(id, res, "");
})

app.put("/image", (req, res) => {
	const {id} = req.body;
	find_user_id(id, res, "entries");
});

app.listen(3000, () => {
	console.log('Running on port 3000...');
})