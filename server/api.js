const express = require('express');
const router = express.Router();
const {isMedecin, isAdmin} = require('./tool');
const db = require('./db');
const {Medecin,Visite,Patient,Personne} = require('./class.js');

router.get('/getmedecin',isMedecin, (req,res) => {
	res.json(req.session.medecin);
});

router.get('/patientservice', isMedecin, (req,res) =>{
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

	db.all(sql,[req.session.medecin.idService,date,date], (err,rows) =>{
		if(err){
			console.error(err.message);
			return res.status(500).send("Erreur lors de la recup des infos des patients");
		}
		if(!rows){
			return res.status(404).send("Patients introuvable");
		}

		let patients = [];
		rows.forEach(row =>{
			let patient = new Patient(
				row.idPers,
				row.nomPers,
				row.prenomPers,
				row.dNaisPers,
				row.numTelPers,
				row.adressePers,
				row.numDossierMed,
				row.motifHospitalisation
			);

			patients.push(patient);
		});
		res.json(patients);
		
	});
});

router.get('/patient',isMedecin ,(req,res)=>{
	const id = req.query.id;
	let html;

	const sqlPatient = `SELECT p.nomPers, p.prenomPers, p.dNaisPers, p.numTelPers, p.adressePers
			    FROM Personne p
			    JOIN Patient pa ON p.idPers = pa.idPers
			    WHERE p.idPers = ?;`

	const sqlVisites = `SELECT v.dateVisite, v.compteRendu, p.nomPers, p.prenomPers
			    FROM Visite v
			    JOIN Personne p ON v.idMedecin = p.idPers
			    WHERE v.idPatient = ?;`;

	const sqlSoins = `SELECT s.dateHeureSoin, s.descriptionSoin, m.nomMedicament, n.quantite
			  FROM Soin s
			  JOIN Necessiter n ON s.idSoin = n.idSoin
			  JOIN Medicament m ON n.idMedicament = m.idMedicament
			  WHERE s.idPatient = ?;
			  `;

	const sqlAntecedent = `SELECT a.typeAntecedent, a.description, a.dateDeclaration
			       FROM Antecedent a
			       WHERE a.idPatient = ?`;

	db.get(sqlPatient,id, (err,row) => {
		if(err){
			console.error(err);
			return res.status(500).send("Erreur lors de la recup des infos du patient");
		}
		if(!row) return res.status(404).send("Patient introuvable");
		
		html = `<h1>${row.prenomPers} ${row.nomPers}</h1><hr>`;

		db.all(sqlVisites,id, (err,rows) => {
			if(err){
				console.error(err);
				return res.status(500).send("Erreur lors de la recup des visites du patient");
			}else if(!rows || rows.length === 0){
				html+=`<h2>Visites</h2><br>
				       Ce patient n'a pas encore fait de visite.`
			}else{
				html+=`<h2>Visites</h2><br>
					<table>
					<tr>
						<th>Date</th>
						<th>Medecin</th>
						<th>Compte rendu<th>
					</tr>`;

				rows.forEach(row => {
					html += `<tr>
							<td>${row.dateVisite}</td>
							<td>${row.nomPers} ${row.prenomPers}</td>
							<td>${row.compteRendu}</td>
						 </tr>`
				});

				html += `</table>`
			}
			db.all(sqlSoins,id,(err,rows) => {
				if(err){
					console.error(err);
					return res.status(500).send("Erreur lors de la recup des visites du patient");
				}else if(!rows || rows.length === 0){
					html+=`<h2>Soins</h2><br>
					       Ce patient n'a pas encore reçu de soins`;
				}else{
					html+=`<h2>Soins</h2><br>
						<table>
						<tr>
							<th>Date / Heure</th>
							<th>Description</th>
							<th>Medicament<th>
							<th>Quantité<th>
						</tr>`;

					rows.forEach(row =>{
						html += `<tr>
								<td>${row.dateHeureSoin}</td>
								<td>${row.descriptionSoin}</td>
								<td>${row.nomMedicament}</td>
								<td>${row.quantite}</td>
							 </tr>`;
					});
					html+= `</table>`;
				}
				db.all(sqlAntecedent,id, (err,rows) => {
					if(err){
						console.error(err);
						return res.status(500).send("Erreur lors de la recup des antecendents du patient");
					}else if(!rows || rows.length === 0){
						html+=`<h2>Soins</h2><br>
						       Ce patient n'a pas d'antecedents`;
					}else{

						html+=`<h2>Antecedents</h2><br>
							<table>
							<tr>
								<th>Type</th>
								<th>Description</th>
								<th>Date<th>
							</tr>`;

						rows.forEach(row => {
							html += `<tr>
									<td>${row.typeAntecedent}</td>
									<td>${row.description}</td>
									<td>${row.dateDeclaration}</td>
								 </tr>`;
						});

						html += `</table>`;
					}
					html+= `<hr><button onclick='window.location.href="/addvisite?id=${id}"'>Visite</button>
							 <button onclick='window.location.href="/addreunion?id=${id}"'>Reunion</button>`
					res.send(html);
				});
			});
		});
	});
});

router.get('/getinfirmier',isMedecin,(req,res) =>{
	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers
		     FROM Personne p
		     JOIN Infirmier i ON p.idPers = i.idPers`
	
	db.all(sql,(err,rows) => {
		const infirmiers = [];

		rows.forEach(row => {
			infirmiers.push({ idPers: row.idPers, nomPers: row.nomPers, prenomPers:row.prenomPers});
		});
		res.json(infirmiers);
	});
});

router.get('/getmedicaments',isMedecin,(req,res) => {
	const sql = `SELECT * FROM Medicament`;

	db.all(sql, (err,rows) => {
		if(err){
			console.error(err);
		}

		const medicaments = [];

		rows.forEach(row => {
			medicaments.push({idMedicament: row.idMedicament, nomMedicament: row.nomMedicament});
		});
		return res.json(medicaments);
	});
});

router.get('/getrooms',isAdmin,(req,res) => {
	const sql = `SELECT c.idChambre, c.numChambre, c.capacite,
		     COUNT(DISTINCT s.idSejour) AS nbLitsOccupes,
		     MAX(n.dateNettoyage) AS derniereDateNettoyage
		     FROM Chambre c

		     LEFT JOIN Lit l ON l.idChambre = c.idChambre

		     LEFT JOIN Sejour s ON s.idLit = l.idLit
    		     AND DATE('now') >= s.dateAdmission
		     AND DATE('now') <= COALESCE(s.dateSortieReelle, s.dateSortiePrevue)

		     LEFT JOIN Nettoyage n ON n.idChambre = c.idChambre

		     WHERE c.idService = ?

		     GROUP BY c.idChambre, c.numChambre, c.capacite
		     ORDER BY c.numChambre;`

	db.all(sql,req.session.admin.idService,(err,rows) =>{
		if(err){
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

router.get('/getadmin',isAdmin, (req,res) => {
	res.json(req.session.admin);
});

router.get('/chambre',isAdmin, (req,res) => {
	const id = req.query.id;
	const date = req.query.date;
	let html = "";

	const sql = `SELECT l.numLit,s.idSejour, s.dateAdmission, s.dateSortiePrevue, s.dateSortieReelle, p.nomPers, p.prenomPers
		     FROM Chambre c
		     JOIN Lit l ON c.idChambre = l.idChambre
		     LEFT JOIN Sejour s ON l.idLit = s.idLit 
			AND s.dateAdmission <= ?
			AND (s.dateSortieReelle IS NULL AND s.dateSortiePrevue >= ?
			OR s.dateSortieReelle IS NOT NULL AND s.dateSortieReelle >= ?)
		     LEFT JOIN Personne p ON s.idPatient= p.idPers
		     WHERE c.idChambre = ?;`;

	db.all(sql,[date,date,date,id],(err,rows) => {
		if(err){
			console.error(err);
		}

		let nb = 1;
		rows.forEach(row => {
			html += `<h2> Lit ${nb}</h2>`;
			if(row.nomPers){
				html+= `${row.nomPers} ${row.prenomPers}<br>
					Date d'arrivée: ${row.dateAdmission}<br>
					Date de sortie prévue: ${row.dateSortiePrevue}<br>`;

				if(row.dateSortieReelle){
					html+= `Date de sortie reelle: ${row.dateSortieReelle}`
				}else{
					html+= `<form method="POST" action="/sejour">
							<input type="hidden" value="${row.idSejour}" id="id" name="id">
							<input type="hidden" value="${id}" id="idchambre" name="idchambre">
							<label for="date">Date de sortie: </label>
							<input type="date" name="date" id="date">
							<input type="submit" value="Confirmer">
						</form></br>`
				}
			}else{
				html+= `Aucun patient n'occupe actuellement le lit`;
			}

			nb++;
		});
		return res.send(html);
	});
});

router.get('/getpersnet',isAdmin,(req,res) => {
	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers
		     FROM Personne p
		     JOIN PersonnelNettoyage pn ON pn.idPers = p.idPers;`

	db.all(sql,(err, rows) => {
		const pers = [];

		rows.forEach(row => {
			const pernet ={
				idPers: row.idPers,
				nomPers: row.nomPers,
				prenomPers: row.prenomPers
			}

			pers.push(pernet);
		});

		return res.json(pers);
	});

});

router.get('/getpatientadmin',isAdmin,(req,res) => {
	const sql = `SELECT p.idPers, p.nomPers, p.prenomPers
		     FROM Personne p
		     JOIN Patient pa ON pa.idPers = p.idPers`

	db.all(sql, (err ,rows) => {
		if(err){
			console.error(err);
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

router.get('/getlits', isAdmin, (req, res) => {
	const id = req.query.id;

	const sql = `SELECT l.idLit, l.numLit
		     FROM Lit l
		     WHERE l.idChambre = ?`

	db.all(sql,id,(err, rows) => {
		if(err){
			return console.error(err);
		}

		const lits = []

		rows.forEach(l => {
			const lit= {
				idLit: l.idLit,
				numLit: l.numLit
			}

			lits.push(lit);
		})

		return res.json(lits);
	});
});

router.get('/getservice',(req,res,next) => {
	const sql = `SELECT s.idService, s.nomService 
		     FROM Service s`

	try{
		db.all(sql,(err,rows) => {
			if(err){
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
	}catch(err){
		next(err);
	}
})

module.exports = router;
