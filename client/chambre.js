const dateInput = document.getElementById("date");
const button = document.getElementById("search");

const dateParam = new URLSearchParams(window.location.search).get('date');
if (dateParam){
	dateInput.value = dateParam;
}
form();

const formMenage = document.getElementById("formMenage");
formMenage.addEventListener('submit',function(e) {
	if(!formulaireComplet(formMenage)){
		e.preventDefault();
	}
});

const formSejour = document.getElementById("formSejour");
formSejour.addEventListener('submit',function(e) {
	if(!formulaireComplet(formSejour)){
		e.preventDefault();
	}
});

button.addEventListener("click", async function () {
	try {
		const chambre = await fetchRoomInfo(dateInput.value);
		if (chambre) {
			const div = document.getElementById("chambre");
			div.innerHTML = ""; // On efface le contenu précédent avant d'afficher le résultat de la recherche
			chambre.lits.forEach(l => {
				const divLit = document.createElement("div");
				divLit.className = "card p-4 mb-3 shadow-sm";

				const header = document.createElement("h5");
				header.className = "card-title mb-2";
				header.innerText = `Lit ${l.numLit}`;

				divLit.appendChild(header);

				divLit.appendChild(header);

				if (l.sejour) {
					const p = document.createElement("p");
					p.className = "mb-2";
					p.innerHTML = `${l.sejour.prenomPers} ${l.sejour.nomPers}<br>Date d'arrivée: ${l.sejour.dateAdmission}<br>`;
					divLit.appendChild(p);

					if (l.sejour.dateSortieReelle) {
						const sortie = document.createElement("p");
						sortie.className = "mb-2";
						sortie.innerHTML = `Date de sortie réelle : ${l.sejour.dateSortieReelle}`;
						divLit.appendChild(sortie);
					} else {
						const path = window.location.pathname;
						const segments = path.split('/');
						const id = segments[2];

						const form = document.createElement("form");
						form.method = "POST";
						form.action = "/sejour";
						form.className = "d-flex gap-2 align-items-center mt-3";

						form.innerHTML = `
							<input type="hidden" name="id" value="${l.sejour.idSejour}">
							<input type="hidden" name="idchambre" value="${id}">
							<label for="date" class="form-label mb-0">Date de sortie :</label>
							<input type="date" name="date" class="form-control form-control-sm w-auto">
							<input type="submit" value="Confirmer" class="btn btn-primary btn-sm">
						`;

						divLit.appendChild(form);
					}

					const patientButton = document.createElement("button");
					patientButton.innerText = "Patient";
					patientButton.onclick = () => {
						window.location.href = `/patient/${l.sejour.idPers}`;
					}
					p.appendChild(patientButton);

					divLit.appendChild(p);
				} else {
					const p = document.createElement("p");
					p.className = "text-muted";
					p.innerText = "Aucun patient n'occupe le lit actuellement.";
					divLit.appendChild(p);
				}

				div.appendChild(divLit);
			})
		}
	}
	catch (err) {
		console.error("Erreur info chambre", err);
	}
});

button.click();

async function form() {
	try {
		const persnet = await fetchPerNet();
		if (persnet) {
			const datalist = document.getElementById("mpers");
			const persinput = document.getElementById("mpersinput");
			const idPers = document.getElementById("idpmenage");
			const idChambre = document.getElementById("idchambre");
			const date = document.getElementById("datem");

			const path = window.location.pathname;
			const segments = path.split('/');
			const id = segments[2];
			idChambre.value = id;

			const ajd = new Date();
			const yyyy = ajd.getFullYear();
			const mm = String(ajd.getMonth() + 1).padStart(2, '0');
			const dd = String(ajd.getDate()).padStart(2, '0');
			const datestring = `${yyyy}-${mm}-${dd}`;
			date.value = datestring;
			console.log(date.value);

			persnet.forEach(pers => {
				const opt = document.createElement("option");
				opt.value = `${pers.prenomPers} ${pers.nomPers}`;

				datalist.appendChild(opt);
			});

			persinput.addEventListener("input", () => {
				let value = persinput.value;

				const [prenom, nom] = value.split(" ");

				const foo = persnet.find(p => {
					return p.prenomPers === prenom && p.nomPers === nom;
				});

				if (foo) idPers.value = foo.idPers;
			});


		}
	} catch (error) {
		console.error(error);
	}

	try {
		const patients = await fetchPatients();
		if (patients) {
			const datalistPatient = document.getElementById("spatient");
			const inputPatient = document.getElementById("spatientinput");
			const hiddenidpatient = document.getElementById("sidpatient");

			patients.forEach(p => {
				const opt = document.createElement("option");
				opt.value = `${p.prenomPers} ${p.nomPers}`;

				datalistPatient.appendChild(opt);
			});

			inputPatient.addEventListener("input", () => {
				let value = inputPatient.value;

				const [prenom, nom] = value.split(" ");

				const foo = patients.find(p => {
					return p.prenomPers === prenom && p.nomPers === nom;
				});

				if (foo) hiddenidpatient.value = foo.idPers;
			});
		}
	} catch (error) {
		console.error(error);
	}

	try {
		const lits = await fetchLits();
		if (lits) {
			const selectLit = document.getElementById("lit");

			lits.forEach(l => {
				const opt = document.createElement("option");
				opt.value = l.idLit;
				opt.innerHTML = l.numLit;

				selectLit.appendChild(opt);
			});

		}
	} catch (error) {
		console.error(error);
	}
}

async function fetchRoomInfo(date) {
	const path = window.location.pathname;
	const segments = path.split('/');
	const roomId = segments[2];

	try {
		const response = await fetch(`/api/chambre/${roomId}/sejour/${date}`)
		if (!response.ok) throw new Error("Erreur lors de la recuperation des info de la chambre");

		const chambre = await response.json();

		return chambre;
	}
	catch (error) {
		console.error("Erreuuuur", error);
	}
}

async function fetchPerNet() {
	try {
		const response = await fetch('/api/nettoyage');
		if (!response.ok) {
			throw new Error("Erreur recuperation personnelle de nettoyage");
		}

		const persnet = await response.json();

		return persnet;
	} catch (error) {
		console.error("Erreur fetch persont", error);
	}
}

async function fetchPatients() {
	try {
		const response = await fetch('/api/patients');
		if (!response.ok) {
			throw new Error("Erreur recup patient");
		}

		const patients = await response.json();

		return patients;
	} catch (error) {
		console.error("Erreur lors de la récuperation des patients", error);
	}
}

async function fetchLits() {
	try {
		const path = window.location.pathname;
		const segments = path.split('/');
		const id = segments[2];

		const response = await fetch(`/api/chambre/${id}`);
		if (!response.ok) {
			throw new Error("Erreur recup lit");
		}

		const lits = await response.json();

		return lits;
	} catch (error) {
		console.error("Erreur lors de la récuperation des lits", error);
	}
}

function formulaireComplet(form) {
	const elements = form.querySelectorAll('input, textarea, select');
	for (let el of elements) {
		if(el.type !== 'submit' && el.type !== 'button' && !el.disabled && !el.value.trim()) {
			return false;
		}
	}
	return true;
}
