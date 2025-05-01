const dateInput = document.getElementById("date");
const button = document.getElementById("search");
form();

button.addEventListener("click",async function() {
	try{
		const chambre = await fetchRoomInfo(dateInput.value);
		if(chambre){
			const div = document.getElementById("chambre");
			chambre.lits.forEach(l => {
				const divLit = document.createElement("div");

				const header = document.createElement("h2");
				header.innerHTML =`Lit ${l.numLit}:`; 

				divLit.appendChild(header);

				if(l.sejour){
					const p = document.createElement("p");
					p.innerHTML = `${l.sejour.prenomPers} ${l.sejour.nomPers}<br>
							 Date d'arrivée: ${l.sejour.dateAdmission}<br>`;
					
					
					if(l.sejour.dateSortieReelle){
						p.innerHTML += `Date de sortie réelle: ${l.sejour.dateSortieReelle}`;
					}else{
						const params = new URLSearchParams(window.location.search);
						const id = params.get("id");

						p.innerHTML += `<form method="POST" action="/sejour">
							<input type="hidden" value="${l.sejour.idSejour}" id="id" name="id">
							<input type="hidden" value="${id}" id="idchambre" name="idchambre">
							<label for="date">Date de sortie: </label>
							<input type="date" name="date" id="date">
							<input type="submit" value="Confirmer">
						</form></br>`;
					}
					divLit.appendChild(p);
				}else{
					const p = document.createElement("p");
					p.innerText = "Aucun patient n'occupe le lit actuellement.";
					divLit.appendChild(p);
				}
				div.appendChild(divLit);
			})
		}
	}
	catch(err){
		console.error("Erreur info chambre",err);
	}
});

async function form(){
	try{
		const persnet = await fetchPerNet();
		if(persnet){
			const datalist = document.getElementById("mpers");
			const persinput = document.getElementById("mpersinput");
			const idPers = document.getElementById("idpmenage");
			const idChambre = document.getElementById("idchambre");
			const date = document.getElementById("datem");

			const params = new URLSearchParams(window.location.search);
			const id = params.get("id");
			idChambre.value = id;

			const ajd = new Date();
			const yyyy = ajd.getFullYear();
			const mm = String(ajd.getMonth() + 1).padStart(2, '0');
			const dd = String(ajd.getDate()).padStart(2, '0');
			const datestring = `${yyyy}-${mm}-${dd}`;
			date.value= datestring;
			console.log(date.value);

			persnet.forEach(pers => {
				const opt = document.createElement("option");
				opt.value = `${pers.prenomPers} ${pers.nomPers}`;

				datalist.appendChild(opt);
			});

			persinput.addEventListener("input", () => {
				let value = persinput.value;

				const[prenom,nom] = value.split(" ");

				const foo = persnet.find(p => {
					return p.prenomPers === prenom && p.nomPers=== nom;
				});

				if(foo)idPers.value = foo.idPers;
			});


		}
	}catch(error){
		console.error(error);
	}
	
	try{
		const patients = await fetchPatients();
		if(patients){
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

				const[prenom,nom] = value.split(" ");

				const foo = patients.find(p => {
					return p.prenomPers === prenom && p.nomPers=== nom;
				});

				if(foo)hiddenidpatient.value = foo.idPers;
			});
		}
	}catch(error){
		console.error(error);
	}

	try{
		const lits = await fetchLits();
		if(lits){
			const selectLit = document.getElementById("lit");
			const idLit = document.getElementById("sidlit");

			lits.forEach(l => {
				const opt = document.createElement("option");
				opt.value = l.idLit;
				opt.innerHTML = l.numLit;

				selectLit.appendChild(opt);
			});

		}
	}catch(error){
		console.error(error);
	}
}

async function fetchRoomInfo(date){
	const params = new URLSearchParams(window.location.search);
	const roomId = params.get("id");

	try{
		const response = await fetch(`/api/chambre/${roomId}/sejour/${date}`)
		if(!response.ok) throw new Error("Erreur lors de la recuperation des info de la chambre");

		const chambre = await response.json();

		return chambre;
	}
	catch(error){
		console.error("Erreuuuur",error);
	}
}

async function fetchPerNet(){
	try{
		const response = await fetch('/api/nettoyage');
		if(!response.ok){
			throw new Error ("Erreur recuperation personnelle de nettoyage");
		}

		const persnet = await response.json();

		return persnet;
	}catch(error){
		console.error("Erreur fetch persont",error);
	}
}

async function fetchPatients(){
	try{
		const response = await fetch('/api/patients');
		if(!response.ok){
			throw new Error ("Erreur recup patient");
		}

		const patients = await response.json();

		return patients;
	}catch(error){
		console.error("Erreur lors de la récuperation des patients",error);
	}
}

async function fetchLits(){
	try{
		const params = new URLSearchParams(window.location.search);
		const roomId = params.get("id");
		
		const response = await fetch(`api/chambre/${roomId}`);
		if(!response.ok){
			throw new Error ("Erreur recup lit");
		}

		const lits = await response.json();

		return lits;
	}catch(error){
		console.error("Erreur lors de la récuperation des lits",error);
	}
}
