const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mois: 0-11, donc +1
const dd = String(today.getDate()).padStart(2, '0');
const datedujour = `${yyyy}-${mm}-${dd}`;
display();

async function display() {
	try {
		const admin = await fetchAdmin();
		if (admin) {
			const welcome = document.getElementById("welcome");
			const service = document.getElementById("service");

			welcome.innerText = `Bienvenue ${admin.prenomPers} ${admin.nomPers} !`;
			service.innerText = `Service : ${admin.service} 
								 Rôle : ${admin.role}`;
		}
		if (admin.role === 'Responsable') {
			document.getElementById("btnAddAdmin").classList.remove("d-none");
		}
	} catch (error) {
		console.error("Erreur admin", error);
	}

	try {
		const rooms = await fetchRooms();
		if (rooms) {
			const roomsTable = document.getElementById("rooms");
			const trRoomName = document.createElement("tr");
			const trRooms = document.createElement("tr");
			roomsTable.appendChild(trRoomName);
			roomsTable.appendChild(trRooms);

			rooms.forEach(r => {
				const thRoomName = document.createElement("th");
				const tdRoom = document.createElement("td");

				thRoomName.innerText = r.numChambre;
				tdRoom.innerText = `${r.nbLitsOccupes}/${r.capacite}`
				tdRoom.onclick = () => {
					window.location = `/chambre/${r.idChambre}`;
				}
				tdRoom.style = "cursor: pointer;"


				if (ecartDate(datedujour, r.dateNettoyage) > 2) {
					tdRoom.className = "rouge";
				}

				trRoomName.appendChild(thRoomName);
				trRooms.appendChild(tdRoom);
			});
		}
	} catch (error) {
		console.error("Erreur client patients", error);
	}

	try {
		const sejoursEC = await fetchSejourEC();
		const div = document.getElementById("sejourEC");
		if (sejoursEC) {
			const table = document.createElement("table");
			sejoursEC.forEach(s => {
				const tr = document.createElement("tr");

				const td1 = document.createElement("td");
				td1.innerText = s.dateAdmission;


				const td2 = document.createElement("td");
				td2.innerText = s.dateSortiePrevue;

				const td3 = document.createElement("td");
				td3.innerText = s.numChambre;

				const td4 = document.createElement("td");
				td4.innerText = s.numLit;

				const td5 = document.createElement("td");
				td5.innerText = s.prenomPers + " " + s.nomPers;

				const td6 = document.createElement("td");
				const button = document.createElement("button");
				button.innerText = "Voir";
				button.onclick = () => {
					window.location.href = `/chambre/${s.idChambre}?date=${datedujour}`;
				}
				td6.appendChild(button);

				tr.appendChild(td1);
				tr.appendChild(td2);
				tr.appendChild(td3);
				tr.appendChild(td4);
				tr.appendChild(td5);
				tr.appendChild(td6);
				table.appendChild(tr);
			});
			div.appendChild(table);
		}
	} catch (error) {
		console.error("Erreur affichage sejour en cours", error);
	}
}

async function fetchRooms() {
	try {
		const response = await fetch('/api/chambres');

		if (!response.ok) {
			throw new Error('Erreur recuperation données des chambres');
		}

		const rooms = await response.json();

		return rooms;
	} catch (error) {
		console.error("Erreuuur", error);
	}
}

async function fetchAdmin() {
	try {
		const response = await fetch('/api/getadmin');
		if (!response.ok) {
			throw new Error('Erreur recuperation admin');
		}

		const admin = await response.json();

		return admin;
	} catch (error) {
		console.error("Erreur admin", error);
	}
}

function ecartDate(date1, date2) {
	const date11 = new Date(date1);
	const date22 = new Date(date2);

	const diff = Math.abs(date11 - date22);

	const diffJour = diff / (1000 * 60 * 60 * 24);

	return diffJour;
}

async function fetchSejourEC() {
	try {
		const response = await fetch('/api/sejour/encours');
		if (!response.ok) {
			throw new Error('Erreur recuperation sejour en cours');
		}

		const sejours = await response.json();
		return sejours;
	} catch (error) {
		console.error("Erreur sejour en cours", error);
	}
}
