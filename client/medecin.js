const title = document.getElementById("title");
const patient = document.getElementById("patient");
const patientDiv = document.getElementById("patients");
display();


async function display(){
	try{
		const medecin = await fetchMedecin();
		if(medecin){
			title.innerHTML = "Bonjour " + medecin.prenomPers + " " + medecin.nomPers;
			patient.innerHTML = "Patients actuellement au service " + medecin.service + " :";
		}
	}catch(error){
		console.error("Erreur client medecin", error);
	}

	try{
		const patients = await fetchPatients();
		if(patients){
			if (patients.length === 0){
				patientDiv.innerHTML += `Aucun patient n'est acutellement en séjour dans votre service.`;
			}else{
				patients.forEach(p =>{
					patientDiv.innerHTML += p.nomPers + ` ` + p.prenomPers
								+ `<button onclick="window.location.href='/patient?id=`+
								p.idPers +`'">+ d'info</button><br>`;
				});
			}
		}else{
			throw new Error("Erreur lors de la recuperation des patiens du service");
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
		const response = await fetch('/api/patientservice');

		if(!response.ok){
			throw new Error('Erreur recuperation patient');
		}

		const patients = await response.json();

		return patients;
	}catch(error){
		console.error("Erreuuur", error);
	}
}
