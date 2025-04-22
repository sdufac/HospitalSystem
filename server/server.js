const {Medecin,Visite,Patient,Personne} = require('./class.js');
const db = require('./db.js');
const express = require('express');
const session = require('express-session');
const path = require('path');
const {isMedecin,isAdmin} = require('./tool.js');
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

	const sql = `SELECT * FROM Medecin m 
		     JOIN Personne p ON p.idPers = m.idPers 
                     JOIN Service s ON m.idService = s.idService 
		     WHERE m.mdp = ? AND p.nomPers = ?`;

	const sqlConnection = `SELECT p.idPers,p.nomPers,p.prenomPers,p.dNaisPers,p.numTelPers,p.adressePers,
			       m.idPers AS idMedecin, m.specialite,
			       pa.idPers AS idAdmin, pa.role, pa.datePrisePoste,
			       s.nomService 
			       FROM Personne p
			       LEFT JOIN Medecin m ON p.idPers = m.idPers AND m.mdp = ?
			       LEFT JOIN PersonnelAdmin pa ON p.idPers = pa.idPers AND pa.mdp = ?
			       LEFT JOIN Service s ON m.idService = s.idService
			       WHERE p.nomPers = ?;`

	db.get(sqlConnection,[password,password,login], (err,row) => {
		if(err){
			console.error(err);
		}else if(!row){
			console.log("Mauvais login ou mdp");
			res.redirect('/login');
		}else if(row.idMedecin){
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
		}else if(row.idAdmin){
			console.log("ADMIN");
			const admin = {
				idPers: row.idPers,
				nomPers: row.nomPers,
				prenomPers: row.prenomPers,
				dNaisPers: row.dNaisPers,
				numTelPers: row.numTelPers,
				adressePers: row.adressePers,
				role: row.role,
				datePrisePoste: row.datePrisePoste
			}

			req.session.admin = admin;
			res.redirect('/admin');
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

app.get('/addreunion', isMedecin, (req,res) => {
	res.sendFile(path.join(__dirname,'../client/addreunion.html'));
});

app.post('/addreunion',isMedecin, (req,res) => {
	const sqlReunion = `INSERT INTO Reunion (dateReunion, objetReunion)
			    VALUES (?,?)`;

	const sqlParticipant = `INSERT INTO ParticipationReunion 
				VALUES (?,?,?)`;

	const sqlSoin = `INSERT INTO Soin (dateHeureSoin,descriptionSoin,idInfirmier,idPatient,idReunion)
			 VALUES (?,?,?,?,?)`

	const sqlNec = `INSERT INTO Necessiter VALUES (?,?,?)`;

	const dateHeure = req.body.datesoin + " " + req.body.heuresoin;
	console.log("DATEHEURE: " + dateHeure);
	console.log("IDINFPRESENT= " + req.body.idinfpresent);
	console.log("IDINFRES= " + req.body.idinfres);

	db.run(sqlReunion,[req.body.formdate,req.body.objet], function(err) {
		if(err){
			console.error(err);
		}
		const idReunion = this.lastID;
		db.run(sqlParticipant,[idReunion,req.session.medecin.idPers,req.body.idinfpresent], function(err) {
			if(err){
				console.error(err);
			}

			db.run(sqlSoin,[dateHeure,req.body.description,req.body.idinfres,req.body.idpatient,idReunion],function (err) {
				if(err){
					console.error(err);
				}

				const idSoin = this.lastID;
				
				db.run(sqlNec,[idSoin,req.body.idmedicament,req.body.quantite], function (err){
					if(err){
						console.error(err);
					}
				});
			});
		});
	});

	res.redirect(`/patient?id=${req.body.idpatient}`);
});

app.get('/admin',isAdmin,(req,res) => {
	res.sendFile(path.join(__dirname, '../client/admin.html'));
});

app.get('/chambre',isAdmin,(req,res) => {
	res.sendFile(path.join(__dirname,'../client/chambre.html'));
});

app.listen(PORT, () => {
	console.log(`Serveur Express en ligne sur http://localhost:${PORT}`);
});
