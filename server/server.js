const {Medecin,Visite,Patient,Personne} = require('./class.js');
const db = require('./db.js');
const express = require('express');
const session = require('express-session');
const path = require('path');
const {isMedecin} = require('./tool.js');
const apiRoutes = require('./api.js');

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
app.use('/api',apiRoutes);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/connection.html'));
});

app.post('/login', (req,res) =>{
	const {login, password} = req.body;

	const sql = "SELECT * FROM Medecin m JOIN Personne p ON p.idPers = m.idPers JOIN Service s ON m.idService = s.idService WHERE m.mdp = ? AND p.nomPers = ?";

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
			    row.nomService
			);

			req.session.medecin = medecin;
			res.redirect('/medecin');
		}

	});
});

app.get('/medecin',isMedecin,(req,res)=> {
	res.sendFile(path.join(__dirname, '../client/medecin.html'));
});

app.get('/patient',isMedecin,(req,res) => {
	res.sendFile(path.join(__dirname,'../client/patient.html'));
});

app.get('/addvisite',isMedecin,(req,res) => {
	res.sendFile(path.join(__dirname,'../client/addvisite.html'));
});

app.post('/addvisite',isMedecin,(req,res) => {
//TODO requete d'insertion de visite
	const sql = `INSERT INTO Visite (dateVisite,compteRendu,idMedecin,idPatient) 
		     VALUES (?,?,?,?)`
	db.run(sql,[req.body.formdate,req.body.compterendu,req.body.idmedecin,req.body.idpatient],
	err =>{
		if(err){
			return console.error(err.message);
		}
		console.log("visite inséré");
	});
	res.redirect(`/patient?id=${req.body.idpatient}`);
});

app.listen(PORT, () => {
	console.log(`Serveur Express en ligne sur http://localhost:${PORT}`);
});
