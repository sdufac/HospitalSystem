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

form();

async function form(){
	try{
		const infirmiers = await fetchInfirmiers();
		const medicaments = await fetchMedicaments();

		if(infirmiers && medicaments){

			idpatient.value = id;
			formdate.value = date;

			infirmiers.forEach(infirmier => {
				const opt = document.createElement("option");
				opt.value= `${infirmier.prenomPers} ${infirmier.nomPers}`;

				const opt2 = document.createElement("option");
				opt2.value= `${infirmier.prenomPers} ${infirmier.nomPers}`;

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

				const[prenom,nom] = value.split(" ");

				const foo = infirmiers.find(inf => {
					return inf.prenomPers === prenom && inf.nomPers=== nom;
				});

				if(foo)idtag1.value = foo.idPers;
			});

			input2.addEventListener("input", () => {
				let value = input2.value;

				const[prenom,nom] = value.split(" ");

				const foo = infirmiers.find(inf => {
					return inf.prenomPers === prenom && inf.nomPers=== nom;
				});

				if(foo)idtag2.value = foo.idPers;
			});

			medicamentinput.addEventListener("input", () => {
				let value = medicamentinput.value;
				const foo = medicaments.find(med => {
					return med.nomMedicament === value;
				})

				if(foo){
					idmedicament.value = foo.idMedicament;
					console.log("Id du medicament selectionné: " + idmedicament.value);
				}
			})

		}
	}catch(error){
		console.error("Erreur client medecin", error);
	}
}

async function fetchInfirmiers(){
	try{
		const response = await fetch('/api/infirmiers');
		if(!response.ok){
			throw new Error('Erreur recuperation infirmiers');
		}

		const infirmiers = await response.json();

		return infirmiers
	}catch(error){
		console.error("Erreur infirmiers", error);
	}
}

async function fetchMedicaments(){
	try{
		const response = await fetch('/api/medicaments');
		if(!response.ok){
			throw new Error('Erreur recuperation medicaments');
		}

		const medicaments = await response.json();

		return medicaments
	}catch(error){
		console.error("Erreur medicaments", error);
	}
}
