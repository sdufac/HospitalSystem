const { Medecin, Visite, Patient, Personne } = require('./class.js');
const db = require('./db.js');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { isMedecin, isAdmin, isLogged } = require('./tool.js');
const apiRoutes = require('./api.js');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));
app.use(session({
	secret: '123',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 1000 * 60 * 60	//1000ms * 60sec * 60min
	}
}));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/login', (req, res) => {
	delete req.session.admin;
	delete req.session.medecin;
	res.sendFile(path.join(__dirname, '../client/connection.html'));
});

app.post('/login', (req, res, next) => {
	const { login, password } = req.body;

	const sqlConnection = `SELECT p.idPers,p.nomPers,p.prenomPers,p.dNaisPers,p.numTelPers,p.adressePers,
			       m.idPers AS idMedecin, m.specialite,
			       pa.idPers AS idAdmin, pa.role, pa.datePrisePoste,
			       s.nomService AS serviceMedecin,
			       s.idService AS idServiceMedecin,
			       s2.nomService AS serviceAdmin,
			       s2.idService AS idServiceAdmin

			       FROM Personne p
			       LEFT JOIN Medecin m ON p.idPers = m.idPers AND m.mdp = ?
			       LEFT JOIN PersonnelAdmin pa ON p.idPers = pa.idPers AND pa.mdp = ?
			       LEFT JOIN Service s ON m.idService = s.idService
			       LEFT JOIN Service s2 ON p.idPers = s2.idAdminRes
			       WHERE p.nomPers = ?;`

	try {
		db.get(sqlConnection, [password, password, login], (err, row) => {
			if (err) {
				throw new Error(err.message);
			} else if (!row) {
				console.log("Mauvais login ou mdp");
				res.redirect('/login');
			} else if (row.idMedecin) {
				//Creation d'objet
				const medecin = {
					idPers: row.idPers,
					nomPers: row.nomPers,
					prenomPers: row.prenomPers,
					dNaisPers: row.dNaisPers,
					numTelPers: row.numTelPers,
					adressePers: row.adressePers,
					specialite: row.specialite,
					mdp: row.mdp,
					service: row.serviceMedecin,
					idService: row.idServiceMedecin
				}

				req.session.medecin = medecin;
				res.redirect('/medecin');
			} else if (row.idAdmin) {
				const admin = {
					idPers: row.idPers,
					nomPers: row.nomPers,
					prenomPers: row.prenomPers,
					dNaisPers: row.dNaisPers,
					numTelPers: row.numTelPers,
					adressePers: row.adressePers,
					role: row.role,
					datePrisePoste: row.datePrisePoste,
					service: row.serviceAdmin,
					idService: row.idServiceAdmin
				}

				req.session.admin = admin;
				res.redirect('/admin');
			} else {
				throw new Error("Erreur lors de la connection");
			}
		});
	} catch (err) {
		next(err);
	}
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Erreur lors de la déconnexion");
    }
    res.redirect('/login');
  });
});

app.get('/medecin', isMedecin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/medecin.html'));
});

app.get('/patient/:id', isMedecin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/patient.html'));
});

app.get('/addvisite/:id', isMedecin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/addvisite.html'));
});

app.post('/addvisite', isMedecin, (req, res, next) => {
	const sql = `INSERT INTO Visite (dateVisite,compteRendu,idMedecin,idPatient) 
		     VALUES (?,?,?,?)`
	try {
		db.run(sql, [req.body.formdate, req.body.compterendu, req.body.idmedecin, req.body.idpatient],
			err => {
				if (err) {
					throw new Error("Erreur lors de l'insertion de la visite");
				}
			});
		res.redirect(`/patient/${req.body.idpatient}`);
	} catch (err) {
		next(err);
	}
});

app.get('/addreunion/:id', isMedecin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/addreunion.html'));
});

app.post('/addreunion', isMedecin, (req, res) => {
	const sqlReunion = `INSERT INTO Reunion (dateReunion, objetReunion)
			    VALUES (?,?)`;

	const sqlParticipant = `INSERT INTO ParticipationReunion 
				VALUES (?,?,?)`;

	const sqlSoin = `INSERT INTO Soin (dateHeureSoin,descriptionSoin,idInfirmier,idPatient,idReunion)
			 VALUES (?,?,?,?,?)`

	const sqlNec = `INSERT INTO Necessiter VALUES (?,?,?)`;

	const dateHeure = req.body.datesoin + " " + req.body.heuresoin;

	try {
		db.run(sqlReunion, [req.body.formdate, req.body.objet], function (err) {
			if (err) {
				throw new Error("Erreur lors de l'insertion de la réunion");
			}
			const idReunion = this.lastID;
			db.run(sqlParticipant, [idReunion, req.session.medecin.idPers, req.body.idinfpresent], function (err) {
				if (err) {
					console.error(err);
				}

				db.run(sqlSoin, [dateHeure, req.body.description, req.body.idinfres, req.body.idpatient, idReunion], function (err) {
					if (err) {
						throw new Error("Erreur lors de l'insertion du soin");
					}

					const idSoin = this.lastID;

					db.run(sqlNec, [idSoin, req.body.idmedicament, req.body.quantite], function (err) {
						if (err) {
							throw new Error("Erreur lors de l'insertion dans la table necesité");
						}
					});
				});
			});
		});
	} catch (err) {
		next(err);
	}
	res.redirect(`/patient/${req.body.idpatient}`);
});

app.get('/admin', isAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/admin.html'));
});

app.get('/chambre', isAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/chambre.html'));
});

app.post('/addmenage', isAdmin, (req, res, next) => {
	console.log("formulaire soumis:", req.body);

	const sql = `INSERT INTO Nettoyage (dateNettoyage,idChambre)
		   VALUES (?,?);`

	const sql2 = `INSERT INTO EffectuerNettoyage VALUES (?,?);`

	try {
		db.run(sql, [req.body.datem, req.body.idchambre], function (err) {
			if (err) {
				throw new Error("Erreur lors de l'insertion du ménage");
			} else {
				db.run(sql2, [this.lastID, req.body.idpmenage], function (err) {
					if (err) {
						throw new Error("Erreur lors de l'insertion du ménage");
					}
				});
			}
		});
	} catch (err) {
		next(err);
	}

	res.redirect('/admin');
});

app.post('/addsejour', isAdmin, (req, res, next) => {
	const sql = `INSERT INTO Sejour(dateAdmission, dateSortiePrevue, idPatient, idLit, idAdminAffectation)
		     VALUES (?,?,?,?,?);`

	try {
		db.run(sql, [req.body.dateadmi, req.body.datesortie, req.body.sidpatient, req.body.lit, req.session.admin.idPers],
			function (err) {
				if (err) {
					throw new Error("Erreur lors de l'insertion du sejour");
				}
				return res.redirect('/admin');
			});
	} catch (err) {
		next(err);
	}
});

app.get('/addpatient', isAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/addpatient.html'));
});

app.post('/addpatient', isAdmin, (req, res, next) => {
	const sqlPers = `INSERT INTO Personne (nomPers,prenomPers,dNaisPers,numTelPers,adressePers)
			 VALUES(?,?,?,?,?);`

	const sqlPatient = `INSERT INTO Patient VALUES(?,?,?);`

	try {
		db.run(sqlPers, [req.body.nompers, req.body.prenompers, req.body.dnaispers, req.body.numtelpers, req.body.adressepers],
			function (err) {
				if (err) {
					throw new Error("erreur lors de l'insertion de la personne");
				}

				const id = this.lastID;

				db.run(sqlPatient, [id, req.body.numdossiermed, req.body.motifhoospitalisation], (err) => {
					if (err) {
						throw new Error("erreur lors de l'insertion du patient");
					}

					return res.redirect('/admin');
				});
			});
	} catch (err) {
		next(err);
	}
});

app.get('/addadmin', isAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/addadmin.html'));
});

app.post('/addadmin', isAdmin, (req, res) => {
	const sqlPers = `INSERT INTO Personne (nomPers,prenomPers,dNaisPers,numTelPers,adressePers)
			 VALUES(?,?,?,?,?);`

	const sqlAdmin = `INSERT INTO PersonnelAdmin VALUES(?,?,?,?);`

	const sqlService = `UPDATE Service SET idAdminRes = ?
			    WHERE idService = ?;`

	try {
		db.run(sqlPers, [req.body.nompers, req.body.prenompers, req.body.dnaispers, req.body.numtelpers, req.body.adressepers],
			function (err) {
				if (err) {
					throw new Error("erreur lors de l'insertion de la personne");
				}

				const id = this.lastID;

				db.run(sqlAdmin, [id, req.body.mdp, req.body.role, req.body.datePrisePoste], (err) => {
					if (err) {
						throw new Error("erreur lors de l'insertion de l'admin", err);
					}

					db.run(sqlService, [id, req.body.service], (err) => {
						if (err) {
							throw new Error("erreur lors de l'insertion de l'admin service", err);
						}
						return res.redirect('/admin');
					});
				});
			});
	} catch (err) {
		next(err);
	}
});

app.get('/addpersnet', isAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/addpersnet.html'));
});

app.post('/addpersnet', isAdmin, (req, res) => {
	const sqlPers = `INSERT INTO Personne (nomPers,prenomPers,dNaisPers,numTelPers,adressePers)
			 VALUES(?,?,?,?,?);`

	const sqlAdmin = `INSERT INTO PersonnelNettoyage VALUES(?,?,?);`

	try {
		db.run(sqlPers, [req.body.nompers, req.body.prenompers, req.body.dnaispers, req.body.numtelpers, req.body.adressepers],
			function (err) {
				if (err) {
					throw new Error("erreur lors de l'insertion de la personne");
				}

				const id = this.lastID;

				db.run(sqlAdmin, [id, req.body.role, req.body.datepriseposte], (err) => {
					if (err) {
						throw new Error("erreur lors de l'insertion du personnel de nettoyage");
					}

					return res.redirect('/admin');
				});
			});
	} catch (err) {
		next(err);
	}
});

app.post('/sejour', (req, res, next) => {
	const sql = `UPDATE Sejour
		     SET dateSortieReelle = ?
		     WHERE idSejour = ?;`
	try {
		db.run(sql, [req.body.date, req.body.id], (err) => {
			if (err) throw new Error("Erreur lors de la modification de la date de sortie réelle");
		});
	} catch (err) {
		next(err);
	}

	res.redirect(`/chambre?id=${req.body.idchambre}`);
});

app.get('/modifsoin/:id', isMedecin, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/modifsoin.html'));
});

app.post('/modifsoin', isMedecin, (req, res) => {
	console.log("modif soin", req.body);
	const sqlSoin = `UPDATE Soin SET dateHeureSoin = ?,  descriptionSoin = ?, idInfirmier = ?
			 WHERE idSoin = ?;`

	const sqlNec = `UPDATE Necessiter SET idMedicament = ?, quantite = ?
			WHERE idSoin = ?;`

	const dateHeure = req.body.datesoin + " " + req.body.heuresoin;

	db.run(sqlSoin, [dateHeure, req.body.description, req.body.infres, req.body.idsoin], (err) => {
		if (err) {
			console.error("erreur modifsoin", err);
		}
	});

	db.run(sqlNec, [req.body.medicament, req.body.quantite, req.body.idsoin], (err) => {
		if (err) {
			console.error("erreur modif nec", err);
		}
	});
	// Redirection vers la page du patient
	const idPatient = req.body.idpatient;
	res.redirect(`/patient/${idPatient}`);
});

app.get('/personnel/:id', isLogged, (req, res) => {
	res.sendFile(path.join(__dirname, '../client/personne.html'));
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
