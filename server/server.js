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

app.post('/login', (req,res,next) =>{
	const {login, password} = req.body;

	const sqlConnection = `SELECT p.idPers,p.nomPers,p.prenomPers,p.dNaisPers,p.numTelPers,p.adressePers,
			       m.idPers AS idMedecin, m.specialite,
			       pa.idPers AS idAdmin, pa.role, pa.datePrisePoste,
			       s.nomService 
			       FROM Personne p
			       LEFT JOIN Medecin m ON p.idPers = m.idPers AND m.mdp = ?
			       LEFT JOIN PersonnelAdmin pa ON p.idPers = pa.idPers AND pa.mdp = ?
			       LEFT JOIN Service s ON m.idService = s.idService
			       WHERE p.nomPers = ?;`

	try{
		db.get(sqlConnection,[password,password,login], (err,row) => {
			if(err){
				throw new Error(err.message);
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
			}else{
				throw new Error("Erreur lors de la connection");
			}
		});
	}catch(err){
		next(err);
	}
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

app.post('/addvisite',isMedecin,(req,res,next) => {
//TODO requete d'insertion de visite
	const sql = `INSERT INTO Visite (dateVisite,compteRendu,idMedecin,idPatient) 
		     VALUES (?,?,?,?)`
	try{
		db.run(sql,[req.body.formdate,req.body.compterendu,req.body.idmedecin,req.body.idpatient],
		err =>{
			if(err){
				throw new Error("Erreur lors de l'insertion de la visite");
			}
		});
		res.redirect(`/patient?id=${req.body.idpatient}`);
	}catch(err){
		next(err);
	}
});

app.get('/addreunion', isMedecin, (req,res) => {
	res.sendFile(path.join(__dirname,'../client/addreunion.html'));
});

app.post('/addreunion',isMedecin, (req,res,err) => {
	const sqlReunion = `INSERT INTO Reunion (dateReunion, objetReunion)
			    VALUES (?,?)`;

	const sqlParticipant = `INSERT INTO ParticipationReunion 
				VALUES (?,?,?)`;

	const sqlSoin = `INSERT INTO Soin (dateHeureSoin,descriptionSoin,idInfirmier,idPatient,idReunion)
			 VALUES (?,?,?,?,?)`

	const sqlNec = `INSERT INTO Necessiter VALUES (?,?,?)`;

	const dateHeure = req.body.datesoin + " " + req.body.heuresoin;

	try{
		db.run(sqlReunion,[req.body.formdate,req.body.objet], function(err) {
			if(err){
				throw new Error("Erreur lors de l'insertion de la réunion");
			}
			const idReunion = this.lastID;
			db.run(sqlParticipant,[idReunion,req.session.medecin.idPers,req.body.idinfpresent], function(err) {
				if(err){
					console.error(err);
				}

				db.run(sqlSoin,[dateHeure,req.body.description,req.body.idinfres,req.body.idpatient,idReunion],function (err) {
					if(err){
						throw new Error("Erreur lors de l'insertion du soin");
					}

					const idSoin = this.lastID;
					
					db.run(sqlNec,[idSoin,req.body.idmedicament,req.body.quantite], function (err){
						if(err){
							throw new Error("Erreur lors de l'insertion dans la table necesité");
						}
					});
				});
			});
		});
	}catch(err){
		next(err);
	}
	res.redirect(`/patient?id=${req.body.idpatient}`);
});

app.get('/admin',isAdmin,(req,res) => {
	res.sendFile(path.join(__dirname, '../client/admin.html'));
});

app.get('/chambre',isAdmin,(req,res) => {
	res.sendFile(path.join(__dirname,'../client/chambre.html'));
});

app.post('/addmenage',isAdmin,(req,res,next) => {
	console.log("formulaire soumis:",req.body);

	const sql=`INSERT INTO Nettoyage (dateNettoyage,idChambre)
		   VALUES (?,?);`

	const sql2=`INSERT INTO EffectuerNettoyage VALUES (?,?);`

	try{
		db.run(sql,[req.body.datem,req.body.idchambre],function(err) {
			if (err) {
				throw new Error("Erreur lors de l'insertion du ménage");
			} else {
				db.run(sql2,[this.lastID,req.body.idpmenage],function(err) {
					if(err){
						throw new Error("Erreur lors de l'insertion du ménage");
					}
				});
			}
		});
	}catch(err){
		next(err);
	}

	res.redirect('/admin');
});

app.post('/addsejour',isAdmin,(req,res,next) => {
	const sql = `INSERT INTO Sejour(dateAdmission, dateSortiePrevue, idPatient, idLit, idAdminAffectation)
		     VALUES (?,?,?,?,?);`

	try{
		db.run(sql,[req.body.dateadmi,req.body.datesortie,req.body.sidpatient,req.body.lit,req.session.admin.idPers],
		function (err) {
			if(err){
				throw new Error("Erreur lors de l'insertion du sejour");
			}
			return res.redirect('/admin');
		});
	}catch(err){
		next(err);
	}
});

app.get('/addpatient',isAdmin,(req,res) => {
	res.sendFile(path.join(__dirname, '../client/addpatient.html'));
});

app.post('/addpatient',isAdmin,(req,res,next) => {
	const sqlPers = `INSERT INTO Personne (nomPers,prenomPers,dNaisPers,numTelPers,adressePers)
			 VALUES(?,?,?,?,?);`
	
	const sqlPatient = `INSERT INTO Patient VALUES(?,?,?);`

	try{
		db.run(sqlPers,[req.body.nompers,req.body.prenompers,req.body.dnaispers,req.body.numtelpers,req.body.adressepers],
		function (err) {
			if(err){
				throw new Error("erreur lors de l'insertion de la personne");
			}

			const id = this.lastID;

			db.run(sqlPatient,[id,req.body.numdossiermed,req.body.motifhoospitalisation], (err) => {
				if(err){
					throw new Error("erreur lors de l'insertion du patient");
				}

				return res.redirect('/admin');
			});
		});
	}catch(err){
		next(err);
	}
});

app.get('/addmedecin',isAdmin,(req,res) => {
	res.sendFile(path.join(__dirname, '../client/addmedecin.html'));
});

app.post('/addmedecin',isAdmin,(req,res) => {
	const sqlPers = `INSERT INTO Personne (nomPers,prenomPers,dNaisPers,numTelPers,adressePers)
			 VALUES(?,?,?,?,?);`
	
	const sqlPatient = `INSERT INTO Medecin VALUES(?,?,?,?);`

	try{
		db.run(sqlPers,[req.body.nompers,req.body.prenompers,req.body.dnaispers,req.body.numtelpers,req.body.adressepers],
		function (err) {
			if(err){
				throw new Error("erreur lors de l'insertion de la personne");
			}

			const id = this.lastID;

			db.run(sqlPatient,[id,req.body.specialite,req.body.mdp,req.body.service], (err) => {
				if(err){
					throw new Error("erreur lors de l'insertion du patient");
				}

				return res.redirect('/admin');
			});
		});
	}catch(err){
		next(err);
	}
});

//Middleware pour erreur 404
app.use((req, res, next) => {
  res.status(404).send('<h1>Erreur 404</h1><p>Page non trouvée.</p>');
});

//Middleware pour erreur 500
app.use((err, req, res, next) => {
	console.error("Erreur :", err.message);
	console.error("Stack :", err.stack);

	res.status(err.status || 500).send(`
		<h1>Erreur ${err.status}</h1><br>
		<p>Message: ${err.message}</p>
	`);
});

app.listen(PORT, () => {
	console.log(`Serveur Express en ligne sur http://localhost:${PORT}`);
});
