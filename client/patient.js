const url = new URL(window.location.href);
const pathname = url.pathname;
const id = pathname.split('/')[2];

display();

async function display() {
	try {
		const patient = await fetchInfo();
		if (patient) {
			console.log("PATIENT", patient);
			const title = document.getElementById("name");
			title.innerText = `${patient.prenomPers} ${patient.nomPers}`;

			// VISITES
			const visiteDiv = document.getElementById("visites");
			if (patient.visites.length > 0) {
				const table = document.createElement("table");
				table.className = "table table-hover table-striped";

				const thead = document.createElement("thead");
				const trHead = document.createElement("tr");

				const thDate = document.createElement("th");
				thDate.innerText = "Date";

				const thCompteRendu = document.createElement("th");
				thCompteRendu.innerText = "Compte Rendu";

				const thMedecin = document.createElement("th");
				thMedecin.innerText = "Médecin";

				trHead.appendChild(thDate);
				trHead.appendChild(thCompteRendu);
				trHead.appendChild(thMedecin);
				thead.appendChild(trHead);
				table.appendChild(thead);

				const tbody = document.createElement("tbody");

				patient.visites.forEach(v => {
					const trBody = document.createElement("tr");

					const tdDate = document.createElement("td");
					tdDate.innerText = v.dateVisite;

					const tdCompteRendu = document.createElement("td");
					tdCompteRendu.innerText = v.compteRendu;

					const tdMedecin = document.createElement("td");
					tdMedecin.innerText = `${v.medecin.prenomPers} ${v.medecin.nomPers}`;

					trBody.appendChild(tdDate);
					trBody.appendChild(tdCompteRendu);
					trBody.appendChild(tdMedecin);

					tbody.appendChild(trBody);
				});

				table.appendChild(tbody);
				visiteDiv.appendChild(table);
			} else {
				visiteDiv.innerText = `Ce patient n'a pas encore de visite pour le moment`;
			}

			// SOINS
			const soinsDiv = document.getElementById("soins");
			if (patient.soins.length > 0) {
				const table = document.createElement("table");
				table.className = "table table-hover table-striped";

				const thead = document.createElement("thead");
				const trHead = document.createElement("tr");

				const ths = [
					"Date et heure",
					"Description",
					"Infirmier responsable",
					"Date réunion",
					"Objet réunion",
					"Médecin réunion",
					"Infirmier réunion",
					"Actions"
				];

				ths.forEach(text => {
					const th = document.createElement("th");
					th.innerText = text;
					trHead.appendChild(th);
				});

				thead.appendChild(trHead);
				table.appendChild(thead);

				const tbody = document.createElement("tbody");

				patient.soins.forEach(s => {
					const trBody = document.createElement("tr");

					const tdDateHeure = document.createElement("td");
					tdDateHeure.innerText = s.dateHeureSoin;

					const tdDescription = document.createElement("td");
					tdDescription.innerText = s.descriptionSoin;

					const tdInfirmierRes = document.createElement("td");
					tdInfirmierRes.innerText = `${s.infirmier.prenomPers} ${s.infirmier.nomPers}`;

					const tdDateReunion = document.createElement("td");
					tdDateReunion.innerText = s.reunion.dateReunion;

					const tdObjetReunion = document.createElement("td");
					tdObjetReunion.innerText = s.reunion.objetReunion;

					const tdMedecinReunion = document.createElement("td");
					tdMedecinReunion.innerText = `${s.reunion.medecin.prenomPers} ${s.reunion.medecin.nomPers}`;

					const tdInfirmierReunion = document.createElement("td");
					tdInfirmierReunion.innerText = `${s.reunion.infirmier.prenomPers} ${s.reunion.infirmier.nomPers}`;

					const modifButton = document.createElement("button");
					modifButton.className = "btn btn-outline-primary btn-sm";
					modifButton.innerText = "Modifier";
					modifButton.onclick = () => {
						window.location.href = `/modifsoin/${s.idSoin}`;
					};

					const tdButton = document.createElement("td");
					tdButton.appendChild(modifButton);

					trBody.appendChild(tdDateHeure);
					trBody.appendChild(tdDescription);
					trBody.appendChild(tdInfirmierRes);
					trBody.appendChild(tdDateReunion);
					trBody.appendChild(tdObjetReunion);
					trBody.appendChild(tdMedecinReunion);
					trBody.appendChild(tdInfirmierReunion);
					trBody.appendChild(tdButton);

					tbody.appendChild(trBody);
				});

				table.appendChild(tbody);
				soinsDiv.appendChild(table);

			} else {
				soinsDiv.innerText = `Ce patient n'a pas encore reçu de soins pour le moment.`;
			}

			// ANTECEDENTS
			const antDiv = document.getElementById("antecedents");

			if (patient.antecedents.length > 0) {
				const table = document.createElement("table");
				table.className = "table table-hover table-striped";

				const thead = document.createElement("thead");
				const trHead = document.createElement("tr");

				const th1 = document.createElement("th");
				th1.innerText = `Type d'antécédent`;

				const th2 = document.createElement("th");
				th2.innerText = `Description`;

				const th3 = document.createElement("th");
				th3.innerText = `Date de déclaration`;

				trHead.appendChild(th1);
				trHead.appendChild(th2);
				trHead.appendChild(th3);
				thead.appendChild(trHead);
				table.appendChild(thead);

				const tbody = document.createElement("tbody");

				patient.antecedents.forEach(a => {
					const trBody = document.createElement("tr");

					const tdType = document.createElement("td");
					tdType.innerText = a.typeAntecedent;

					const tdDesc = document.createElement("td");
					tdDesc.innerText = a.descriptionAntecedent;

					const tdDate = document.createElement("td");
					tdDate.innerText = a.dateDeclaration;

					trBody.appendChild(tdType);
					trBody.appendChild(tdDesc);
					trBody.appendChild(tdDate);

					tbody.appendChild(trBody);
				});

				table.appendChild(tbody);
				antDiv.appendChild(table);

			} else {
				antDiv.innerText = `Ce patient n'a aucun antécédent.`;
			}

			const reunionButton = document.getElementById("addreunion");
			reunionButton.onclick = () => {
				window.location.href = `/addreunion/${patient.idPers}`;
			};

			const visiteButton = document.getElementById("addvisite");
			visiteButton.onclick = () => {
				window.location.href = `/addvisite/${patient.idPers}`;
			};
		}
	} catch (err) {
		console.error("Erreur display", err);
	}
}

async function fetchInfo() {

	try {
		const response = await fetch('/api/patient/' + id);
		if (!response.ok) throw new Error("Erreur lors de la recuperation des info patient coté client");

		const html = await response.json();
		return html
	} catch (error) {
		console.error("Erreuuuur", error);
	}
}
