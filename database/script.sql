--
-- Database: `we_job`
--
CREATE DATABASE we_job
CHARACTER SET 'utf8';

USE we_job;

-- --------------------------------------------------------

--
-- Table structure for table `activity_area`
--

CREATE TABLE `activity_area` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `diploma`
--

CREATE TABLE `diploma` (
  `id` SMALLINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `job`
--

CREATE TABLE `job` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
  `id` SMALLINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

CREATE TABLE `skill` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(255) DEFAULT NULL,
  `lastname` VARCHAR(255) DEFAULT NULL,
  `gender` VARCHAR(10) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(50) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT NULL,
  `create_at` DATETIME DEFAULT NULL,
  `update_at` DATETIME NOT NULL,
  `adress1` VARCHAR(255) DEFAULT NULL,
  `adress2` VARCHAR(255) NOT NULL,
  `postal_code` INTEGER DEFAULT NULL,
  `city` VARCHAR(255) DEFAULT NULL,
  `mobile` INTEGER NOT NULL,
  `landline` INTEGER NOT NULL,
  `description` TEXT,
  `availability` SMALLINT DEFAULT NULL,
  `year_of_exp` SMALLINT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_activity_area`
--

CREATE TABLE `user_activity_area` (
  `activity_area_id` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  PRIMARY KEY (`activity_area_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_diploma`
--

CREATE TABLE `user_diploma` (
  `diploma_id` SMALLINT NOT NULL,
  `user_id` INTEGER NOT NULL,
  `year_of_graduation` DATE DEFAULT NULL,
  PRIMARY KEY (`diploma_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_job`
--

CREATE TABLE `user_job` (
  `job_id` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  PRIMARY KEY (`job_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_language`
--

CREATE TABLE `user_language` (
  `user_id` INTEGER NOT NULL,
  `language_id` SMALLINT NOT NULL,
  `level` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_skill`
--

CREATE TABLE `user_skill` (
  `user_id` INTEGER NOT NULL,
  `skill_id` SMALLINT NOT NULL,
  PRIMARY KEY (`user_id`,`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_activity_area`
--
ALTER TABLE `user_activity_area`
  ADD KEY `user_user_activity_area_fk` (`user_id`);

--
-- Indexes for table `user_diploma`
--
ALTER TABLE `user_diploma`
  ADD KEY `user_user_diploma_fk` (`user_id`);

--
-- Indexes for table `user_job`
--
ALTER TABLE `user_job`
  ADD KEY `user_user_job_fk` (`user_id`);

--
-- Indexes for table `user_language`
--
ALTER TABLE `user_language`
  ADD KEY `language_user_language_fk` (`language_id`);

--
-- Indexes for table `user_skill`
--
ALTER TABLE `user_skill`
  ADD KEY `skill_user_skill_fk` (`skill_id`);


--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_activity_area`
--
ALTER TABLE user_activity_area 
ADD CONSTRAINT activity_area_user_activity_area_fk
FOREIGN KEY (activity_area_id)
REFERENCES activity_area (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE user_activity_area 
ADD CONSTRAINT user_user_activity_area_fk
FOREIGN KEY (user_id)
REFERENCES user (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

--
-- Constraints for table `user_diploma`
--
ALTER TABLE user_diploma 
ADD CONSTRAINT diploma_user_diploma_fk
FOREIGN KEY (diploma_id)
REFERENCES diploma (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE user_diploma 
ADD CONSTRAINT user_user_diploma_fk
FOREIGN KEY (user_id)
REFERENCES user (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

--
-- Constraints for table `user_job`
--
ALTER TABLE user_job 
ADD CONSTRAINT job_user_job_fk
FOREIGN KEY (job_id)
REFERENCES job (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE user_job 
ADD CONSTRAINT user_user_job_fk
FOREIGN KEY (user_id)
REFERENCES user (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

--
-- Constraints for table `user_language`
--
ALTER TABLE user_language 
ADD CONSTRAINT language_user_language_fk
FOREIGN KEY (language_id)
REFERENCES _language (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE user_language 
ADD CONSTRAINT user_user_language_fk
FOREIGN KEY (user_id)
REFERENCES user (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

--
-- Constraints for table `user_skill`
--
ALTER TABLE user_skill 
ADD CONSTRAINT skill_user_skill_fk
FOREIGN KEY (skill_id)
REFERENCES skill (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE user_skill 
ADD CONSTRAINT user_user_skill_fk
FOREIGN KEY (user_id)
REFERENCES user (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;