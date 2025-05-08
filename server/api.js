const express = require('express');
const router = express.Router();
const { isMedecin, isAdmin, isLogged } = require('./tool');
const db = require('./db');


//Retourne le medecin en session
router.get('/medecin', isMedecin, (req, res) => {
	res.json(req.session.medecin);
});

//Retourne tout les patients (qq infos)
router.get('/patients', isLogged, (req, res) => {
	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers
		     FROM Personne p
		     JOIN Patient pa ON pa.idPers = p.idPers`

	db.all(sql, (err, rows) => {
		if (err) {
			console.error(err);
			next(err);
		}

		const patients = []
		rows.forEach(row => {
			const patient = {
				idPers: row.idPers,
				nomPers: row.nomPers,
				prenomPers: row.prenomPers
			}

			patients.push(patient);
		});
		return res.json(patients);
	});

});

//Retourne tout les patients du service de la personne connecté en session
router.get('/patients/service', isLogged, (req, res) => {
	const sql = `SELECT DISTINCT p.idPers, p.nomPers, p.prenomPers, p.dNaisPers, p.numTelPers, p.adressePers, pa.numDossierMed, pa.motifHospitalisation
		    FROM Patient pa 
		    JOIN Personne p ON pa.idPers = p.idPers 
		    JOIN Sejour s ON pa.idPers = s.idPatient
		    JOIN Lit l ON s.idLit = l.idLit
		    JOIN Chambre c ON l.idChambre = c.idChambre
		    WHERE c.idService = ? 
		    AND (s.dateSortieReelle IS NULL OR s.dateSortieReelle > ?)
		    AND s.dateAdmission <= ?;`;

	const today = new Date();
	const date = today.toISOString().split('T')[0];
	console.log(date);

	let idService = 0;
	if (req.session.medecin) {
		idService = req.session.medecin.idService;
	} else if (req.session.admin) {
		idService = req.session.admin.idService;
	}

	db.all(sql, [idService, date, date], (err, rows) => {
		if (err) {
			console.error(err.message);
			return res.status(500).send("Erreur lors de la recup des infos des patients");
		}
		if (!rows) {
			return res.status(404).send("Patients introuvable");
		}

		let patients = [];
		rows.forEach(row => {
			let patient = {
				idPers: row.idPers,
				nomPers: row.nomPers,
				prenomPers: row.prenomPers,
				dNaisPers: row.dNaisPers,
				numTelPers: row.numTelPers,
				adressePers: row.adressePers,
				numDossierMed: row.numDossierMed,
				motifHospitalisation: row.motifHospitalisation
			}

			patients.push(patient);
		});
		res.json(patients);

	});
});

//Retourne toutes les infos d'un patient specifique
router.get('/patient/:id', isLogged, (req, res, next) => {
	const id = req.params.id;

	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers, p.dNaisPers, p.numTelPers, p.adressePers,
		     pa.numDossierMed, pa.motifHospitalisation,

		     v.idVisite, v.dateVisite, v.compteRendu,
		     e.idExamen, e.typeExamen, e.description,
		     pmv.nomPers AS nomMedecinVisite, pmv.prenomPers AS prenomMedecinVisite,

		     s.idSoin, s.dateHeureSoin, s.descriptionSoin,
		     pis.nomPers AS nomInfirmierSoin, pis.prenomPers AS prenomInfirmierSoin,
		     n.quantite, m.nomMedicament,

		     r.dateReunion, r.objetReunion,
		     pmr.nomPers AS nomMedecinReunion, pmr.prenomPers AS prenomMedecinReunion,
		     pir.nomPers AS nomInfirmierReunion, pir.prenomPers AS prenomInfirmierReunion,

		     a.idAntecedent, a.typeAntecedent, a.description, a.dateDeclaration
		     FROM Personne p

		     JOIN Patient pa ON p.idPers = pa.idPers
		     LEFT JOIN Visite v ON v.idPatient = p.idPers
		     LEFT JOIN Personne pmv ON v.idMedecin = pmv.idPers
		     LEFT JOIN Examen e ON v.idVisite = e.idVisite
		     LEFT JOIN Soin s ON s.idPatient = p.idPers
		     LEFT JOIN Necessiter n ON n.idSoin = s.idSoin
		     LEFT JOIN Medicament m ON n.idMedicament = m.idMedicament
		     LEFT JOIN Personne pis ON pis.idPers = s.idInfirmier
		     LEFT JOIN Reunion r ON s.idReunion = r.idReunion
		     LEFT JOIN ParticipationReunion par ON par.idReunion = r.idReunion
		     LEFT JOIN Personne pmr ON pmr.idPers = par.idMedecin
		     LEFT JOIN Personne pir ON pir.idPers = par.idInfirmier
		     LEFT JOIN Antecedent a ON a.idPatient = p.idPers

		     WHERE p.idPers = ?;`
	db.all(sql, id, (err, rows) => {
		if (err) {
			console.error(err);
			return next(err);
		} else if (rows.length === 0) {
			console.log("TABLEAU PATIENT VIDE");
			return;
		}

		const patient = {
			idPers: rows[0].idPers,
			nomPers: rows[0].nomPers,
			prenomPers: rows[0].prenomPers,
			dNaisPers: rows[0].dNaisPers,
			numTelPers: rows[0].numTelPers,
			adressePers: rows[0].adressePers,
			numDossierMed: rows[0].numDossierMed,
			motifHospitalisation: rows[0].motifHospitalisation,
			visites: [],
			soins: [],
			antecedents: []
		}

		const visitesMap = new Map();
		const soinsMap = new Map();
		const antecedentsMap = new Set();

		for (const row of rows) {
			if (row.idVisite) {
				if (!visitesMap.has(row.idVisite)) {
					visitesMap.set(row.idVisite, {
						idVisite: row.idVisite,
						dateVisite: row.dateVisite,
						compteRendu: row.compteRendu,
						medecin: {
							nomPers: row.nomMedecinVisite,
							prenomPers: row.prenomMedecinVisite
						},
						examens: [],
					});
				}

				if (row.idExamen) {
					visitesMap.get(row.idVisite).examens.push({
						idExamen: row.idExamen,
						typeExamen: row.typeExamen,
						description: row.description
					});
				}
			}

			if (row.idSoin) {
				if (!soinsMap.has(row.idSoin)) {
					soinsMap.set(row.idSoin, {
						idSoin: row.idSoin,
						dateHeureSoin: row.dateHeureSoin,
						descriptionSoin: row.descriptionSoin,
						infirmier: {
							nomPers: row.nomInfirmierSoin,
							prenomPers: row.prenomInfirmierSoin
						},
						reunion: {
							idReunion: row.idReunion,
							dateReunion: row.dateReunion,
							objetReunion: row.objetReunion,
							medecin: {
								nomPers: row.nomMedecinReunion,
								prenomPers: row.prenomMedecinReunion
							},
							infirmier: {
								nomPers: row.nomInfirmierReunion,
								prenomPers: row.prenomInfirmierReunion
							}
						},
						medicament: []
					});
				}
				if (row.nomMedicament) {
					soinsMap.get(row.idSoin).medicament.push({
						nomMedicament: row.nomMedicament,
						quantite: row.quantite
					});
				}
			}
			if (row.idAntecedent && !antecedentsMap.has(row.idAntecedent)) {
				antecedentsMap.add(row.idAntecedent);
				patient.antecedents.push({
					idAntecedent: row.idAntecedent,
					typeAntecedent: row.typeAntecedent,
					descriptionAntecedent: row.description,
					dateDeclaration: row.dateDeclaration
				});
			}
		}

		patient.visites = Array.from(visitesMap.values());
		patient.soins = Array.from(soinsMap.values());

		return res.json(patient);
	});
});


//Retourne tout les infirmiers
router.get('/infirmiers', isMedecin, (req, res) => {
	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers
		     FROM Personne p
		     JOIN Infirmier i ON p.idPers = i.idPers`

	db.all(sql, (err, rows) => {
		const infirmiers = [];

		rows.forEach(row => {
			infirmiers.push({ idPers: row.idPers, nomPers: row.nomPers, prenomPers: row.prenomPers });
		});
		res.json(infirmiers);
	});
});

//Retourne tout les medicaments
router.get('/medicaments', isMedecin, (req, res) => {
	const sql = `SELECT * FROM Medicament`;

	db.all(sql, (err, rows) => {
		if (err) {
			console.error(err);
		}

		const medicaments = [];

		rows.forEach(row => {
			medicaments.push({ idMedicament: row.idMedicament, nomMedicament: row.nomMedicament });
		});
		return res.json(medicaments);
	});
});

//Retourne les infos de toutes les chambres du service de l'admin en session
router.get('/chambres', isAdmin, (req, res) => {
	const sql = `SELECT c.idChambre, c.numChambre, c.capacite,
		     COUNT(DISTINCT s.idSejour) AS nbLitsOccupes,
		     MAX(n.dateNettoyage) AS derniereDateNettoyage
		     FROM Chambre c

		     LEFT JOIN Lit l ON l.idChambre = c.idChambre

		     LEFT JOIN Sejour s ON s.idLit = l.idLit
    		     AND DATE('now') >= s.dateAdmission
		     AND (DATE('now') <= COALESCE(s.dateSortieReelle, s.dateSortiePrevue) OR s.dateSortieReelle IS NULL)

		     LEFT JOIN Nettoyage n ON n.idChambre = c.idChambre

		     WHERE c.idService = ?

		     GROUP BY c.idChambre, c.numChambre, c.capacite
		     ORDER BY c.numChambre;`

	db.all(sql, req.session.admin.idService, (err, rows) => {
		if (err) {
			console.error(err);
		}

		let rooms = []

		rows.forEach(row => {
			const room = {
				idChambre: row.idChambre,
				numChambre: row.numChambre,
				capacite: row.capacite,
				nbLitsOccupes: row.nbLitsOccupes,
				dateNettoyage: row.derniereDateNettoyage
			}

			rooms.push(room);
		})

		return res.json(rooms);
	});
});

router.get('/sejour/encours', isAdmin, (req, res) => {

	const date = new Date().toISOString().split('T')[0];

	const sql = `SELECT s.dateAdmission, s.dateSortiePrevue, s.dateSortieReelle,
		     p.idPers, p.nomPers, p.prenomPers,
		     l.numLit,
		     c.idChambre, c.numChambre
		     FROM Sejour s
		     JOIN Personne p ON s.idPatient = p.idPers
		     JOIN Lit l ON s.idLit = l.idLit
		     JOIN Chambre c ON c.idChambre = l.idChambre
		     WHERE c.idService = ?
		     AND s.dateAdmission < ?
		     AND (s.dateSortieReelle IS NULL OR s.dateSortieReelle > ?);`;

	db.all(sql, [req.session.admin.idService, date, date], (err, rows) => {
		if (err) {
			console.error(err);
		}
		if (rows) {
			const sejours = [];
			rows.forEach(s => {
				sejours.push({
					dateAdmission: s.dateAdmission,
					dateSortiePrevue: s.dateSortiePrevue,
					dateSortieReelle: s.dateSortieReelle,
					idPers: s.idPers,
					nomPers: s.nomPers,
					prenomPers: s.prenomPers,
					numLit: s.numLit,
					idChambre: s.idChambre,
					numChambre: s.numChambre
				});
			});

			console.log("c carré", sejours);
			return res.json(sejours);
		}
	});
});

// Retourne les séjours terminés
// (càd ceux dont la date de sortie réelle est non nulle)
router.get('/sejour/partis', isAdmin, (req, res) => {
	const sql = `
        SELECT s.dateAdmission, s.dateSortiePrevue, s.dateSortieReelle, c.numChambre, l.numLit, p.prenomPers, p.nomPers, c.idChambre
        FROM Sejour s
        JOIN Lit l ON s.idLit = l.idLit
        JOIN Chambre c ON l.idChambre = c.idChambre
        JOIN Patient pa ON s.idPatient = pa.idPers
        JOIN Personne p ON pa.idPers = p.idPers
        WHERE s.dateSortieReelle IS NOT NULL
    `;

	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err.message);
			res.status(500).send('Erreur récupération séjours partis');
		} else {
			res.json(rows);
		}
	});
});

router.get('/sejour/terminee', isAdmin, (req, res) => {

});

//Retourne l'admin en session
router.get('/getadmin', isAdmin, (req, res) => {
	res.json(req.session.admin);
});

router.get('/chambre/:id/sejour/:date', isAdmin, (req, res) => {
	const id = req.params.id;
	const date = req.params.date;

	const sql = `SELECT l.numLit,s.idSejour, s.dateAdmission, s.dateSortiePrevue, s.dateSortieReelle, p.idPers, p.nomPers, p.prenomPers
		     FROM Chambre c
		     JOIN Lit l ON c.idChambre = l.idChambre
		     LEFT JOIN Sejour s ON l.idLit = s.idLit 
			AND s.dateAdmission <= ?
			AND (s.dateSortieReelle IS NULL OR s.dateSortieReelle >= ?)
		     LEFT JOIN Personne p ON s.idPatient= p.idPers
		     WHERE c.idChambre = ?;`;

	db.all(sql, [date, date, id], (err, rows) => {
		if (err) {
			console.error(err);
		}

		const chambre = {
			lits: []
		};

		rows.forEach(row => {
			const lit = {
				numLit: row.numLit
			};

			if (row.idSejour) {
				lit.sejour = {
					idSejour: row.idSejour,
					idPers: row.idPers,
					prenomPers: row.prenomPers,
					nomPers: row.nomPers,
					dateAdmission: row.dateAdmission,
					dateSortiePrevue: row.dateSortiePrevue
				};
				if (row.dateSortieReelle) {
					lit.sejour.dateSortieReelle = row.dateSortieReelle
				}
			}
			chambre.lits.push(lit);
		});

		return res.json(chambre);
	});
});

//Renvoie tout le personnel de nettoyage
router.get('/nettoyage', isAdmin, (req, res) => {
	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers
		     FROM Personne p
		     JOIN PersonnelNettoyage pn ON pn.idPers = p.idPers;`

	db.all(sql, (err, rows) => {
		const pers = [];

		rows.forEach(row => {
			const pernet = {
				idPers: row.idPers,
				nomPers: row.nomPers,
				prenomPers: row.prenomPers
			}

			pers.push(pernet);
		});

		return res.json(pers);
	});

});

//Renvoie les lits d'une chambre
router.get('/chambre/:id', isAdmin, (req, res) => {
	const id = req.params.id;

	const sql = `SELECT l.idLit, l.numLit
		     FROM Lit l
		     WHERE l.idChambre = ?`

	db.all(sql, id, (err, rows) => {
		if (err) {
			return console.error(err);
		}

		const lits = []

		rows.forEach(l => {
			const lit = {
				idLit: l.idLit,
				numLit: l.numLit
			}

			lits.push(lit);
		})

		return res.json(lits);
	});
});

//renvoie tout les services de l'hopital
router.get('/service', (req, res, next) => {
	const sql = `SELECT s.idService, s.nomService 
		     FROM Service s`

	try {
		db.all(sql, (err, rows) => {
			if (err) {
				throw new Error("Erreur lors de la récuperation des services");
			}

			const services = [];
			rows.forEach(row => {
				const service = {
					idService: row.idService,
					nomService: row.nomService
				}

				services.push(service);
			})

			return res.json(services);
		});
	} catch (err) {
		next(err);
	}
})

router.get('/soin/:id', isMedecin, (req, res) => {
	const id = req.params.id;

	const sql = `SELECT * FROM Soin s
		     JOIN Necessiter n ON s.idSoin = n.idSoin
		     WHERE s.idSoin = ?`;

	db.get(sql, id, (err, row) => {
		if (err) {
			console.error("Erreur lors de la récuperation du soin:", err);
		}
		const soin = {
			idSoin: row.idSoin,
			dateHeureSoin: row.dateHeureSoin,
			descriptionSoin: row.descriptionSoin,
			idInfirmier: row.idInfirmier,
			idPatient: row.idPatient,
			idReunion: row.idReunion,
			idMedicament: row.idMedicament,
			quantite: row.quantite
		};

		res.json(soin);
	});
});

router.get('/personnel/service/:id', isMedecin, (req, res) => {
	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers, p.dNaisPers, p.numTelPers, p.adressePers,
		     m.idPers AS idMedecin, m.specialite, m.mdp, m.idService AS serviceMedecin,
		     i.idPers AS idInfirmier, i.datePrisePoste, i.idService AS serviceInfirmier
		     FROM Personne p
		     LEFT JOIN Medecin m ON p.idPers = m.idPers
		     LEFT JOIN Infirmier i ON p.idPers = i.idPers
		     WHERE m.idService = ? OR i.idService = ?;`

	db.all(sql, [req.params.id, req.params.id], (err, rows) => {
		if (err) {
			console.error("Erreur recuperation du personnel de service", err);
		}
		const pers = {
			inf: [],
			med: []
		};
		rows.forEach(row => {
			if (row.specialite) {
				pers.med.push({
					idPers: row.idPers,
					nomPers: row.nomPers,
					prenomPers: row.prenomPers,
					dNaisPers: row.dNaisPers,
					numTelPers: row.numTelPers,
					adressePers: row.adressePers,
					specialite: row.specialite,
					mdp: row.mdp
				});
			} else if (row.datePrisePoste) {
				pers.inf.push({
					idPers: row.idPers,
					nomPers: row.nomPers,
					prenomPers: row.prenomPers,
					dNaisPers: row.dNaisPers,
					numTelPers: row.numTelPers,
					adressePers: row.adressePers,
					datePrisePoste: row.datePrisePoste
				});
			}
		});

		console.log("PERS: ", pers);
		return res.json(pers);
	});
});

router.get('/personnel/:id', isLogged, (req, res) => {
	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers, p.dNaisPers, p.numTelPers, p.adressePers,
		     m.idPers AS idMedecin, m.specialite, m.mdp,
		     i.idPers AS idInfirmier, i.datePrisePoste
		     FROM Personne p
		     LEFT JOIN Medecin m ON p.idPers = m.idPers
		     LEFT JOIN Infirmier i ON i.idPers = p.idPers
		     WHERE p.idPers = ?;`;

	console.log("lqhfelkID: ", req.params.id)

	db.get(sql, req.params.id, (err, row) => {
		if (err) {
			console.error("Erreur lors de la récuperation du personnel", err);
		}
		console.log("Personne retrouvé:", row);

		if (row.idMedecin) {
			const medecin = {
				idPers: row.idPers,
				nomPers: row.nomPers,
				prenomPers: row.prenomPers,
				dNaisPers: row.dNaisPers,
				numTelPers: row.numTelPers,
				adressePers: row.adressePers,
				specialite: row.specialite
			}

			return res.json(medecin);
		}
		else if (row.idInfirmier) {
			const infirmier = {
				idPers: row.idPers,
				nomPers: row.nomPers,
				prenomPers: row.prenomPers,
				dNaisPers: row.dNaisPers,
				numTelPers: row.numTelPers,
				adressePers: row.adressePers,
				datePrisePoste: row.datePrisePoste
			}

			return res.json(infirmier);
		}
	});
});

module.exports = router;
