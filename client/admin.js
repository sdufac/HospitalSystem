display();

async function display(){
	try{
		const admin = await fetchAdmin();
		//TODO nom prenom service etc
	}catch(error){
		console.error("Erreur admin", error);
	}

	try{
		const rooms = await fetchRooms();
		if(rooms){
			const roomsTable = document.getElementById("rooms");
			const trRoomName = document.createElement("tr");
			const trRooms = document.createElement("tr");
			roomsTable.appendChild(trRoomName);
			roomsTable.appendChild(trRooms);

			rooms.forEach(r =>{
				const thRoomName = document.createElement("th");
				const tdRoom = document.createElement("td");

				thRoomName.innerText = r.numChambre;
				tdRoom.innerText = `${r.nbLitsOccupes}/${r.capacite}`
				tdRoom.onclick = () =>{
					window.location = `/chambre?id=${r.idChambre}`;
				}
				tdRoom.style ="cursor: pointer;"
				
				const today = new Date();
				const yyyy = today.getFullYear();
				const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mois: 0-11, donc +1
				const dd = String(today.getDate()).padStart(2, '0');
				const datedujour = `${yyyy}-${mm}-${dd}`;

				if(ecartDate(datedujour,r.dateNettoyage) > 2){
					tdRoom.className = "rouge";
				}

				trRoomName.appendChild(thRoomName);
				trRooms.appendChild(tdRoom);
			});
		}
	}catch(error){
		console.error("Erreur client patients", error);
	}
}

async function fetchRooms(){
	try{
		const response = await fetch('/api/getrooms');

		if(!response.ok){
			throw new Error('Erreur recuperation données des chambres');
		}

		const rooms = await response.json();

		return rooms;
	}catch(error){
		console.error("Erreuuur", error);
	}
}

async function fetchAdmin(){
	try{
		const response = await fetch('/api/getadmin');
		if(!response.ok){
			throw new Error('Erreur recuperation admin');
		}

		const admin = await response.json();

		return admin;
	}catch(error){
		console.error("Erreur admin", error);
	}
}

function ecartDate(date1,date2){
	const date11 = new Date(date1);
	const date22 = new Date(date2);

	const diff = Math.abs(date11- date22);

	const diffJour = diff / (1000 * 60 * 60 * 24);

	return diffJour;
}
