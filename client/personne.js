display();

async function display() {
	const path = window.location.pathname;
	const segments = path.split('/');
	const id = segments[2];

	try {
		const personne = await fetchPers(id);

		const div = document.getElementById("info");
		if (personne) {
			const name = document.getElementById("name");
			name.innerText = `${personne.prenomPers} ${personne.nomPers}`;

			// Création d'une liste d'informations avec Bootstrap
			div.innerHTML = `
			 <ul class="list-group list-group-flush">
			   <li class="list-group-item"><strong>Date de naissance :</strong> ${personne.dNaisPers}</li>
			   <li class="list-group-item"><strong>Numéro de téléphone :</strong> ${personne.numTelPers}</li>
			   <li class="list-group-item"><strong>Adresse :</strong> ${personne.adressePers}</li>
			   ${personne.specialite ? `
				 <li class="list-group-item"><strong>Spécialité :</strong> ${personne.specialite}</li>
				 <li class="list-group-item"><strong>Poste :</strong> Médecin</li>
			   ` : ''}
			   ${personne.datePrisePoste ? `
				 <li class="list-group-item"><strong>En poste depuis :</strong> ${personne.datePrisePoste}</li>
				 <li class="list-group-item"><strong>Poste :</strong> Infirmier</li>
			   ` : ''}
			 </ul>
		   `;
		} else {
			div.innerHTML = `<div class="alert alert-danger" role="alert">Erreur lors de la récupération des informations.</div>`;
		}
	} catch (err) {
		console.error("Erreur display", err);
	}
}

async function fetchPers(id) {
	try {
		const response = await fetch('/api/personnel/' + id);

		if (!response.ok) {
			throw new Error('Erreur recuperation personne');
		}

		const patients = await response.json();

		return patients;
	} catch (error) {
		console.error("Erreuuur", error);
	}
}
