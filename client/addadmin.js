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

async function form(){
	try{
		const services = await fetchServices();
		if(services){
			const select = document.getElementById("service");

			services.forEach(s => {
				const opt = document.createElement("option");
				opt.value = s.idService;
				opt.innerText = s.nomService;

				select.appendChild(opt);
			});
		}
	}catch(err){
		console.error(err);
	}
}

async function fetchServices(){
	try{
		const response = await fetch('/api/service');
		if(!response.ok){
			throw new Error('Erreur recuperation medicaments');
		}

		const services = await response.json();

		return services;
	}catch(error){
		console.error("Erreur services", error);
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
