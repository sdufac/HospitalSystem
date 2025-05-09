const title = document.getElementById("title");
const welcome = document.getElementById("welcome");
const patient = document.getElementById("patient");
const patientDiv = document.getElementById("patients");

display();

async function display() {
	try {
		const medecin = await fetchMedecin();
		if (!medecin) throw new Error("Médecin non trouvé");

		afficherBienvenue(medecin);
		await afficherPersonnel(medecin.idService);
		await afficherPatients();

	} catch (error) {
		console.error("Erreur affichage dashboard médecin", error);
	}
}

function afficherBienvenue(medecin) {
	welcome.innerHTML = `Bonjour ${medecin.prenomPers} ${medecin.nomPers} !`;
	if (medecin.estReferent) {
		welcome.innerHTML += `<p class="text-success mt-2 mb-2 fs-5"><em>Médecin Référent du service ${medecin.service}.</em></p>`;
	}
	patient.innerHTML = `Patients actuellement au service ${medecin.service} :`;
}

async function afficherPersonnel(idService) {
	const personnes = await fetchPersonne(idService);
	if (!personnes) return;

	const persondata = document.getElementById("persondata");
	const inputpers = document.getElementById("person");
	const hiddenId = document.getElementById("selectedId");
	const button = document.getElementById("select");

	[...personnes.inf, ...personnes.med].forEach(p => {
		const opt = document.createElement("option");
		opt.value = `${p.prenomPers} ${p.nomPers}`;
		opt.setAttribute("data-id", p.idPers);
		persondata.appendChild(opt);
	});

	inputpers.addEventListener("input", () => {
		const val = inputpers.value.trim().toLowerCase();
		const options = [...document.querySelectorAll("#persondata option")];
		const found = options.find(opt => opt.value.trim().toLowerCase() === val);
		hiddenId.value = found ? found.getAttribute("data-id") : "";
	});

	button.onclick = () => {
		const id = hiddenId.value;
		if (id) {
			window.location.href = `/personnel/${id}`;
		} else {
			alert("Veuillez sélectionner une personne dans la liste.");
		}
	};
}

async function afficherPatients() {
	const patients = await fetchPatients();
	if (!patients) return;

	if (patients.length === 0) {
		patientDiv.innerHTML += `Aucun patient n'est actuellement en séjour dans votre service.`;
		return;
	}

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

async function fetchMedecin() {
	try {
		const response = await fetch('/api/medecin');
		if (!response.ok) throw new Error();
		return await response.json();
	} catch {
		console.error("Erreur lors de la récupération du médecin");
	}
}

async function fetchPatients() {
	try {
		const response = await fetch('/api/patients/service');
		if (!response.ok) throw new Error();
		return await response.json();
	} catch {
		console.error("Erreur lors de la récupération des patients");
	}
}

async function fetchPersonne(id) {
	try {
		const response = await fetch('/api/personnel/service/' + id);
		if (!response.ok) throw new Error();
		return await response.json();
	} catch {
		console.error("Erreur lors de la récupération du personnel");
	}
}
