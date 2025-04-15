const title = document.getElementById("title");
const patient = document.getElementById("patient");
const patientDiv = document.getElementById("patients");
display();


async function display(){
	try{
		const medecin = await fetchMedecin();
		if(medecin){
			title.innerHTML = "Bonjour " + medecin.prenomPers + " " + medecin.nomPers;
			patient.innerHTML = "Patient du service " + medecin.service;
		}
	}catch(error){
		console.error("Erreur client medecin", error);
	}

	try{
		const patients = await fetchPatients();
		if(patients){
			patients.forEach(p =>{
				patientDiv.innerHTML += p.nomPers + " " + p.prenomPers + "<br>";
			});
		}
	}catch(error){
		console.error("Erreur client patients", error);
	}
}

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
