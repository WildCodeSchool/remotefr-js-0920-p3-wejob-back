-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.22 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour wejob_back
DROP DATABASE IF EXISTS `wejob_back`;
CREATE DATABASE IF NOT EXISTS `wejob_back` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `wejob_back`;

-- Listage de la structure de la table wejob_back. language
DROP TABLE IF EXISTS `language`;
CREATE TABLE IF NOT EXISTS `language` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.language : ~7 rows (environ)
DELETE FROM `language`;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` (`id`, `language`) VALUES
	(1, 'francais'),
	(2, 'anglais'),
	(3, 'espagnol'),
	(4, 'italien'),
	(5, 'allemand'),
	(6, 'chinois'),
	(7, 'arabe');
/*!40000 ALTER TABLE `language` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. recruiter
DROP TABLE IF EXISTS `recruiter`;
CREATE TABLE IF NOT EXISTS `recruiter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.recruiter : ~0 rows (environ)
DELETE FROM `recruiter`;
/*!40000 ALTER TABLE `recruiter` DISABLE KEYS */;
/*!40000 ALTER TABLE `recruiter` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. sector_of_activity
DROP TABLE IF EXISTS `sector_of_activity`;
CREATE TABLE IF NOT EXISTS `sector_of_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.sector_of_activity : ~21 rows (environ)
DELETE FROM `sector_of_activity`;
/*!40000 ALTER TABLE `sector_of_activity` DISABLE KEYS */;
INSERT INTO `sector_of_activity` (`id`, `name`) VALUES
	(1, 'Aéronautique'),
	(2, 'Agroalimentaire – vins & spiritueux'),
	(3, 'Automobile : machines et équipements'),
	(4, 'Banque – assurance'),
	(5, 'Bois – papier – carton – imprimerie, plastique, caoutchouc'),
	(6, 'BTP – matériaux de construction'),
	(7, 'Chimie – parachimie'),
	(8, 'Commerce – négoce – distribution'),
	(9, 'Economie Sociale et Solidaire'),
	(10, 'Edition – communication – multimédia'),
	(11, 'Electronique – électricité'),
	(12, 'Etudes et conseils'),
	(13, 'Industrie pharmaceutique – biotechnologies'),
	(14, 'Informatique – télécoms'),
	(15, 'Métallurgie – travail du métal'),
	(16, 'Public : éducation, justice, armée…'),
	(17, 'Santé – service à la personne'),
	(18, 'Textile – habillement – chaussure'),
	(19, 'Transport – logistique'),
	(20, 'Autres services aux entreprises'),
	(21, 'Autres');
/*!40000 ALTER TABLE `sector_of_activity` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `token` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.user : ~24 rows (environ)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `email`, `password`, `isAdmin`, `token`) VALUES
	(1, 'fff@ff.fr', 'omomom', 0, NULL),
	(2, 'test@test.be', 'dsosdhjcsdc', 0, NULL),
	(3, 'nanana@gmail.com', 'oisdjvoisdjvio', 0, NULL),
	(4, 'test2_ajout@mail.fr', NULL, 0, NULL),
	(5, 'test3_ajout@mail.fr', NULL, 0, NULL),
	(6, 'test4_ajout@mail.fr', NULL, 0, NULL),
	(7, 'test5_ajout@mail.fr', NULL, 0, NULL),
	(8, 'test6_ajout@mail.fr', NULL, 0, NULL),
	(9, 'test8_ajout@mail.fr', NULL, 0, 'hRdFSgAnrONhpOXmY1VBKuJmKtt0I20u'),
	(10, 'test9_ajout@mail.fr', NULL, 0, '1w1lh114K5ZavI8AHmUzlO9SokH92s8W'),
	(11, 'test10_ajout@mail.fr', NULL, 0, '3BJNQQ1vsxvC9Hk1ftAJPci4nW7qfPbc'),
	(12, 'test11_ajout@mail.fr', NULL, 0, '4rRESQnkL8LCvFHwsabd1YkeqKOYwI5r'),
	(14, 'test12_ajout@mail.fr', NULL, 0, 'hYJTQaXmjOwMzKd56FxEmuV7lFR7Adt7'),
	(15, 'test13_ajout@mail.fr', NULL, 0, 'L9rcrKcIgMaDW07GiB5B2r8xrp2zKSEA'),
	(16, 'test14_ajout@mail.fr', NULL, 0, 'aczju9mnz0o5xsM6R1870Q4WMHOYMlrr'),
	(17, 'test15_ajout@mail.fr', NULL, 0, 'JUGMEnk1VfvbOivBA7D7XAC5ltgd9CUb'),
	(18, 'test16_ajout@mail.fr', NULL, 0, 'OdY8iuHdbB4JXq8HiNRR2UGrWkYTfL6B'),
	(19, 'test17_ajout@mail.fr', NULL, 0, '5AcjjjzcrFibcFG7NtSpYh5U184EGp2a'),
	(20, 'test18_ajout@mail.fr', NULL, 0, 'EIPsZIZEnGjxS8Azgkv5TyyzuO60SGWJ'),
	(21, 'test19_ajout@mail.fr', NULL, 0, '6aoQ5abTvZd8V3rX3SDSEn65z7uPbyk2'),
	(22, 'test20_ajout@mail.fr', '$2a$14$A84jRKO3OUg2bJdy/Dxla..M0VQxyy5JT3jyKpdVrcxLudpxDFC2G', 0, NULL),
	(23, 'test21_ajout@mail.fr', '$2a$14$nCkpGQvyYYl/Jzrlm6SRn.ADofXPuNgWcnJOL83kYecR2xyZxXNKq', 0, NULL),
	(24, 'test22_ajout@mail.fr', '$2a$14$Ohf606zvDRl8gvxd1qUhHef47jhhY5Md1Sy8RUcxHlco0wcIA8awS', 0, NULL),
	(25, 'test23_ajout@mail.fr', '$2a$14$QfFXrZKVAS8UyA1xk1kiuOEmZfRaWhJk3a13w6RnFfuuCk1PG..8y', 0, NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. user_fiche
DROP TABLE IF EXISTS `user_fiche`;
CREATE TABLE IF NOT EXISTS `user_fiche` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `diploma` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv1` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `picture` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availability` int DEFAULT NULL,
  `mobility` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `years_of_experiment` int DEFAULT NULL,
  `isCheck` tinyint(1) DEFAULT '0',
  `create_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `isOpen_to_formation` tinyint(1) DEFAULT '0',
  `user_id` int NOT NULL,
  `cv2` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `civility` enum('Madame','Monsieur') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keywords` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_fiche_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.user_fiche : ~2 rows (environ)
DELETE FROM `user_fiche`;
/*!40000 ALTER TABLE `user_fiche` DISABLE KEYS */;
INSERT INTO `user_fiche` (`id`, `lastname`, `firstname`, `description`, `diploma`, `cv1`, `linkedin`, `youtube`, `picture`, `availability`, `mobility`, `years_of_experiment`, `isCheck`, `create_at`, `update_at`, `isOpen_to_formation`, `user_id`, `cv2`, `civility`, `job`, `keywords`) VALUES
	(1, 'user1', 'user1', 'fhygfiufhfjodjopakvfavava', 'dvqdvffdv', 'sdqvqsdvqsdvqs', 'dvqsdvqsvqsdv', 'sdvsqdvqsdvqsdv', 'qsdvqsvqsvqsdvq', 5, 'sdfqsdfqsdfqsdfqsdfqsdfqsdf', 8, 0, '2021-01-03 14:55:04', '2021-01-20 14:55:04', 0, 1, NULL, NULL, NULL, NULL),
	(2, '', '', '', '', '', '', '', '', NULL, '', NULL, 0, '2021-01-25 14:55:04', NULL, 1, 2, '', 'Monsieur', '', NULL);
/*!40000 ALTER TABLE `user_fiche` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. user_language
DROP TABLE IF EXISTS `user_language`;
CREATE TABLE IF NOT EXISTS `user_language` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `language_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index 4` (`user_id`,`language_id`),
  KEY `user_language_ibfk_1` (`language_id`),
  CONSTRAINT `user_language_ibfk_1` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`),
  CONSTRAINT `user_language_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.user_language : ~6 rows (environ)
DELETE FROM `user_language`;
/*!40000 ALTER TABLE `user_language` DISABLE KEYS */;
INSERT INTO `user_language` (`id`, `user_id`, `language_id`) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(12, 2, 2),
	(13, 2, 5),
	(22, 3, 2),
	(23, 3, 4);
/*!40000 ALTER TABLE `user_language` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. user_sector_of_activity
DROP TABLE IF EXISTS `user_sector_of_activity`;
CREATE TABLE IF NOT EXISTS `user_sector_of_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `sector_of_activity_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `sector_of_activity_id` (`sector_of_activity_id`),
  CONSTRAINT `user_sector_of_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sector_of_activity_ibfk_2` FOREIGN KEY (`sector_of_activity_id`) REFERENCES `sector_of_activity` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.user_sector_of_activity : ~10 rows (environ)
DELETE FROM `user_sector_of_activity`;
/*!40000 ALTER TABLE `user_sector_of_activity` DISABLE KEYS */;
INSERT INTO `user_sector_of_activity` (`id`, `user_id`, `sector_of_activity_id`) VALUES
	(1, 1, 3),
	(2, 1, 12),
	(3, 1, 16),
	(4, 1, 20),
	(5, 1, 18),
	(6, 2, 2),
	(7, 2, 18),
	(8, 2, 14),
	(9, 3, 10),
	(10, 3, 11);
/*!40000 ALTER TABLE `user_sector_of_activity` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
