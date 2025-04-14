const {Medecin,Visite,Patient,Personne} = require('./class.js');
const db = require('./db.js');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));
app.use(session({
	secret:'123',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure:false,
		maxAge: 1000 * 60 * 60	//1000ms * 60sec * 60min
	}
}));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/connection.html'));
});

app.post('/login', (req,res) =>{
	const {login, password} = req.body;
	console.log("Login :" + login);
	console.log("Password :" + password);

	const sql = "SELECT * FROM Medecin m JOIN Personne p WHERE p.nomPers = ? AND m.mdp = ?";

	db.get(sql,[login,password], (err,row) => {
		if(err){
			console.error(err);
		}else if(!row){
			console.log("Mauvais login ou mdp");
			res.redirect('/login');
		}else{
			//Creation d'objet
			const medecin = new Medecin(
			    row.idPers,
			    row.nomPers,
			    row.prenomPers,
			    row.dNaisPers,
			    row.numTelPers,
			    row.adressePers,
			    row.specialite,
			    row.mdp,
			    row.idService
			);

			req.session.medecin = medecin;
			console.log("Medecin mis en session: " + req.session.medecin);
			res.redirect('/dashboard');
		}

	});
});

app.get('/dashboard',isMedecin,(req,res)=> {
	res.sendFile(path.join(__dirname, '../client/dashboard.html'));
});

app.listen(PORT, () => {
	console.log(`Serveur Express en ligne sur http://localhost:${PORT}`);
});

function isMedecin(req,res,next){
	if(req.session && req.session.medecin){
		return next();
	}else{
		console.log("Connection requise");
		return res.redirect('/login');
	}
};
