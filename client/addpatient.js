const formulaire = document.getElementById("form");
if (formulaire) {
	console.log("FORM");
}
formulaire.addEventListener('submit', function (e) {
	if (!formulaireComplet(formulaire)) {
		e.preventDefault();
	}
});

function formulaireComplet(form) {
	const elements = form.querySelectorAll('input, textarea, select');
	for (let el of elements) {
		if (el.type !== 'submit' && el.type !== 'button' && !el.disabled && el.offsetParent !== null && !el.value.trim()) {
			return false;
		}
	}
	return true;
}

function addAntecedent() {
	const div = document.getElementById("antecedantsDiv");

	const bouton = div.querySelector('button');

	const card = document.createElement("div");
	card.className = "card p-3 mb-3 shadow-sm position-relative"; // position-relative pour placer un bouton en haut à droite

	const btnDelete = document.createElement("button");
	btnDelete.type = "button";
	btnDelete.className = "btn btn-sm btn-danger position-absolute top-0 end-0 m-2";
	btnDelete.innerHTML = "&times;"; // croix de fermeture
	btnDelete.onclick = function () {
		card.remove();
	};

	const cardBody = document.createElement("div");
	cardBody.className = "card-body";

	const labelType = document.createElement("label");
	labelType.textContent = "Type d'antécédent :";
	labelType.className = "form-label";

	const typeAntecedent = document.createElement("input");
	typeAntecedent.type = "text";
	typeAntecedent.name = "typeantecedent[]";
	typeAntecedent.className = "form-control mb-2";

	const labelDescription = document.createElement("label");
	labelDescription.textContent = "Description de l'antécédent :";
	labelDescription.className = "form-label";

	const descriptionAntecedent = document.createElement("input");
	descriptionAntecedent.type = "text";
	descriptionAntecedent.name = "descriptionantecedent[]";
	descriptionAntecedent.className = "form-control mb-2";

	const labelDate = document.createElement("label");
	labelDate.textContent = "Date de déclaration :";
	labelDate.className = "form-label";

	const dateAntecedent = document.createElement("input");
	dateAntecedent.type = "date";
	dateAntecedent.name = "dateantecedent[]";
	dateAntecedent.className = "form-control";

	cardBody.appendChild(labelType);
	cardBody.appendChild(typeAntecedent);
	cardBody.appendChild(labelDescription);
	cardBody.appendChild(descriptionAntecedent);
	cardBody.appendChild(labelDate);
	cardBody.appendChild(dateAntecedent);

	card.appendChild(btnDelete);
	card.appendChild(cardBody);

	div.insertBefore(card, bouton.parentElement);
}


