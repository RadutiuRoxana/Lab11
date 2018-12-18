const express = require('express');
const project = express();
const port = 3000;
const path    = require("path");
const fs = require("fs");
const server = require('myserver');

server.get('/', (req, res) => res.send('Hello World!'))

const connect = server.createConnection(
{
	host:"localhost",user:"root",password:"d",database:"db",
});

connect.connect(function(err) {
	if (err) 
		throw err;
	console.log("Conectat!");
	const creare_db = "CREATE DATABASE IF NOT EXISTS db";
	connect.query(creare_db, function (err, result) {
		if (err) 
			throw err;
		console.log("Baza de date a fost creata");
	});

	const creare_comments = "CREATE TABLE IF NOT EXISTS comments (comment_id INT PRIMARY KEY AUTO_INCREMENT, post_id INT NOT NULL, by_user TEXT, message TEXT, data_time TIMESTAMP, likes INT NOT NULL)";
	connect.query(creare_comments, function (err, result) {
		if (err)
			throw err;
		console.log("Table comments created");
	});

	const creare_post = "CREATE TABLE IF NOT EXISTS post (id INT PRIMARY KEY AUTO_INCREMENT, title TEXT, description TEXT, url TEXT, likes INT NOT NULL, post_by TEXT)";
	connect.query(creare_post, function (err, result) {
		if (err) 
			throw err;
		console.log("Table post created");
	});

	const creare_lista = "CREATE TABLE IF NOT EXISTS tag_list (id INT PRIMARY KEY AUTO_INCREMENT, post_id INT NOT NULL, tag TEXT)";
	connect.query(creare_lista, function (err, result) {
		if (err)
			throw err;
		console.log("Tabelul creare_lista a fost creat");
	});
});

project.use(express.static('Lab11'));

project.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/lab11.html'));
});

project.get('/site', (req, res) => {
    res.sendFile(path.join(__dirname+'/lab11_continuare.html'));
});

project.get('/file', (req, res) => {
		fs.readFile('bal.txt', 'utf8', function(err, contents) {
		res.send(contents);
	});
})

project.get('/api', (req, res) => {
  res.statusCode = 302;
  res.setHeader("Location", "https://www.youtube.com/");
  res.end();
});

project.get('/ajax', (req, res) => {
  res.sendFile(path.join(__dirname+'/ajax.html'));
});

project.get('/post', (req, res) => {
	connect.query('SELECT * FROM post', (error, result) => {
        if (error) 
			throw error;
        res.send(result);
    });
});

project.get('/post/:id', (req, res) => {
	const id = req.params.id;
 
    connect.query('SELECT * FROM post WHERE id = ?', id, (error, result) => {
        if (error) 
			throw error;
        res.send(result);
    });
});
project.get('/single_post/:title', (req, res) => {
	const title = req.params.title;
 
    connect.query('SELECT description FROM post WHERE title = ?', title, (error, result) => {
        if (error) 
			throw error;
        res.send(result);
    });
});
project.listen(3000, () => console.log('Listening on port 3000!'));