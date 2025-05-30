const idmedecin = document.getElementById("idmedecin");
const idpatient = document.getElementById("idpatient");
const formdate = document.getElementById("formdate");
const divdate = document.getElementById("date");

const url = new URL(window.location.href);
const pathname = url.pathname;
const id = pathname.split('/')[2];

//Date du jour en on format pour la bdd
const ajd = new Date();
const yyyy = ajd.getFullYear();
const mm = String(ajd.getMonth() + 1).padStart(2, '0');
const dd = String(ajd.getDate()).padStart(2, '0');
const date = `${yyyy}-${mm}-${dd}`;

form();

const formulaire = document.getElementById("visiteform");
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
		const medecin = await fetchMedecin();
		if (medecin) {

			divdate.innerHTML = `Visite du ${dd}/${mm}/${yyyy}`;
			idmedecin.value = medecin.idPers;
			idpatient.value = id;
			formdate.value = date;
		}
		const btnRetour = document.getElementById("btnRetour");
		btnRetour.href = `/patient/${id}`;
	} catch (error) {
		console.error("Erreur client medecin", error);
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

function formulaireComplet(form) {
	const elements = form.querySelectorAll('input, textarea, select');
	for (let el of elements) {
		if(el.type !== 'submit' && el.type !== 'button' && !el.disabled && el.offsetParent !== null && !el.value.trim()) {
			return false;
		}
	}
	return true;
}
