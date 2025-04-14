const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./database.db', (err) => {
	if (err) {
    		console.error('Erreur lors de la connexion a la base de données', err.message);
  	} else {
    		console.log('Connecté a la base de données');

		db.serialize(() => {
			db.run(
				'PRAGMA foreign_keys = ON;'
			);
			
			db.run(
				`CREATE TABLE IF NOT EXISTS Personne (
				    idPers      INTEGER PRIMARY KEY AUTOINCREMENT,
				    nomPers     TEXT    NOT NULL,
				    prenomPers  TEXT    NOT NULL,
				    dNaisPers   TEXT    CHECK(dNaisPers GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),
				    numTelPers  TEXT,
				    adressePers TEXT
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Medecin (
				idPers      INTEGER PRIMARY KEY,
				specialite  TEXT    NOT NULL,
				-- On peut imposer des spécialisations autorisées :
				-- CHECK(specialite IN ('Cardiologie','Chirurgie','Neurologie')),
				mdp         TEXT    NOT NULL,
				idService   INTEGER NOT NULL,

				FOREIGN KEY (idPers) REFERENCES Personne(idPers) ON DELETE CASCADE,
				FOREIGN KEY (idService) REFERENCES Service(idService) ON DELETE RESTRICT -- La suppression d'un service est non autorisée si un médecin y est assigné
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Infirmier (
				idPers          INTEGER PRIMARY KEY,
				datePrisePoste  TEXT CHECK(datePrisePoste GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),
				idService       INTEGER NOT NULL,

				FOREIGN KEY (idPers) REFERENCES Personne(idPers) ON DELETE CASCADE,
				FOREIGN KEY (idService) REFERENCES Service(idService) ON DELETE RESTRICT -- La suppression d'un service est non autorisée si un infermier y est assigné
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS PersonnelAdmin (
				idPers  INTEGER PRIMARY KEY,
				mdp     TEXT,
				role    TEXT,
				-- CHECK(role IN ('Responsable','Adjoint','ChefDeService','Autre'))--
				datePrisePoste TEXT CHECK(datePrisePoste GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),

				FOREIGN KEY (idPers) REFERENCES Personne(idPers) ON DELETE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS PersonnelNettoyage (
				idPers          INTEGER PRIMARY KEY,
				role            TEXT,
				--CHECK(role IN ('Technicien','AgentEntretien','Autre'))
				datePrisePoste  TEXT CHECK(datePrisePoste GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),

				FOREIGN KEY (idPers) REFERENCES Personne(idPers) ON DELETE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Patient (
				idPers                  INTEGER PRIMARY KEY,
				numDossierMed           TEXT    UNIQUE,
				motifHospitalisation    TEXT,

				FOREIGN KEY (idPers) REFERENCES Personne(idPers) ON DELETE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Service (
				idService       INTEGER PRIMARY KEY AUTOINCREMENT,
				nomService      TEXT,
				etageService    INTEGER,
				idMedecinRef    INTEGER NOT NULL,
				idAdminRes      INTEGER NOT NULL,

				FOREIGN KEY (idMedecinRef) REFERENCES Medecin(idPers) ON DELETE RESTRICT ON UPDATE CASCADE,
				FOREIGN KEY (idAdminRes) REFERENCES PersonnelAdmin(idPers) ON DELETE RESTRICT ON UPDATE CASCADE
				-- on suppose que chaque Service a 1 médecin référent et 1 admin responsable. 
				-- “RESTRICT” empêche la suppression du médecin s’il est référent d’un service.
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Chambre (
				idChambre   INTEGER PRIMARY KEY AUTOINCREMENT,
				numChambre  TEXT UNIQUE NOT NULL,
				capacite    INTEGER NOT NULL CHECK (capacite IN (2, 4, 6)),
				idService   INTEGER NOT NULL,

				FOREIGN KEY (idService) REFERENCES Service(idService) ON DELETE CASCADE ON UPDATE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Lit (
				idLit       INTEGER PRIMARY KEY AUTOINCREMENT,
				numLit      TEXT UNIQUE NOT NULL,
				idChambre   INTEGER NOT NULL,

				FOREIGN KEY (idChambre) REFERENCES Chambre(idChambre) ON DELETE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Sejour (
				idSejour            INTEGER PRIMARY KEY AUTOINCREMENT,
				dateAdmission       TEXT CHECK(dateAdmission GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),
				dateSortiePrevue    TEXT CHECK(dateSortiePrevue GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),
				dateSortieReelle    TEXT CHECK(dateSortieReelle GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),

				idPatient           INTEGER NOT NULL,
				idLit               INTEGER NOT NULL,
				idAdminAffectation  INTEGER NOT NULL,

				FOREIGN KEY (idPatient) REFERENCES Patient(idPers) ON DELETE SET NULL ON UPDATE CASCADE,
				FOREIGN KEY (idLit) REFERENCES Lit(idLit) ON DELETE SET NULL  
								      ON UPDATE CASCADE, 
				FOREIGN KEY (idAdminAffectation) REFERENCES PersonnelAdmin(idPers) ON DELETE SET NULL
				-- SET NULL pour garde l'historique 
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Visite (
				idVisite    INTEGER PRIMARY KEY AUTOINCREMENT,
				dateVisite  TEXT CHECK(dateVisite GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),
				compteRendu TEXT,

				idMedecin   INTEGER NOT NULL,
				idPatient   INTEGER NOT NULL,

				FOREIGN KEY (idMedecin) REFERENCES Medecin(idPers) ON DELETE SET NULL ON UPDATE CASCADE,
				FOREIGN KEY (idPatient) REFERENCES Patient(idPers) ON DELETE SET NULL ON UPDATE CASCADE
				-- SET NULL pour garder l'historique
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Examen (
				idExamen    INTEGER PRIMARY KEY AUTOINCREMENT,
				typeExamen  TEXT,
				-- CHECK(typeExamen IN ('IRM','Scanner','Radio','Autre'))--
				description TEXT,
				idVisite    INTEGER NOT NULL,

				FOREIGN KEY (idVisite) REFERENCES Visite(idVisite) ON DELETE CASCADE ON UPDATE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Reunion (
				idReunion       INTEGER PRIMARY KEY AUTOINCREMENT,
				dateReunion     TEXT CHECK(dateReunion GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),
				objetReunion    TEXT
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS ParticipationReunion (
				    idReunion INTEGER NOT NULL,
				    idMedecin INTEGER,
				    idInfirmier INTEGER,

				    PRIMARY KEY (idReunion, idMedecin, idInfirmier),
				    FOREIGN KEY (idReunion) REFERENCES Reunion(idReunion) ON DELETE CASCADE ON UPDATE CASCADE,
				    FOREIGN KEY (idMedecin) REFERENCES Medecin(idPers) ON DELETE CASCADE ON UPDATE CASCADE,
				    FOREIGN KEY (idInfirmier) REFERENCES Infirmier(idPers) ON DELETE CASCADE ON UPDATE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Soin (
				idSoin          INTEGER PRIMARY KEY AUTOINCREMENT,
				dateHeureSoin   TEXT CHECK(dateHeureSoin GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}'), -- Stocké sous format "YYYY-MM-DD HH:MM:SS"
				descriptionSoin TEXT NOT NULL,

				idInfirmier     INTEGER NOT NULL,
				idPatient       INTEGER NOT NULL,
				idReunion       INTEGER NOT NULL,

				FOREIGN KEY (idInfirmier) REFERENCES Infirmier(idPers) ON DELETE SET NULL ON UPDATE CASCADE,
				FOREIGN KEY (idPatient) REFERENCES Patient(idPers) ON DELETE SET NULL ON UPDATE CASCADE,
				FOREIGN KEY (idReunion) REFERENCES Reunion(idReunion) ON DELETE SET NULL ON UPDATE CASCADE
				-- SET NULL pour garder l'historique
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Medicament (
				idMedicament    INTEGER PRIMARY KEY AUTOINCREMENT,
				nomMedicament   TEXT
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Necessiter (
				idSoin          INTEGER NOT NULL,
				idMedicament    INTEGER NOT NULL,
				quantite        TEXT,  -- ex: "2 comprimés" ou INTEGER CHECK (quantite > 0),

				PRIMARY KEY (idSoin, idMedicament),
				FOREIGN KEY (idSoin) REFERENCES Soin(idSoin) ON DELETE CASCADE ON UPDATE CASCADE,
				FOREIGN KEY (idMedicament) REFERENCES Medicament(idMedicament) ON DELETE CASCADE ON UPDATE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Nettoyage (
				idNettoyage     INTEGER PRIMARY KEY AUTOINCREMENT,
				dateNettoyage   TEXT CHECK(dateNettoyage GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),
				idChambre       INTEGER NOT NULL,

				FOREIGN KEY (idChambre) REFERENCES Chambre(idChambre) ON DELETE CASCADE ON UPDATE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS EffectuerNettoyage (
				idNettoyage     INTEGER NOT NULL,
				idPersNettoyage INTEGER NOT NULL,

				PRIMARY KEY (idNettoyage, idPersNettoyage),
				FOREIGN KEY (idNettoyage) REFERENCES Nettoyage(idNettoyage) ON DELETE CASCADE ON UPDATE CASCADE,
				FOREIGN KEY (idPersNettoyage) REFERENCES PersonnelNettoyage(idPers) ON DELETE CASCADE ON UPDATE CASCADE
				);`
			);

			db.run(
				`CREATE TABLE IF NOT EXISTS Antecedent (
				idAntecedent    INTEGER PRIMARY KEY AUTOINCREMENT,
				typeAntecedent  TEXT,
				description     TEXT,
				dateDeclaration TEXT CHECK(dateDeclaration GLOB '[0-9]{4}-[0-9]{2}-[0-9]{2}'),

				idPatient INTEGER NOT NULL,

				FOREIGN KEY (idPatient) REFERENCES Patient(idPers) ON DELETE CASCADE ON UPDATE CASCADE
				);`
			);
		});
	}
});

module.exports = db;
