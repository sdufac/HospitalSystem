const express = require('express');
const router = express.Router();
const {isMedecin} = require('./tool');
const db = require('./db');
const {Medecin,Visite,Patient,Personne} = require('./class.js');

router.get('/getmedecin',isMedecin, (req,res) => {
	res.json(req.session.medecin);
});

router.get('/getpatients', isMedecin, (req,res) =>{
	const sql = `SELECT p.nomPers, p.nomPers, p.prenomPers, p.dNaisPers, p.numTelPers, p.adressePers, pa.numDossierMed, pa.motifHospitalisation
		    FROM Patient pa 
		    JOIN Personne p ON pa.idPers = p.isPers 
                    JOIN Visite v ON v.idPatient = pa.idPers
		    JOIN Medecin m ON v.idMedecin = m.idMedecin
		    JOIN Service s ON m.idService = s.isService
		    WHERE s.nomService = ?`
	db.all(sql,req.medecin.service, (err,rows) =>{
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

module.exports = router;
