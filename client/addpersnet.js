const formulaire = document.getElementById("form");
formulaire.addEventListener('submit',function(e) {
	if(!formulaireComplet(formulaire)){
		e.preventDefault();
	}
});

function formulaireComplet(form) {
	const elements = form.querySelectorAll('input, textarea, select');
	for (let el of elements) {
		if(el.type !== 'submit' && el.type !== 'button' && !el.disabled && !el.value.trim()) {
			return false;
		}
	}
	return true;
}
