const path = window.location.pathname;
const segments = path.split('/');
const idSoin = segments[2];
console.log("IDSOIN:", idSoin);

form();

const formulaire = document.getElementById("form");
if(formulaire){
	console.log("FORM");
}
formulaire.addEventListener('submit',function(e) {
	if(!formulaireComplet(formulaire)){
		e.preventDefault();
	}
});

async function form() {
	try {
		const infirmiers = await fetchInfirmiers();
		const soin = await fetchSoin();
		const medicaments = await fetchMedicaments();

		if (infirmiers && soin && medicaments) {
			const inputIdSoin = document.getElementById("idsoin");
			inputIdSoin.value = idSoin;

			const description = document.getElementById("description");
			description.value = soin.descriptionSoin;

			const selectInf = document.getElementById("infres");
			infirmiers.forEach(i => {
				const opt = document.createElement("option");
				opt.innerText = `${i.prenomPers} ${i.nomPers}`;
				opt.value = i.idPers;

				selectInf.appendChild(opt);
			});
			selectInf.value = soin.idInfirmier;

			const selectMed = document.getElementById("medicament");
			medicaments.forEach(m => {
				const opt = document.createElement("option");
				opt.innerText = m.nomMedicament;
				opt.value = m.idMedicament;

				selectMed.appendChild(opt);
			});
			selectMed.value = soin.idMedicament

			const quantite = document.getElementById("quantite");
			quantite.value = soin.quantite;

			const btnRetour = document.getElementById("btnRetour");
			btnRetour.href = `/patient/${soin.idPatient}`;

			const inputIdPatient = document.getElementById("idpatient");
			inputIdPatient.value = soin.idPatient;

			const datesoin = document.getElementById("datesoin");
			const heuresoin = document.getElementById("heuresoin");
			const datetime = soin.dateHeureSoin;
			if (datetime) {
				const [datePart, timePart] = datetime.split(' ');
				datesoin.value = datePart;
				heuresoin.value = timePart;
			}
		}
	} catch (err) {
		console.error(err);
	}
}

async function fetchInfirmiers() {
	try {
		const response = await fetch('/api/infirmiers');
		if (!response.ok) {
			throw new Error('Erreur recuperation infirmiers');
		}

		const infirmiers = await response.json();

		return infirmiers
	} catch (error) {
		console.error("Erreur infirmiers", error);
	}
}

async function fetchMedicaments() {
	try {
		const response = await fetch('/api/medicaments');
		if (!response.ok) {
			throw new Error('Erreur recuperation medicaments');
		}

		const medicaments = await response.json();

		return medicaments
	} catch (error) {
		console.error("Erreur medicaments", error);
	}
}

async function fetchSoin() {
	try {
		console.log(idSoin);
		const response = await fetch(`/api/soin/${idSoin}`);
		if (!response.ok) {
			throw new Error('Erreur recuperation soin');
		}

		const soin = await response.json();

		return soin;
	} catch (error) {
		console.error("Erreur soin", error);
	}
}

function formulaireComplet(form) {
	const elements = form.querySelectorAll('input, textarea, select');
	for (let el of elements) {
		if(el.type !== 'submit' && el.type !== 'button' && !el.disabled && el.offsetParent !== null && !el.value.trim()) {
			return false;
		}
	}
	return true;
}
