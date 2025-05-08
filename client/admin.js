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
			const sectionGestionChambres = document.getElementById("sectionGestionChambres");

			welcome.innerText = `Bienvenue ${admin.prenomPers} ${admin.nomPers} !`;
			if (admin.service) {
				service.innerText = `Service : ${admin.service}\nRôle : ${admin.role}`;
				await afficherChambres();
			} else {
				service.innerText = `Rôle : ${admin.role}`;
				sectionGestionChambres.remove();
			}

		}
	} catch (error) {
		console.error("Erreur admin", error);
	}

	// try {
	// 	const rooms = await fetchRooms();
	// 	if (rooms) {
	// 		const roomsTable = document.getElementById("rooms");
	// 		const trRoomName = document.createElement("tr");
	// 		const trRooms = document.createElement("tr");
	// 		roomsTable.appendChild(trRoomName);
	// 		roomsTable.appendChild(trRooms);

	// 		rooms.forEach(r => {
	// 			const thRoomName = document.createElement("th");
	// 			const tdRoom = document.createElement("td");

	// 			thRoomName.innerText = r.numChambre;
	// 			tdRoom.innerText = `${r.nbLitsOccupes}/${r.capacite}`
	// 			tdRoom.onclick = () => {
	// 				window.location = `/chambre/${r.idChambre}`;
	// 			}
	// 			tdRoom.style = "cursor: pointer;"


	// 			if (ecartDate(datedujour, r.dateNettoyage) > 2) {
	// 				tdRoom.className = "rouge";
	// 			}

	// 			trRoomName.appendChild(thRoomName);
	// 			trRooms.appendChild(tdRoom);
	// 		});
	// 	}
	// } catch (error) {
	// 	console.error("Erreur client patients", error);
	// }

	try {
		const sejourEC = await fetchSejourEC();
		const divEC = document.getElementById("sejourEC");
		if (sejourEC && sejourEC.length > 0) {
			const table = document.createElement("table");
			table.className = "table table-hover table-striped";

			const thead = document.createElement("thead");
			thead.innerHTML = `
      <tr>
        <th>Date admission</th>
        <th>Date sortie prévue</th>
        <th>Chambre</th>
        <th>Lit</th>
        <th>Patient</th>
        <th>Action</th>
      </tr>
    `;
			table.appendChild(thead);

			const tbody = document.createElement("tbody");

			sejourEC.forEach(s => {
				const tr = document.createElement("tr");
				tr.innerHTML = `
          <td>${s.dateAdmission}</td>
          <td>${s.dateSortiePrevue}</td>
          <td>${s.numChambre}</td>
          <td>${s.numLit}</td>
          <td>${s.prenomPers} ${s.nomPers}</td>
          <td><button class="btn btn-sm btn-primary" onclick="window.location.href='/chambre/${s.idChambre}?date=${datedujour}'">Voir</button></td>
        `;
				tbody.appendChild(tr);
			});

			table.appendChild(tbody);
			divEC.appendChild(table);

		} else {
			divEC.innerHTML += `<p class="text-muted">Aucun séjour en cours pour le moment.</p>`;
		}

	} catch (error) {
		console.error("Erreur affichage sejour en cours", error);
	}

	try {
		const sejourTermines = await fetchSejourTermines();
		const divTermines = document.getElementById("sejourTermines");

		if (sejourTermines && sejourTermines.length > 0) {
			const table = document.createElement("table");
			table.className = "table table-hover table-striped";

			const thead = document.createElement("thead");
			thead.innerHTML = `
								<tr>
									<th>Date admission</th>
									<th>Date sortie prévue</th>
									<th>Date sortie réelle</th>
									<th>Chambre</th>
									<th>Lit</th>
									<th>Patient</th>
									<th>Action</th>
								</tr>
								`;
			table.appendChild(thead);

			const tbody = document.createElement("tbody");

			sejourTermines.forEach(s => {
				const tr = document.createElement("tr");
				tr.innerHTML = `
								<td>${s.dateAdmission}</td>
								<td>${s.dateSortiePrevue}</td>
								<td>${s.dateSortieReelle ? s.dateSortieReelle : "-"}</td>
								<td>${s.numChambre}</td>
								<td>${s.numLit}</td>
								<td>${s.prenomPers} ${s.nomPers}</td>
								<td><button class="btn btn-sm btn-primary" onclick="window.location.href='/chambre/${s.idChambre}?date=${s.dateSortieReelle || s.dateSortiePrevue}'">Voir</button></td>
								`;
				tbody.appendChild(tr);
			});

			table.appendChild(tbody);
			divTermines.appendChild(table);

		} else {
			divTermines.innerHTML += `<p class="text-muted">Aucun séjour terminé à afficher.</p>`;
		}

	} catch (error) {
		console.error("Erreur affichage séjour partis", error);
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

async function fetchSejourTermines() {
	try {
		const response = await fetch('/api/sejour/partis');
		if (!response.ok) {
			throw new Error('Erreur récupération séjours partis');
		}
		return await response.json();
	} catch (error) {
		console.error("Erreur fetch sejours partis", error);
	}
}

async function afficherChambres() {
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
}
