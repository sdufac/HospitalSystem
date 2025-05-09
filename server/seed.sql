-- PERSONNES
INSERT INTO Personne (idPers, nomPers, prenomPers, dNaisPers, numTelPers, adressePers) VALUES
(1, 'Roux', 'Alice', '1980-01-01', '0600000001', '1 rue A, Paris'),
(2, 'Petit', 'Marc', '1975-02-02', '0600000002', '2 rue B, Lyon'),
(3, 'Lemoine', 'Sarah', '1990-03-03', '0600000003', '3 rue C, Lille'),
(4, 'Gauthier', 'Luc', '1982-04-04', '0600000004', '4 rue D, Bordeaux'),
(5, 'Fabre', 'Julie', '1985-05-05', '0600000005', '5 rue E, Nantes'),
(6, 'Morel', 'Antoine', '1993-06-06', '0600000006', '6 rue F, Marseille'),
(7, 'Blanc', 'Claire', '1987-07-07', '0600000007', '7 rue G, Toulouse'),
(8, 'Bernard', 'Emma', '1979-08-08', '0600000008', '8 rue H, Strasbourg'),
(9, 'Lopez', 'Hugo', '1991-09-09', '0600000009', '9 rue I, Reims'),
(10, 'Meunier', 'Chloe', '1988-10-10', '0600000010', '10 rue J, Dijon'),
(11, 'Garcia', 'Jean', '1970-11-11', '0600000011', '11 rue K, Montpellier'),
(12, 'Durand', 'Marie', '1983-12-12', '0600000012', '12 rue L, Grenoble'),
(13, 'Noel', 'Nicolas', '1978-01-13', '0600000013', '13 rue M, Limoges'),
(14, 'Henry', 'Laura', '1986-02-14', '0600000014', '14 rue N, Besançon'),
(15, 'Marchand', 'Paul', '1976-03-15', '0600000015', '15 rue O, Metz'),
(16, 'Barbier', 'Camille', '1995-04-16', '0600000016', '16 rue P, Brest'),
(17, 'Charpentier', 'Lucie', '1980-05-17', '0600000017', '17 rue Q, Paris'),
(18, 'Leroy', 'Jules', '1974-06-18', '0600000018', '18 rue R, Lyon'),
(19, 'Martin', 'Leo', '1989-07-19', '0600000019', '19 rue S, Nice'),
(20, 'Peron', 'Anna', '1987-08-20', '0600000020', '20 rue T, Marseille');

-- PATIENTS
INSERT INTO Patient (idPers, numDossierMed, motifHospitalisation) VALUES
(1, 'P001', 'Infarctus'),
(2, 'P002', 'Accident domestique'),
(3, 'P003', 'Chirurgie planifiée'),
(4, 'P004', 'Observation post-op'),
(5, 'P005', 'Trouble du rythme cardiaque'),
(6, 'P006', 'Douleurs chroniques'),
(7, 'P007', 'Suivi post-AVC'),
(8, 'P008', 'Rééducation'),
(9, 'P009', 'Surveillance hypertension'),
(10, 'P010', 'Exploration digestive');

-- MEDECINS
INSERT INTO Medecin (idPers, specialite, mdp, idService) VALUES
(11, 'Cardiologie', 'mdp1', 1), -- Gracia mdp1
(12, 'Neurologie', 'mdp2', 2), -- Durand mdp2
(13, 'Chirurgie', 'mdp3', 3); -- Noel mdp3

-- INFIRMIERS
INSERT INTO Infirmier (idPers, datePrisePoste, idService) VALUES
(14, '2015-01-01', 1),
(15, '2016-02-01', 2),
(16, '2017-03-01', 3);

-- ADMINS
INSERT INTO PersonnelAdmin (idPers, mdp, role, datePrisePoste) VALUES
(17, 'admin1', 'Responsable', '2010-01-01'), -- Charpentier admin1
(18, 'admin2', 'Responsable', '2011-01-01'), -- Leroy admin2
(19, 'admin3', 'Responsable', '2012-01-01'); -- Martin admin3

-- NETTOYAGE
INSERT INTO PersonnelNettoyage (idPers, role, datePrisePoste) VALUES
(20, 'Technicien', '2015-06-01');

-- SERVICES
INSERT INTO Service (idService, nomService, etageService, idMedecinRef, idAdminRes) VALUES
(1, 'Cardiologie', 1, 11, 17),
(2, 'Neurologie', 2, 12, 18),
(3, 'Chirurgie', 3, 13, 19);

-- CHAMBRES
INSERT INTO Chambre (idChambre, numChambre, capacite, idService) VALUES
(1, 'A101', 2, 1),
(2, 'A102', 2, 1),
(3, 'A103', 4, 1),
(4, 'A104', 4, 1),
(5, 'A105', 6, 1),
(6, 'B201', 2, 2),
(7, 'B202', 2, 2),
(8, 'B203', 4, 2),
(9, 'B204', 4, 2),
(10, 'B205', 6, 2),
(11, 'C201', 2, 3),
(12, 'C202', 2, 3),
(13, 'C203', 4, 3),
(14, 'C204', 4, 3),
(15, 'C205', 6, 3);

-- LITS
INSERT INTO Lit (idLit, numLit, idChambre) VALUES
-- Service 1
(1, 'L11', 1),
(2, 'L12', 1),

(3, 'L13', 2),
(4, 'L14', 2),

(5, 'L15', 3),
(6, 'L16', 3),
(7, 'L17', 3),
(8, 'L18', 3),

(9, 'L19', 4),
(10, 'L110', 4),
(11, 'L111', 4),
(12, 'L112', 4),

(13, 'L113', 5),
(14, 'L114', 5),
(15, 'L115', 5),
(16, 'L116', 5),
(17, 'L117', 5),
(18, 'L118', 5),

-- Service 2
(19, 'L21', 6),
(20, 'L22', 6),

(21, 'L23', 7),
(22, 'L24', 7),

(23, 'L25', 8),
(24, 'L26', 8),
(25, 'L27', 8),
(26, 'L28', 8),

(27, 'L29', 9),
(28, 'L210', 9),
(29, 'L211', 9),
(30, 'L212', 9),

(31, 'L213', 10),
(32, 'L214', 10),
(33, 'L215', 10),
(34, 'L216', 10),
(35, 'L217', 10),
(36, 'L218', 10),

-- Service 3
(37, 'L31', 11),
(38, 'L32', 11),

(39, 'L33', 12),
(40, 'L34', 12),

(41, 'L35', 13),
(42, 'L36', 13),
(43, 'L37', 13),
(44, 'L38', 13),

(45, 'L39', 14),
(46, 'L310', 14),
(47, 'L311', 14),
(48, 'L312', 14),

(49, 'L313', 15),
(50, 'L314', 15),
(55, 'L315', 15),
(56, 'L316', 15),
(57, 'L317', 15),
(58, 'L318', 15);

-- Séjours
INSERT INTO Sejour (dateAdmission, dateSortiePrevue, dateSortieReelle, idPatient, idLit, idAdminAffectation) VALUES
('2024-04-01', '2024-04-10', NULL, 1, 1, 17),
('2024-04-02', '2024-04-12', NULL, 2, 2, 17),
('2024-04-03', '2024-04-08', '2024-04-07', 3, 3, 17),
('2024-04-05', '2024-04-15', NULL, 4, 4, 18);
-- INSERT INTO Sejour (dateAdmission, dateSortiePrevue, dateSortieReelle, idPatient, idLit, idAdminAffectation) VALUES
-- ('2024-01-01', '2024-01-15', '2024-01-14', 4, 1, 6),
-- ('2024-02-10', '2024-02-20', NULL, 5, 2, 6),
-- ('2024-03-05', '2024-03-15', '2024-03-14', 6, 3, 6);

-- Nettoyages
INSERT INTO Nettoyage (dateNettoyage, idChambre) VALUES
('2024-04-01', 1),
('2024-04-02', 2),
('2024-04-03', 3);
-- INSERT INTO Nettoyage (dateNettoyage, idChambre) VALUES
-- ('2024-01-16', 1), ('2024-02-21', 2);

INSERT INTO EffectuerNettoyage (idNettoyage, idPersNettoyage) VALUES
(1, 20),
(2, 20),
(3, 20);
-- INSERT INTO EffectuerNettoyage (idNettoyage, idPersNettoyage) VALUES
-- (1, 7), (2, 7);

-- Visites
INSERT INTO Visite (dateVisite, compteRendu, idMedecin, idPatient) VALUES
('2024-04-02', 'Stable', 11, 1),
('2024-04-03', 'Besoin d’examen', 12, 2),
('2024-04-04', 'Amélioration', 13, 3);
-- INSERT INTO Visite (dateVisite, compteRendu, idMedecin, idPatient) VALUES
-- ('2024-01-05', 'Patient stable', 1, 4),
-- ('2024-02-15', 'Réagit bien au traitement', 2, 5);

-- Examens
INSERT INTO Examen (typeExamen, description, idVisite) VALUES
('IRM', 'IRM cérébrale suite à migraine persistante', 2),
('Radio', 'Radio thoracique pour contrôle post-op', 3);
-- INSERT INTO Examen (typeExamen, description, idVisite) VALUES
-- ('IRM', 'IRM cérébrale', 1),
-- ('Radio', 'Radio thoracique', 2);

-- Réunions
INSERT INTO Reunion (dateReunion, objetReunion) VALUES
('2024-04-05', 'Réunion de coordination hebdo'),
('2024-04-06', 'Discussion cas complexes');
-- INSERT INTO Reunion (dateReunion, objetReunion) VALUES
-- ('2024-01-10', 'Bilan hebdomadaire'), ('2024-02-10', 'Mise au point traitement');

-- Participation réunion
INSERT INTO ParticipationReunion (idReunion, idMedecin, idInfirmier) VALUES
(1, 11, 14),
(1, 12, 15),
(2, 13, 16);
-- INSERT INTO ParticipationReunion (idReunion, idMedecin, idInfirmier) VALUES
-- (1, 1, 3), (2, 2, 3);

-- Soins
INSERT INTO Soin (dateHeureSoin, descriptionSoin, idInfirmier, idPatient, idReunion) VALUES
('2024-04-05 10:30', 'Injection anticoagulant', 14, 1, 1),
('2024-04-06 14:00', 'Changement pansement', 15, 2, 1),
('2024-04-06 09:00', 'Prise de tension', 16, 3, 2);
-- INSERT INTO Soin (dateHeureSoin, descriptionSoin, idInfirmier, idPatient, idReunion) VALUES
-- ('2024-01-06 10:00', 'Changement de pansement', 3, 4, 1),
-- ('2024-02-16 11:00', 'Injection antibiotique', 3, 5, 2);

-- Médicaments
INSERT INTO Medicament (nomMedicament) VALUES
('Doliprane'),
('Aspirine'),
('Heparine'),
('Paracétamol'),
('Amoxicilline');

-- Nécessiter
INSERT INTO Necessiter (idSoin, idMedicament, quantite) VALUES
(1, 3, '1 dose'),
(2, 1, '2 comprimés'),
(3, 2, '1 comprimé');
-- INSERT INTO Necessiter (idSoin, idMedicament, quantite) VALUES
-- (1, 1, '2 comprimés'), (2, 2, '1 dose');

-- Antécédents
INSERT INTO Antecedent (typeAntecedent, description, dateDeclaration, idPatient) VALUES
('Cardiaque', 'Antécédent infarctus en 2020', '2024-04-01', 1),
('Neurologique', 'Crise d’épilepsie antérieure', '2024-04-01', 2),
('Chirurgical', 'Appendicectomie', '2024-04-01', 3);
-- INSERT INTO Antecedent (typeAntecedent, description, dateDeclaration, idPatient) VALUES
-- ('Cardiaque', 'Hypertension chronique', '2020-01-01', 4),
-- ('Respiratoire', 'Asthme modéré', '2019-06-15', 5);
