fetch('/api/getmedecin')
	.then(response => response.json())
	.then(medecin => {
		const title = document.getElementById("title");
		title.innerHTML = "Bonjour " + medecin.prenomPers + " " + medecin.nomPers;

		const patient = document.getElementById("patient");
		patient.innerHTML = "Patient du service " + medecin.service;
	}).catch(error => {
		console.error("Erreur recuperation medecin",error);
	});
