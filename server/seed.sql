INSERT INTO Personne (nomPers, prenomPers, dNaisPers, numTelPers, adressePers) VALUES
('a', 'Jean', '1980-05-12', '0102030405', '12 rue de la Santé, Paris'),
('Martin', 'Claire', '1975-09-22', '0607080910', '23 avenue de la République, Lyon'),
('Lemoine', 'Pierre', '1990-11-02', '0708091011', '45 boulevard des Fleurs, Marseille'),
('Durand', 'Sophie', '1985-02-15', '0203040506', '67 rue des Lilas, Toulouse'),
('Moreau', 'Louis', '1972-07-30', '0809012345', '89 rue de la Liberté, Nantes');

INSERT INTO Service (nomService, etageService, idMedecinRef, idAdminRes) VALUES
('Cardiologie', 2, 1, 1),
('Neurologie', 3, 2, 2),
('Chirurgie', 1, 3, 3);

INSERT INTO Medecin (idPers, specialite, mdp, idService) VALUES
(1, 'Cardiologie', 'a', 1),
(2, 'Neurologie', 'mdp456', 2),
(3, 'Chirurgie', 'mdp789', 3);

INSERT INTO Infirmier (idPers, datePrisePoste, idService) VALUES
(4, '2010-01-01', 1),
(5, '2012-03-15', 2),
(6, '2014-05-20', 3);

INSERT INTO PersonnelAdmin (idPers, mdp, role, datePrisePoste) VALUES
(1, 'admin123', 'Responsable', '2010-02-01'),
(2, 'admin456', 'Adjoint', '2012-04-10'),
(3, 'admin789', 'ChefDeService', '2014-06-12');

INSERT INTO PersonnelNettoyage (idPers, role, datePrisePoste) VALUES
(1, 'AgentEntretien', '2015-01-01'),
(2, 'Technicien', '2016-04-15'),
(3, 'Autre', '2017-07-20');

INSERT INTO Patient (idPers, numDossierMed, motifHospitalisation) VALUES
(1, 'D1234', 'Maladie cardiaque'),
(2, 'D5678', 'Problèmes neurologiques'),
(3, 'D9101', 'Chirurgie orthopédique');

INSERT INTO Chambre (numChambre, capacite, idService) VALUES
('A101', 2, 1),
('B202', 4, 2),
('C303', 6, 3);

INSERT INTO Lit (numLit, idChambre) VALUES
('L1', 1),
('L2', 1),
('L3', 2),
('L4', 2),
('L5', 3),
('L6', 3);

INSERT INTO Sejour (dateAdmission, dateSortiePrevue, dateSortieReelle, idPatient, idLit, idAdminAffectation) VALUES
('2023-05-01', '2023-05-15', '2023-05-14', 1, 1, 1),
('2023-06-10', '2023-06-20', '2023-06-19', 2, 2, 2),
('2023-07-01', '2023-07-10', '2023-07-09', 3, 3, 3);

INSERT INTO Visite (dateVisite, compteRendu, idMedecin, idPatient) VALUES
('2023-05-05', 'Suivi après opération', 1, 1),
('2023-06-15', 'Contrôle neurologique', 2, 2),
('2023-07-05', 'Examen post-chirurgical', 3, 3);

INSERT INTO Examen (typeExamen, description, idVisite) VALUES
('Scanner', 'Scanner cérébral', 1),
('IRM', 'IRM de la colonne vertébrale', 2),
('Radio', 'Radiographie du genou', 3);

INSERT INTO Reunion (dateReunion, objetReunion) VALUES
('2023-04-25', 'Réunion pour discuter des nouveaux cas'),
('2023-06-05', 'Planification des examens des patients'),
('2023-07-10', 'Réunion de mise à jour des protocoles médicaux');

INSERT INTO ParticipationReunion (idReunion, idMedecin, idInfirmier) VALUES
(1, 1, 4),
(2, 2, 5),
(3, 3, 6);

INSERT INTO Soin (dateHeureSoin, descriptionSoin, idInfirmier, idPatient, idReunion) VALUES
('2023-05-05 10:30', 'Changement de pansement', 4, 1, 1),
('2023-06-16 14:00', 'Injection de médicaments', 5, 2, 2),
('2023-07-06 11:00', 'Surveillance post-opératoire', 6, 3, 3);

INSERT INTO Medicament (nomMedicament) VALUES
('Aspirine'),
('Paracétamol'),
('Ibuprofène');

INSERT INTO Necessiter (idSoin, idMedicament, quantite) VALUES
(1, 1, '2 comprimés'),
(2, 2, '1 sachet'),
(3, 3, '2 comprimés');

INSERT INTO Nettoyage (dateNettoyage, idChambre) VALUES
('2023-05-02', 1),
('2023-06-12', 2),
('2023-07-05', 3);

INSERT INTO EffectuerNettoyage (idNettoyage, idPersNettoyage) VALUES
(1, 1),
(2, 2),
(3, 3);

INSERT INTO Antecedent (typeAntecedent, description, dateDeclaration, idPatient) VALUES
('Chirurgical', 'Appendicectomie', '2020-10-10', 1),
('Cardiaque', 'Angine de poitrine', '2018-03-15', 2),
('Neurologique', 'Accident vasculaire cérébral', '2015-05-20', 3);
