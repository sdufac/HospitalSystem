const div = document.getElementById("patients");
display();

async function display(){
	try{
		const html = await fetchInfo();
		if(html){
			div.innerHTML = html;
		}
	}catch(err){
		console.error("Erreur display",err);
	}
}

async function fetchInfo(){
	const params = new URLSearchParams(window.location.search);
	const patientId = params.get('id');
	console.log("ID = " + patientId);

	try{
		const response = await fetch('/api/patient?id=' + patientId);
		if(!response.ok) throw new Erreur("Erreur lors de la recuperation des info patient coté client");

		const html = await response.text();
		return html
	}catch(error){
		console.error("Erreuuuur",error);
	}
}
