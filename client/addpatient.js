const formulaire = document.getElementById("form");
if(formulaire){
	console.log("FORM");
}
formulaire.addEventListener('submit',function(e) {
	if(!formulaireComplet(formulaire)){
		e.preventDefault();
	}
});

function formulaireComplet(form) {
	const elements = form.querySelectorAll('input, textarea, select');
	for (let el of elements) {
		if(el.type !== 'submit' && el.type !== 'button' && !el.disabled && el.offsetParent !== null && !el.value.trim()) {
			return false;
		}
	}
	return true;
}

function addAntecedent(){
	const div = document.getElementById("antecedantsDiv");
	const newDiv = document.createElement("div");
	newDiv.className = "mb-3";

	const labelType = document.createElement("label");
	labelType.textContent = "Type d'antecedent :";
	labelType.className = "form-label";

	const typeAntecedent = document.createElement("input");
	typeAntecedent.type = "text";
	typeAntecedent.name = "typeantecedent[]";
	typeAntecedent.className = "form-control";

	const labelDescription = document.createElement("label");
	labelDescription.textContent = "Description de l'antecedant :";
	labelDescription.className = "form-label";

	const descriptionAntecedent = document.createElement("input");
	descriptionAntecedent.type = "text";
	descriptionAntecedent.name = "descriptionantecedent[]";
	descriptionAntecedent.className = "form-control";

	const labelDate = document.createElement("label");
	labelDate.textContent = "Date de déclaration :";
	labelDate.className = "form-label";

	const dateAntecedent = document.createElement("input");
	dateAntecedent.type = "date";
	dateAntecedent.name = "dateantecedent[]";
	dateAntecedent.className = "form-control";

	newDiv.appendChild(labelType);
	newDiv.appendChild(typeAntecedent);
	newDiv.appendChild(labelDescription);
	newDiv.appendChild(descriptionAntecedent);
	newDiv.appendChild(labelDate);
	newDiv.appendChild(dateAntecedent);
	div.appendChild(newDiv);
}
