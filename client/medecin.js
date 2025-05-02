const title = document.getElementById("title");
const patient = document.getElementById("patient");
const patientDiv = document.getElementById("patients");
display();


async function display() {
	try {
		const medecin = await fetchMedecin();
		if (medecin) {
			title.innerHTML = "Bonjour " + medecin.prenomPers + " " + medecin.nomPers;
			patient.innerHTML = "Patients actuellement au service " + medecin.service + " :";

			const personnes = await fetchPersonne(medecin.idService);
			console.log("PERS: ", personnes);

			if (personnes) {
				const persondata = document.getElementById("persondata");

				personnes.inf.forEach(i => {
					const opt = document.createElement("option");
					opt.value = `${i.prenomPers} ${i.nomPers}`;

					persondata.appendChild(opt);
				});

				personnes.med.forEach(m => {
					const opt = document.createElement("option");
					opt.value = `${m.prenomPers} ${m.nomPers}`;

					persondata.appendChild(opt);
				});

				const button = document.getElementById("select");
				const inputpers = document.getElementById("person");

				button.onclick = () => {
					if (personnes.med.find(m => m.prenomPers + " " + m.nomPers === inputpers.value)) {
						const m = personnes.med.find(m => m.prenomPers + " " + m.nomPers === inputpers.value);

						console.log("Medecin trouvé", m);
						window.location.href = `/personnel/${m.idPers}`;
					} else if (personnes.inf.find(i => i.prenomPers + " " + i.nomPers === inputpers.value)) {
						const i = personnes.inf.find(i => i.prenomPers + " " + i.nomPers === inputpers.value);

						console.log("Infirmier trouvé", i);
						window.location.href = `/personnel/${i.idPers}`;
					}
				};
			}
		}
	} catch (error) {
		console.error("Erreur client medecin", error);
	}

	try {
		const patients = await fetchPatients();
		if (patients) {
			if (patients.length === 0) {
				patientDiv.innerHTML += `Aucun patient n'est acutellement en séjour dans votre service.`;
			} else {
				// patients.forEach(p =>{
				// 	patientDiv.innerHTML += p.nomPers + ` ` + p.prenomPers
				// 				+ `<button onclick="window.location.href='/patient/`+
				// 				p.idPers +`'">+ d'info</button><br>`;
				// });
				patients.forEach(p => {
					const patientItem = document.createElement('div');
					patientItem.className = "list-group-item d-flex justify-content-between align-items-center";

					patientItem.innerHTML = `
					  <span>${p.nomPers} ${p.prenomPers}</span>
					  <button class="btn btn-outline-primary btn-sm" onclick="window.location.href='/patient/${p.idPers}'">+ d'info</button>
					`;

					patientDiv.appendChild(patientItem);
				});
			}
		} else {
			throw new Error("Erreur lors de la recuperation des patiens du service");
		}
	} catch (error) {
		console.error("Erreur client patients", error);
	}
}

async function fetchMedecin() {
	try {
		const response = await fetch('/api/medecin');
		if (!response.ok) {
			throw new Error('Erreur recuperation medecin');
		}

		const medecin = await response.json();

		return medecin
	} catch (error) {
		console.error("Erreur medecin", error);
	}
}

async function fetchPatients() {
	try {
		const response = await fetch('/api/patients/service');

		if (!response.ok) {
			throw new Error('Erreur recuperation patient');
		}

		const patients = await response.json();

		return patients;
	} catch (error) {
		console.error("Erreuuur", error);
	}
}

async function fetchPersonne(id) {
	try {
		const response = await fetch('/api/personnel/service/' + id);

		if (!response.ok) {
			throw new Error('Erreur recuperation personne');
		}

		const patients = await response.json();

		return patients;
	} catch (error) {
		console.error("Erreuuur", error);
	}
}
