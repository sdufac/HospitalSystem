const express = require('express');
const router = express.Router();
const {isMedecin, isAdmin} = require('./tool');
const db = require('./db');
const {Medecin,Visite,Patient,Personne} = require('./class.js');

router.get('/getmedecin',isMedecin, (req,res) => {
	res.json(req.session.medecin);
});

router.get('/getpatients', isMedecin, (req,res) =>{
	const sql = `SELECT DISTINCT p.idPers, p.nomPers, p.prenomPers, p.dNaisPers, p.numTelPers, p.adressePers, pa.numDossierMed, pa.motifHospitalisation
		    FROM Patient pa 
		    JOIN Personne p ON pa.idPers = p.idPers 
                    JOIN Visite v ON v.idPatient = pa.idPers
		    JOIN Medecin m ON v.idMedecin = m.idPers
		    JOIN Service s ON m.idService = s.idService
		    WHERE s.nomService = ?`

	db.all(sql,req.session.medecin.service, (err,rows) =>{
		if(err){
			console.error(err.message);
		}else{
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
		}
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
			}

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

			db.all(sqlSoins,id,(err,rows) => {
				if(err){
					console.error(err);
				}

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

				db.all(sqlAntecedent,id, (err,rows) => {
					if(err){
						console.error(err);
					}

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

					html += `</table><hr>
						 <button onclick='window.location.href="/addvisite?id=${id}"'>Visite</button>
						 <button onclick='window.location.href="/addreunion?id=${id}"'>Reunion</button>`;
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

		     GROUP BY c.idChambre, c.numChambre, c.capacite
		     ORDER BY c.numChambre;`

	db.all(sql,(err,rows) =>{
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

module.exports = router;
