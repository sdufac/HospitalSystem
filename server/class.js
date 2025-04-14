class Personne {
	constructor(idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers) {
		this.idPers = idPers;
		this.nomPers = nomPers;
		this.prenomPers = prenomPers;
		this.dNaisPers = dNaisPers;
		this.numTelPers = numTelPers;
		this.adressePers = adressePers;
	}
}

class Visite {
	constructor(idVisite, dateVisite, compteRendu) {
		this.idVisite = idVisite;
		this.dateVisite = dateVisite;
		this.compteRendu = compteRendu;
	}
}

class Patient extends Personne {
	constructor(idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers, numDossierMed, motifHospitalisation) {
		super(idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers);
		this.numDossierMed = numDossierMed;
		this.motifHospitalisation = motifHospitalisation;
		this.visites = [];
	}

	ajouterVisite(visite) {
		this.visites.push(visite);
	}
}

class Medecin extends Personne {
	constructor(idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers, specialite, mdp, idService) {
		super(idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers);
		this.specialite = specialite;
		this.mdp = mdp;
		this.idService = idService;
		this.patients = []; // Tableau d'objets Patient
	}

	ajouterPatient(patient) {
		this.patients.push(patient);
	}
}

module.exports = {Personne, Patient, Visite, Medecin};
