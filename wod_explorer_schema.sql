-- MySQL dump 10.13  Distrib 8.4.11, for Linux (aarch64)
--
-- Host: localhost    Database: wod_explorer
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `exercise_results`
--

DROP TABLE IF EXISTS `exercise_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `exercise_id` int NOT NULL,
  `value` decimal(8,2) NOT NULL,
  `unit` enum('KG','REPS','SECONDS','METERS') NOT NULL,
  `record_type` enum('1RM','3RM','5RM','10RM','MAX_REPS','BEST_TIME') NOT NULL,
  `performed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `exercise_id` (`exercise_id`),
  KEY `exercise_results_user_performed_id_idx` (`user_id`,`performed_at`,`id`),
  CONSTRAINT `exercise_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `exercise_results_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` enum('WEIGHTLIFTING','GYMNASTICS','STRONGMAN','CARDIO','OTHER') DEFAULT NULL,
  `measurement_type` enum('WEIGHT','REPS','TIME','DISTANCE','WEIGHT_DISTANCE','OTHER') NOT NULL DEFAULT 'REPS',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wod_exercise_prescriptions`
--

DROP TABLE IF EXISTS `wod_exercise_prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wod_exercise_prescriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wod_exercise_id` int NOT NULL,
  `value` decimal(8,2) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `unit_label` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wod_exercise_prescriptions_unit_uk` (`wod_exercise_id`,`unit`),
  KEY `wod_exercise_prescriptions_wod_exercise_idx` (`wod_exercise_id`),
  CONSTRAINT `wod_exercise_prescriptions_wod_exercise_fk` FOREIGN KEY (`wod_exercise_id`) REFERENCES `wod_exercises` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wod_exercise_prescriptions_integer_unit_chk` CHECK (((`unit` not in (_latin1'REPS',_latin1'SECONDS')) or (`value` = floor(`value`)))),
  CONSTRAINT `wod_exercise_prescriptions_label_chk` CHECK ((((`unit` = _latin1'OTHER') and (`unit_label` is not null) and (char_length(trim(`unit_label`)) > 0)) or ((`unit` <> _latin1'OTHER') and (`unit_label` is null)))),
  CONSTRAINT `wod_exercise_prescriptions_unit_chk` CHECK ((`unit` in (_latin1'REPS',_latin1'METERS',_latin1'KG',_latin1'SECONDS',_latin1'OTHER'))),
  CONSTRAINT `wod_exercise_prescriptions_value_chk` CHECK ((`value` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wod_exercises`
--

DROP TABLE IF EXISTS `wod_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wod_exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wod_id` int NOT NULL,
  `exercise_id` int NOT NULL,
  `reps` int DEFAULT NULL,
  `position` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wod_exercises_wod_position_uk` (`wod_id`,`position`),
  KEY `wod_id` (`wod_id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `wod_exercises_ibfk_1` FOREIGN KEY (`wod_id`) REFERENCES `wods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wod_exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `wod_exercises_position_chk` CHECK ((`position` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wod_results`
--

DROP TABLE IF EXISTS `wod_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wod_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `wod_id` int NOT NULL,
  `time_seconds` int DEFAULT NULL,
  `rounds` int DEFAULT NULL,
  `reps` int DEFAULT NULL,
  `level` enum('BEGINNER','INTERMEDIATE','RX') NOT NULL,
  `completed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `wod_id` (`wod_id`),
  KEY `wod_results_user_completed_id_idx` (`user_id`,`completed_at`,`id`),
  CONSTRAINT `wod_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wod_results_ibfk_2` FOREIGN KEY (`wod_id`) REFERENCES `wods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wods`
--

DROP TABLE IF EXISTS `wods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('FOR_TIME','AMRAP','EMOM') NOT NULL,
  `time_limit` int DEFAULT NULL,
  `rounds` int DEFAULT NULL,
  `level` enum('BEGINNER','INTERMEDIATE','RX') NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `wods_owner_created_id_idx` (`owner_id`,`created_at`,`id`),
  CONSTRAINT `wods_owner_fk` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wods_category_chk` CHECK (((`category` is null) or (`category` = _latin1'METCON')))
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'wod_explorer'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-14 15:31:38
