const dateInput = document.getElementById("date");
const button = document.getElementById("search");
form();

button.addEventListener("click",async function() {
	try{
		const html = await fetchRoomInfo(dateInput.value);
		if(html){
			const div = document.getElementById("chambre");
			div.innerHTML = html;
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
}

async function fetchRoomInfo(date){
	const params = new URLSearchParams(window.location.search);
	const roomId = params.get("id");

	try{
		const response = await fetch(`/api/chambre?id=${roomId}&date=${date}`)
		if(!response.ok) throw new Error("Erreur lors de la recuperation des info de la chambre");

		const html = await response.text();

		return html;
	}
	catch(error){
		console.error("Erreuuuur",error);
	}
}

async function fetchPerNet(){
	try{
		const response = await fetch('/api/getpersnet');
		if(!response.ok){
			throw new Error ("Erreur recuperation personnelle de nettoyage");
		}

		const persnet = await response.json();

		return persnet;
	}catch(error){
		console.error("Erreur fetch persont",error);
	}
}
