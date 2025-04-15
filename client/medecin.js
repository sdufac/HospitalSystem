const title = document.getElementById("title");
const medecin = fetchMedecin();
title.innerHTML = "Bonjour " + medecin.prenomPers + " " + medecin.nomPers;

const patient = document.getElementById("patient");
patient.innerHTML = "Patient du service " + medecin.service;

const patients = fetchPatients();
const patientDiv = document.getElementById("patients");
patients.forEach(p =>{
	patientDiv += "aa " + p.nomPers + " " + p.prenomPers + "<br>";
});

async function fetchMedecin(){
	try{
		const response = await fetch('/api/getmedecin');
		if(!response.ok){
			throw new Error('Erreur recuperation medecin');
		}

		const medecin = await response.json();

		return medecin
	}catch(error){
		console.error("Erreur medecin", error);
	}
}

async function fetchPatients(){
	try{
		const response = await fetch('/api/getpatients');

		if(!response.ok){
			throw new Error('Erreur recuperation patient');
		}

		const patients = await response.json();

		return patients;
	}catch(error){
		console.error("Erreuuur", error);
	}
}
