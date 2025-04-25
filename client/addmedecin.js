form();

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
		const response = await fetch('/api/getservice');
		if(!response.ok){
			throw new Error('Erreur recuperation medicaments');
		}

		const services = await response.json();

		return services;
	}catch(error){
		console.error("Erreur services", error);
	}
}
