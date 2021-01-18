-- --------------------------------------------------------
-- Hôte :                        localhost
-- Version du serveur:           8.0.22 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour wordpress
CREATE DATABASE IF NOT EXISTS `wordpress` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `wordpress`;

-- Listage de la structure de la table wordpress. activity_area
CREATE TABLE IF NOT EXISTS `activity_area` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table wordpress. job
CREATE TABLE IF NOT EXISTS `job` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table wordpress. language
CREATE TABLE IF NOT EXISTS `language` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `language` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table wordpress. sector_of_activity
CREATE TABLE IF NOT EXISTS `sector_of_activity` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table wordpress. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `lastname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `firstname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `diploma` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activity_area_id` smallint NOT NULL,
  `awailability` smallint NOT NULL,
  `mobility` smallint NOT NULL,
  `years_of_experiment` smallint NOT NULL,
  `password` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mail` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `statut` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `create_at` datetime NOT NULL,
  `update_at` datetime DEFAULT NULL,
  `open_to_formation` bit(1) NOT NULL,
  `cv` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `linkedin` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `youtube` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `picture` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_user_activity_area` (`activity_area_id`),
  CONSTRAINT `FK_user_activity_area` FOREIGN KEY (`activity_area_id`) REFERENCES `activity_area` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table wordpress. user_job
CREATE TABLE IF NOT EXISTS `user_job` (
  `job_id` smallint NOT NULL DEFAULT '0',
  `user_id` smallint NOT NULL DEFAULT '0',
  KEY `FK_user_job_job` (`job_id`),
  KEY `FK_user_job_user` (`user_id`),
  CONSTRAINT `FK_user_job_job` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`),
  CONSTRAINT `FK_user_job_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table wordpress. user_language
CREATE TABLE IF NOT EXISTS `user_language` (
  `user_id` smallint NOT NULL,
  `language_id` smallint NOT NULL,
  KEY `FK_user_language_user` (`user_id`),
  KEY `FK_user_language_language` (`language_id`),
  CONSTRAINT `FK_user_language_language` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`),
  CONSTRAINT `FK_user_language_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table wordpress. user_sector_of_activity
CREATE TABLE IF NOT EXISTS `user_sector_of_activity` (
  `user_id` smallint NOT NULL DEFAULT '0',
  `sector_of_activity_id` smallint NOT NULL DEFAULT '0',
  KEY `FK_user_skill_user` (`user_id`),
  KEY `FK_user_skill_skill` (`sector_of_activity_id`),
  CONSTRAINT `FK_user_skill_skill` FOREIGN KEY (`sector_of_activity_id`) REFERENCES `sector_of_activity` (`id`),
  CONSTRAINT `FK_user_skill_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Les données exportées n'étaient pas sélectionnées.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
