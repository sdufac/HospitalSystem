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
	const pathParts = window.location.pathname.split('/');
	const patientId = pathParts[pathParts.length - 1];

	try{
		const response = await fetch('/api/patient/' + patientId);
		if(!response.ok) throw new Erreur("Erreur lors de la recuperation des info patient coté client");

		const html = await response.text();
		return html
	}catch(err){
		console.error("Erreuuuur",err);
	}
}
