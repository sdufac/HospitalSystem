display();

async function display(){
	const path = window.location.pathname;
	const segments = path.split('/');
	const id = segments[2];  

	try{
		const personne = await fetchPers(id);

		const div = document.getElementById("info");
		if(personne){
			const title = document.getElementById("title");
			title.innerText = `${personne.prenomPers} ${personne.nomPers}`;

			div.innerHTML = `Date de naissance: ${personne.dNaisPers}<br>
					 Numero de téléphone: ${personne.numTelPers}<br>
					 Adresse: ${personne.adressePers}<br>`;
			if(personne.specialite){
				div.innerHTML += `Specialité: ${personne.specialite}`;

				const post = document.getElementById("poste");
				post.innerText = "Médecin";
			}else if(personne.datePrisePoste){
				div.innerHTML += `En poste depuis le: ${personne.datePrisePoste}`;

				const post = document.getElementById("poste");
				post.innerText = "Infirmier";
			}
		}else{
			div.innerText ="Erreur";
		}
	}catch(err){
		console.error("Erreur display",err);
	}
}

async function fetchPers(id){
	try{
		const response = await fetch('/api/personnel/' + id);

		if(!response.ok){
			throw new Error('Erreur recuperation personne');
		}

		const patients = await response.json();

		return patients;
	}catch(error){
		console.error("Erreuuur", error);
	}
}
