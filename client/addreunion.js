//Date du jour en on format pour la bdd
const ajd = new Date();
const yyyy = ajd.getFullYear();
const mm = String(ajd.getMonth() + 1).padStart(2, '0');
const dd = String(ajd.getDate()).padStart(2, '0');
const date = `${yyyy}-${mm}-${dd}`;

const path = window.location.pathname;
const segments = path.split('/');
const id = segments[2];

const formdate = document.getElementById('formdate');
const idmedecin = document.getElementById("idmedecin");
const idpatient = document.getElementById("idpatient");
const infpresent = document.getElementById("infpresent");
const infres = document.getElementById("infres");

const medicamentsdata = document.getElementById("medicament");

const datesoin = document.getElementById('datesoin');
const btnRetour = document.getElementById('btnRetour');
const divdate = document.getElementById('date');
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
		const medicaments = await fetchMedicaments();

		if (infirmiers && medicaments) {

			idpatient.value = id;
			formdate.value = date;

			infirmiers.forEach(infirmier => {
				const opt = document.createElement("option");
				opt.value = `${infirmier.prenomPers} ${infirmier.nomPers}`;

				const opt2 = document.createElement("option");
				opt2.value = `${infirmier.prenomPers} ${infirmier.nomPers}`;

				infpresent.appendChild(opt);
				infres.appendChild(opt2);
			});

			medicaments.forEach(medicament => {
				const opt = document.createElement("option");
				opt.value = medicament.nomMedicament;

				medicamentsdata.appendChild(opt);
			});

			const input1 = document.getElementById("infpresentinput");
			const idtag1 = document.getElementById("idinfpresent");
			const input2 = document.getElementById("infresinput");
			const idtag2 = document.getElementById("idinfres");

			const medicamentinput = document.getElementById("medicamentinput");
			const idmedicament = document.getElementById("idmedicament");

			input1.addEventListener("input", () => {
				let value = input1.value;

				const [prenom, nom] = value.split(" ");

				const foo = infirmiers.find(inf => {
					return inf.prenomPers === prenom && inf.nomPers === nom;
				});

				if (foo) idtag1.value = foo.idPers;
			});

			input2.addEventListener("input", () => {
				let value = input2.value;

				const [prenom, nom] = value.split(" ");

				const foo = infirmiers.find(inf => {
					return inf.prenomPers === prenom && inf.nomPers === nom;
				});

				if (foo) idtag2.value = foo.idPers;
			});

			medicamentinput.addEventListener("input", () => {
				let value = medicamentinput.value;
				const foo = medicaments.find(med => {
					return med.nomMedicament === value;
				})

				if (foo) {
					idmedicament.value = foo.idMedicament;
					console.log("Id du medicament selectionné: " + idmedicament.value);
				}
			})

		}

		idpatient.value = id;
		formdate.value = date;
		datesoin.value = date;

		const heuresoin = document.getElementById('heuresoin');
		const currentHours = String(ajd.getHours()).padStart(2, '0');
		const currentMinutes = String(ajd.getMinutes()).padStart(2, '0');
		heuresoin.value = `${currentHours}:${currentMinutes}`;

		divdate.innerHTML = `Réunion du ${dd}/${mm}/${yyyy}`;
		btnRetour.href = `/patient/${id}`;

	} catch (error) {
		console.error("Erreur client medecin", error);
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

function formulaireComplet(form) {
	const elements = form.querySelectorAll('input, textarea, select');
	for (let el of elements) {
		if(el.type !== 'submit' && el.type !== 'button' && !el.disabled && el.offsetParent !== null && !el.value.trim()) {
			return false;
		}
	}
	return true;
}
