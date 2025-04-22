-- TABLE PERSONNE
INSERT INTO Personne (idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers) VALUES
(1, 'a', 'Jean', '1980-05-12', '0102030405', '12 rue de la Santé, Paris'), -- Médecin
(2, 'Martin', 'Claire', '1975-09-22', '0607080910', '23 avenue de la République, Lyon'), -- Médecin
(3, 'Lemoine', 'Pierre', '1990-11-02', '0708091011', '45 boulevard des Fleurs, Marseille'), -- Médecin
(4, 'Durand', 'Sophie', '1985-02-15', '0203040506', '67 rue des Lilas, Toulouse'), -- Infirmière
(5, 'Moreau', 'Louis', '1972-07-30', '0809012345', '89 rue de la Liberté, Nantes'), -- Infirmier
(6, 'Bernard', 'Julie', '1988-04-01', '0611223344', '15 rue des Violettes, Lille'), -- Infirmière
(7, 'Noel', 'Marc', '1995-12-12', '0666778899', '10 rue Verte, Rennes'), -- Patient
(8, 'Charpentier', 'Lucie', '1983-07-23', '0655443322', '5 avenue Bleuets, Nice'), -- Patient
(9, 'Girard', 'Nicolas', '1991-10-08', '0644332211', '33 rue Soleil, Bordeaux'), -- Patient
(10, 'b', 'Camille', '1970-03-03', '0633221100', '50 rue Montagne, Strasbourg'), -- Admin
(11, 'Prfqe', 'Henri', '1965-08-17', '0622110099', '72 avenue du Port, Marseille'), -- Nettoyage
(12, 'Leroy', 'Emma', '1992-01-01', '0612345678', '1 rue des Lilas, Dijon'), -- Patient
(13, 'Renard', 'Julien', '1989-06-15', '0623456789', '8 avenue Lumière, Lille'), -- Patient
(14, 'Benoit', 'Sophie', '1978-09-05', '0634567890', '22 rue des Champs, Reims'), -- Patient
(15, 'Lopez', 'Antoine', '1994-03-21', '0645678901', '77 avenue des Prés, Tours'), -- Patient
(16, 'Meunier', 'Alice', '1986-12-30', '0656789012', '99 boulevard Verdun, Nancy'); -- Patient

-- SERVICES
INSERT INTO Service (idService, nomService, etageService, idMedecinRef, idAdminRes) VALUES
(1, 'Cardiologie', 2, 1, 10),
(2, 'Neurologie', 3, 2, 10),
(3, 'Chirurgie', 1, 3, 10);

-- MEDECINS
INSERT INTO Medecin (idPers, specialite, mdp, idService) VALUES
(1, 'Cardiologie', 'a', 1),
(2, 'Neurologie', 'mdp456', 2),
(3, 'Chirurgie', 'mdp789', 3);

-- INFIRMIERS
INSERT INTO Infirmier (idPers, datePrisePoste, idService) VALUES
(4, '2010-01-01', 1),
(5, '2012-03-15', 2),
(6, '2014-05-20', 3);

-- ADMIN
INSERT INTO PersonnelAdmin (idPers, mdp, role, datePrisePoste) VALUES
(10, 'b', 'Responsable', '2010-02-01');

-- NETTOYAGE
INSERT INTO PersonnelNettoyage (idPers, role, datePrisePoste) VALUES
(11, 'AgentEntretien', '2015-01-01');

-- PATIENTS
INSERT INTO Patient (idPers, numDossierMed, motifHospitalisation) VALUES
(7, 'D1234', 'Maladie cardiaque'),
(8, 'D5678', 'Problèmes neurologiques'),
(9, 'D9101', 'Chirurgie orthopédique'),
(12, 'D1122', 'Infection respiratoire'),
(13, 'D3344', 'Douleurs chroniques'),
(14, 'D5566', 'Suivi post-AVC'),
(15, 'D7788', 'Problème hépatique'),
(16, 'D9900', 'Rééducation post-traumatique');

-- CHAMBRES
INSERT INTO Chambre (idChambre, numChambre, capacite, idService) VALUES
(1, 'A101', 2, 1),
(2, 'B202', 4, 2),
(3, 'C303', 6, 3);

-- LITS
INSERT INTO Lit (idLit, numLit, idChambre) VALUES
(1, 'L1', 1),
(2, 'L2', 1),
(3, 'L3', 2),
(4, 'L4', 2),
(5, 'L5', 2),
(6, 'L6', 2),
(7, 'L7', 3),
(8, 'L8', 3),
(9, 'L9', 3),
(10, 'L10', 3),
(11, 'L11', 3),
(12, 'L12', 3);

-- SEJOURS
INSERT INTO Sejour (idSejour, dateAdmission, dateSortiePrevue, dateSortieReelle, idPatient, idLit, idAdminAffectation) VALUES
(1, '2023-05-01', '2023-05-15', '2023-05-14', 7, 1, 10),
(2, '2023-06-10', '2023-06-20', '2023-06-19', 8, 2, 10),
(3, '2023-07-01', '2023-07-10', '2023-07-09', 9, 3, 10),
(4, '2023-07-15', '2023-07-25', NULL, 12, 4, 10),
(5, '2023-08-01', '2023-08-10', NULL, 13, 5, 10),
(6, '2023-08-15', '2023-08-20', NULL, 14, 6, 10),
(7, '2023-08-21', '2023-08-30', NULL, 15, 7, 10),
(8, '2023-09-01', '2023-09-10', NULL, 16, 8, 10);

-- VISITES (3 par patient → 8 patients → 24 visites)
INSERT INTO Visite (idVisite, dateVisite, compteRendu, idMedecin, idPatient) VALUES
-- Patient 7
(1, '2023-05-02', 'Suivi cardiaque', 1, 7),
(2, '2023-05-06', 'Contrôle tension', 1, 7),
(3, '2023-05-10', 'Électrocardiogramme', 1, 7),
-- Patient 8
(4, '2023-06-11', 'IRM cérébrale', 2, 8),
(5, '2023-06-13', 'EEG', 2, 8),
(6, '2023-06-18', 'Consultation mémoire', 2, 8),
-- Patient 9
(7, '2023-07-02', 'Suivi post-chirurgie', 3, 9),
(8, '2023-07-05', 'Retrait points', 3, 9),
(9, '2023-07-08', 'Mobilité genou', 3, 9),
-- Patient 12
(10, '2023-07-16', 'Contrôle infection', 1, 12),
(11, '2023-07-18', 'Radio poumons', 1, 12),
(12, '2023-07-22', 'Consultation de suivi', 1, 12),
-- Patient 13
(13, '2023-08-02', 'Bilan douleur', 2, 13),
(14, '2023-08-05', 'IRM lombaire', 2, 13),
(15, '2023-08-08', 'Prescription médicamenteuse', 2, 13),
-- Patient 14
(16, '2023-08-16', 'Suivi post-AVC', 2, 14),
(17, '2023-08-17', 'EEG', 2, 14),
(18, '2023-08-18', 'Bilan cognitif', 2, 14),
-- Patient 15
(19, '2023-08-22', 'Analyse hépatique', 3, 15),
(20, '2023-08-25', 'Échographie foie', 3, 15),
(21, '2023-08-28', 'Consultation hépatologue', 3, 15),
-- Patient 16
(22, '2023-09-02', 'Suivi rééducation', 3, 16),
(23, '2023-09-05', 'Évaluation mobilité', 3, 16),
(24, '2023-09-08', 'Contrôle douleur', 3, 16);

-- SOINS (2 par patient → 8 patients → 16 soins)
INSERT INTO Soin (idSoin, dateHeureSoin, descriptionSoin, idInfirmier, idPatient, idReunion) VALUES
(1, '2023-05-03 10:00', 'Changement pansement', 4, 7, 1),
(2, '2023-05-05 09:30', 'Injection anticoagulants', 4, 7, 1),
(3, '2023-06-12 11:00', 'Surveillance post-IRM', 5, 8, 2),
(4, '2023-06-17 14:30', 'Préparation EEG', 5, 8, 2),
(5, '2023-07-03 08:00', 'Changement pansement post-op', 6, 9, 3),
(6, '2023-07-07 10:15', 'Prise de tension', 6, 9, 3),
(7, '2023-07-17 09:00', 'Aérosol', 4, 12, 1),
(8, '2023-07-20 10:30', 'Prise de température', 4, 12, 1),
(9, '2023-08-03 11:00', 'Injection analgésique', 5, 13, 2),
(10, '2023-08-06 09:30', 'Massage lombaire', 5, 13, 2),
(11, '2023-08-16 15:00', 'Aide motricité', 5, 14, 2),
(12, '2023-08-18 08:45', 'Prise de médicaments', 5, 14, 2),
(13, '2023-08-23 10:00', 'Injection hépatique', 6, 15, 3),
(14, '2023-08-27 10:00', 'Surveillance état général', 6, 15, 3),
(15, '2023-09-03 11:30', 'Rééducation jambe', 6, 16, 3),
(16, '2023-09-06 09:30', 'Kinésithérapie', 6, 16, 3);

-- EXAMENS (1 par patient min)
INSERT INTO Examen (idExamen, typeExamen, description, idVisite) VALUES
(1, 'ECG', 'Électrocardiogramme', 3),
(2, 'IRM', 'IRM cérébrale', 4),
(3, 'Radio', 'Radio du genou', 7),
(4, 'Radio', 'Radio des poumons', 11),
(5, 'IRM', 'IRM lombaire', 14),
(6, 'EEG', 'Électroencéphalogramme', 17),
(7, 'Écho', 'Échographie du foie', 20),
(8, 'Éval.', 'Bilan mobilité', 23);

-- MEDICAMENTS
INSERT INTO Medicament (idMedicament, nomMedicament) VALUES
(1, 'Aspirine'),
(2, 'Paracétamol'),
(3, 'Ibuprofène'),
(4, 'Amoxicilline'),
(5, 'Codéine'),
(6, 'Metformine');

-- NECESSITER (liaison soins-médicaments)
INSERT INTO Necessiter (idSoin, idMedicament, quantite) VALUES
(1, 1, '2 comprimés'),
(2, 2, '1 injection'),
(3, 3, '1 dose'),
(4, 1, '1 comprimé'),
(5, 2, '1 dose'),
(6, 1, '2 comprimés'),
(7, 4, '1 nébuliseur'),
(8, 3, '1 prise'),
(9, 5, '1 injection'),
(10, 3, '1 pommade'),
(11, 6, '1 comprimé'),
(12, 1, '2 comprimés'),
(13, 5, '1 injection'),
(14, 3, '1 comprimé'),
(15, 6, '1 dose'),
(16, 4, '1 injection');

-- REUNIONS
INSERT INTO Reunion (idReunion, dateReunion, objetReunion) VALUES
(1, '2023-05-01', 'Suivi des soins post-op'),
(2, '2023-06-10', 'Mise à jour protocole neurologie'),
(3, '2023-07-01', 'Répartition des chambres');

-- PARTICIPATION REUNIONS
INSERT INTO ParticipationReunion (idReunion, idMedecin, idInfirmier) VALUES
(1, 1, 4),
(2, 2, 5),
(3, 3, 6);

-- NETTOYAGE
INSERT INTO Nettoyage (idNettoyage, dateNettoyage, idChambre) VALUES
(1, '2023-05-02', 1),
(2, '2023-06-12', 2),
(3, '2023-07-05', 3);

-- EFFECTUER NETTOYAGE
INSERT INTO EffectuerNettoyage (idNettoyage, idPersNettoyage) VALUES
(1, 11),
(2, 11),
(3, 11);

-- ANTECEDENTS (1 par patient)
INSERT INTO Antecedent (idAntecedent, typeAntecedent, description, dateDeclaration, idPatient) VALUES
(1, 'Cardiaque', 'Hypertension', '2015-03-01', 7),
(2, 'Neurologique', 'Crises d’épilepsie', '2016-11-21', 8),
(3, 'Chirurgical', 'Ligamentoplastie', '2020-06-12', 9),
(4, 'Infectieux', 'Pneumonie', '2018-02-28', 12),
(5, 'Douleur chronique', 'Lombalgie', '2019-04-15', 13),
(6, 'Neurologique', 'AVC mineur', '2020-01-30', 14),
(7, 'Hépatique', 'Hépatite B', '2017-07-01', 15),
(8, 'Traumatique', 'Accident voiture', '2021-09-10', 16);
