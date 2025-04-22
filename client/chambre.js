const dateInput = document.getElementById("date");
const button = document.getElementById("search");

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
