const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, salt_rounds)});
app.get("/profile/:id/", (req, res) => {profile.handleProfile(req, res, db)});
app.put("/image", (req, res) => {image.handleImage(req, res, db)});
app.post("/imageurl", (req, res) => {image.handleApiCall(req, res)});


const port = process.env.PORT || 3000; 
app.listen(port, () => {
	console.log(`Running on port ${port}...`);
})