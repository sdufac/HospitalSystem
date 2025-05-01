const url = new URL(window.location.href);
const pathname = url.pathname;
const id = pathname.split('/')[2];

display();

async function display(){
	try{
		const patient = await fetchInfo();
		if(patient){
			console.log("PATIENT",patient);
			const title = document.getElementById("name");
			title.innerText = `${patient.prenomPers} ${patient.nomPers}`;

			const visiteDiv = document.getElementById("visites");
			if(patient.visites.length > 0){
				const table = document.createElement("table");
				const th = document.createElement("tr");

				const td1 = document.createElement("th");
				td1.innerText ="Date";

				const td2 = document.createElement("th");
				td2.innerText ="Compte Rendu";

				const td3 = document.createElement("th");
				td3.innerText ="Medecin";

				th.appendChild(td1);
				th.appendChild(td2);
				th.appendChild(td3);

				table.appendChild(th);

				patient.visites.forEach(v => {
					const footr = document.createElement("tr");

					const footddate = document.createElement("td");
					footddate.innerText = v.dateVisite;

					const fooCompteRendu = document.createElement("td");
					fooCompteRendu.innerText = v.compteRendu;

					const fooMedecin = document.createElement("td");
					fooMedecin.innerText = `${v.medecin.prenomPers} ${v.medecin.nomPers}`;

					footr.appendChild(footddate);
					footr.appendChild(fooCompteRendu);
					footr.appendChild(fooMedecin);

					table.appendChild(footr);
				});

				visiteDiv.appendChild(table);
			}else{
				visiteDiv.innerText = `Ce patient n'a pas encore de visite pour le moment`;
			}

			const soinsDiv = document.getElementById("soins");
			if(patient.soins.length > 0){
				const table = document.createElement("table");
				const th = document.createElement("tr");

				const td1 = document.createElement("th");
				td1.innerText ="Date et heure";

				const td2 = document.createElement("th");
				td2.innerText ="Description";

				const td3 = document.createElement("th");
				td3.innerText ="Infirmier responsable";

				const td4 = document.createElement("th");
				td3.innerText ="Date réunion";

				const td5 = document.createElement("th");
				td3.innerText ="Objet réunion";

				const td6 = document.createElement("th");
				td3.innerText ="Medecin réunion";

				const td7 = document.createElement("th");
				td3.innerText ="Infirmier réunion";

				th.appendChild(td1);
				th.appendChild(td2);
				th.appendChild(td3);
				th.appendChild(td4);
				th.appendChild(td5);
				th.appendChild(td6);
				th.appendChild(td7);

				table.appendChild(th);

				patient.soins.forEach(s => {
					const footr = document.createElement("tr");

					const footddateheure = document.createElement("td");
					footddateheure.innerText = s.dateHeureSoin;

					const fooDescription = document.createElement("td");
					fooDescription.innerText = s.descriptionSoin;

					const fooInfirmierRes = document.createElement("td");
					fooInfirmierRes.innerText = `${s.infirmier.prenomPers} ${s.infirmier.nomPers}`;

					const fooDateReunion = document.createElement("td");
					fooDateReunion.innerText = s.reunion.dateReunion;

					const fooObjetReunion = document.createElement("td");
					fooObjetReunion.innerText = s.reunion.objetReunion;

					const fooMedecinReunion = document.createElement("td");
					fooMedecinReunion.innerText = `${s.reunion.medecin.prenomPers} ${s.reunion.medecin.nomPers}`;

					const fooInfirmierReunion = document.createElement("td");
					fooInfirmierReunion.innerText = `${s.reunion.infirmier.prenomPers} ${s.reunion.infirmier.nomPers}`;

					const modifButton = document.createElement("button");
					modifButton.innerText = "modifier";
					modifButton.onclick = () =>{
						window.location.href = `/modifsoin/${s.idSoin}`;
					}

					footr.appendChild(footddateheure);
					footr.appendChild(fooDescription);
					footr.appendChild(fooInfirmierRes);
					footr.appendChild(fooDateReunion);
					footr.appendChild(fooObjetReunion);
					footr.appendChild(fooMedecinReunion);
					footr.appendChild(fooInfirmierReunion);
					footr.appendChild(modifButton);

					table.appendChild(footr);
				});

				soinsDiv.appendChild(table);
			}else{
				soinsDiv.innerText = `Ce patient n'a pas encore reçu de soins pour le moment.`;
			}

			const antDiv = document.getElementById("antecedents");
			if(patient.antecedents.length > 0){
				const table = document.createElement("table");
				const tr = document.createElement("tr");

				const th1 = document.createElement("th");
				th1.innerText = `Type d'antecedent`;

				const th2 = document.createElement("th");
				th2.innerText = `Description`;

				const th3 = document.createElement("th");
				th3.innerText = `Date de déclaration`;

				tr.appendChild(th1);
				tr.appendChild(th2);
				tr.appendChild(th3);
				table.appendChild(tr);

				patient.antecedents.forEach(a => {
					const footr = document.createElement("tr");

					const footd1 = document.createElement("td");
					footd1.innerText = a.typeAntecedent;

					const footd2 = document.createElement("td");
					footd2.innerText = a.descriptionAntecedent;

					const footd3 = document.createElement("td");
					footd3.innerText = a.dateDeclaration;

					footr.appendChild(footd1);
					footr.appendChild(footd2);
					footr.appendChild(footd3);

					table.appendChild(footr);
				});
				antDiv.appendChild(table);
			}else{
				antDiv.innerText = `Ce patient n'a aucun antecedent.`
			}
			const reunionButton = document.getElementById("addreunion");
			reunionButton.onclick = () =>  {
				window.location.href = `/addreunion/${patient.idPers}`;
			};

			const visiteButton = document.getElementById("addvisite");
			visiteButton.onclick = () => {
				window.location.href=`/addvisite/${patient.idPers}`;
			};
		}
	}catch(err){
		console.error("Erreur display",err);
	}
}

async function fetchInfo(){

	try{
		const response = await fetch('/api/patient/' + id);
		if(!response.ok) throw new Erreur("Erreur lors de la recuperation des info patient coté client");

		const html = await response.json();
		return html
	}catch(error){
		console.error("Erreuuuur",error);
	}
}
