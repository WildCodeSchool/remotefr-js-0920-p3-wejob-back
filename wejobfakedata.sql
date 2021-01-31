-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           5.7.24 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour wejob_back
CREATE DATABASE IF NOT EXISTS `wejob_back` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `wejob_back`;

-- Listage de la structure de la table wejob_back. job
CREATE TABLE IF NOT EXISTS `job` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `job_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.job : ~10 rows (environ)
/*!40000 ALTER TABLE `job` DISABLE KEYS */;
INSERT INTO `job` (`id`, `name`, `user_id`) VALUES
	(1, 'developpeur', 1),
	(2, 'caissier', 1),
	(3, 'boulanger', 1),
	(4, 'patissier', 2),
	(5, 'professeur', 2),
	(6, 'animateur', 1),
	(7, 'technicien', 1),
	(8, 'vendeur', 2),
	(9, 'mecanicien', 2),
	(10, 'paysagiste', 3);
/*!40000 ALTER TABLE `job` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. language
CREATE TABLE IF NOT EXISTS `language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.language : ~6 rows (environ)
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` (`id`, `language`) VALUES
	(1, 'francais'),
	(2, 'anglais'),
	(3, 'espagnol'),
	(4, 'latin'),
	(5, 'allemand'),
	(6, 'chinois');
/*!40000 ALTER TABLE `language` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. sector_of_activity
CREATE TABLE IF NOT EXISTS `sector_of_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.sector_of_activity : ~21 rows (environ)
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
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.user : ~2 rows (environ)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `email`, `password`, `isAdmin`) VALUES
	(1, 'fff@ff.fr', 'omomom', 0),
	(2, 'jo@jo.com', 'dsosdhjcsdc', 0),
	(3, 'nanana@gmail.com', 'oisdjvoisdjvio', 0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. user_fiche
CREATE TABLE IF NOT EXISTS `user_fiche` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `diploma` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `picture` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availability` int(11) DEFAULT NULL,
  `mobility` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `years_of_experiment` int(11) DEFAULT NULL,
  `isCheck` tinyint(1) DEFAULT '0',
  `create_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `isOpen_to_formation` tinyint(1) DEFAULT '0',
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_fiche_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.user_fiche : ~2 rows (environ)
/*!40000 ALTER TABLE `user_fiche` DISABLE KEYS */;
INSERT INTO `user_fiche` (`id`, `lastname`, `firstname`, `description`, `diploma`, `cv`, `linkedin`, `youtube`, `picture`, `availability`, `mobility`, `years_of_experiment`, `isCheck`, `create_at`, `update_at`, `isOpen_to_formation`, `user_id`) VALUES
	(1, 'user1', 'user1', 'fhygfiufhfjodjopakvfavava', 'dvqdvffdv', 'sdqvqsdvqsdvqs', 'dvqsdvqsvqsdv', 'sdvsqdvqsdvqsdv', 'qsdvqsvqsvqsdvq', 5, 'sdfqsdfqsdfqsdfqsdfqsdfqsdf', 8, 0, '2021-01-03 14:55:04', '2021-01-20 14:55:04', 0, 1),
	(2, 'user2', 'user2', 'dsfgsfdgsdfgsdfg', 'gfsdgdfsg', 'sdfgsdfgsdfgsd', 'fgsdfgsdfg', 'sfdgsdfgsd', 'fgsdfgsdfgsdfg', 1, 'fdfdvbfdgbsfdsdf', 8, 0, '2021-01-25 14:55:04', '2021-01-21 14:55:04', 0, 2);
/*!40000 ALTER TABLE `user_fiche` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. user_language
CREATE TABLE IF NOT EXISTS `user_language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index 4` (`user_id`,`language_id`),
  KEY `user_language_ibfk_1` (`language_id`),
  CONSTRAINT `user_language_ibfk_1` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`),
  CONSTRAINT `user_language_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.user_language : ~4 rows (environ)
/*!40000 ALTER TABLE `user_language` DISABLE KEYS */;
INSERT INTO `user_language` (`id`, `user_id`, `language_id`) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(3, 2, 1),
	(4, 2, 6);
/*!40000 ALTER TABLE `user_language` ENABLE KEYS */;

-- Listage de la structure de la table wejob_back. user_sector_of_activity
CREATE TABLE IF NOT EXISTS `user_sector_of_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `sector_of_activity_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `sector_of_activity_id` (`sector_of_activity_id`),
  CONSTRAINT `user_sector_of_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sector_of_activity_ibfk_2` FOREIGN KEY (`sector_of_activity_id`) REFERENCES `sector_of_activity` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table wejob_back.user_sector_of_activity : ~8 rows (environ)
/*!40000 ALTER TABLE `user_sector_of_activity` DISABLE KEYS */;
INSERT INTO `user_sector_of_activity` (`id`, `user_id`, `sector_of_activity_id`) VALUES
	(1, 1, 3),
	(2, 1, 12),
	(3, 1, 16),
	(4, 1, 20),
	(5, 1, 18),
	(6, 2, 2),
	(7, 2, 18),
	(8, 2, 14);
/*!40000 ALTER TABLE `user_sector_of_activity` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
