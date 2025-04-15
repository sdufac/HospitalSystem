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
	}
}

class Medecin extends Personne {
	constructor(idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers, specialite, mdp, service) {
		super(idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers);
		this.specialite = specialite;
		this.mdp = mdp;
		this.service = service;
	}
}

module.exports = {Personne, Patient, Visite, Medecin};
