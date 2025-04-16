const idmedecin = document.getElementById("idmedecin");
const idpatient = document.getElementById("idpatient");
const formdate = document.getElementById("formdate");
const divdate = document.getElementById("date");
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

//Date du jour en on format pour la bdd
const ajd = new Date();
const yyyy = ajd.getFullYear();
const mm = String(ajd.getMonth() + 1).padStart(2, '0');
const dd = String(ajd.getDate()).padStart(2, '0');
const date = `${yyyy}-${mm}-${dd}`;
console.log("DATE =" + date);

form();

async function form(){
	try{
		const medecin = await fetchMedecin();
		if(medecin){

			divdate.innerHTML = "Visite du " + ajd;
			idmedecin.value = medecin.idPers;
			idpatient.value = id;
			formdate.value = date;
		}
	}catch(error){
		console.error("Erreur client medecin", error);
	}
}
async function fetchMedecin(){
	try{
		const response = await fetch('/api/getmedecin');
		if(!response.ok){
			throw new Error('Erreur recuperation medecin');
		}

		const medecin = await response.json();

		return medecin
	}catch(error){
		console.error("Erreur medecin", error);
	}
}
