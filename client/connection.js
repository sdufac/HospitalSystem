const form = document.getElementById("form");
form.addEventListener('submit', function (e) {
	if (!formulaireComplet(form)) {
		e.preventDefault();
	}
});

// Afficher un message d'erreur si besoin
const params = new URLSearchParams(window.location.search);
if (params.has('error')) {
	const errorDiv = document.getElementById('errorMessage');
	if (errorDiv) {
		errorDiv.style.display = 'block';
	}
}

function formulaireComplet(form) {
	const elements = form.querySelectorAll('input, textarea, select');
	for (let el of elements) {
		if (el.type !== 'submit' && el.type !== 'button' && !el.disabled && el.offsetParent !== null && !el.value.trim()) {
			return false;
		}
	}
	return true;
}
