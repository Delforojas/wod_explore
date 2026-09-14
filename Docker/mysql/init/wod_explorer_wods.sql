-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: wod_explorer
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
  CONSTRAINT `wods_category_chk` CHECK ((`category` is null) or (`category` = _utf8mb4'METCON'))
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wods`
--

LOCK TABLES `wods` WRITE;
/*!40000 ALTER TABLE `wods` DISABLE KEYS */;
INSERT INTO `wods` (`id`,`name`,`type`,`time_limit`,`rounds`,`level`,`created_at`) VALUES (1,'Abbate','FOR_TIME',NULL,NULL,'RX','2026-09-07 22:07:31'),(2,'AdamBrown','FOR_TIME',NULL,2,'RX','2026-09-07 22:07:31'),(3,'Adrian','FOR_TIME',NULL,7,'RX','2026-09-07 22:07:31'),(4,'Badger','FOR_TIME',NULL,3,'RX','2026-09-07 22:07:31'),(5,'Blake','FOR_TIME',NULL,4,'RX','2026-09-07 22:07:31'),(6,'Arnie','FOR_TIME',NULL,NULL,'RX','2026-09-07 22:07:31'),(7,'Bradley','FOR_TIME',NULL,10,'RX','2026-09-07 22:07:31'),(8,'Brenton','FOR_TIME',NULL,5,'RX','2026-09-07 22:07:31'),(9,'Bradshaw','FOR_TIME',NULL,10,'RX','2026-09-07 22:07:31'),(10,'Brian','FOR_TIME',NULL,3,'RX','2026-09-07 22:07:31'),(11,'Bull','FOR_TIME',NULL,2,'RX','2026-09-07 22:07:31'),(12,'Bulger','FOR_TIME',NULL,10,'RX','2026-09-07 22:07:31'),(13,'Carse','FOR_TIME',NULL,7,'RX','2026-09-07 22:07:31'),(14,'Clovis','FOR_TIME',NULL,NULL,'RX','2026-09-07 22:07:31'),(15,'Collin','FOR_TIME',NULL,6,'RX','2026-09-07 22:07:31'),(16,'Coe','FOR_TIME',NULL,10,'RX','2026-09-07 22:07:31'),(17,'Dae Han','FOR_TIME',NULL,3,'RX','2026-09-07 22:07:31'),(18,'Danny','AMRAP',1200,NULL,'RX','2026-09-07 22:07:31'),(19,'Daniel','FOR_TIME',NULL,5,'RX','2026-09-07 22:07:31'),(20,'Del','FOR_TIME',NULL,NULL,'RX','2026-09-07 22:07:31'),(21,'DT','FOR_TIME',NULL,5,'RX','2026-09-07 22:07:31'),(22,'Desforges','FOR_TIME',NULL,5,'RX','2026-09-07 22:07:31');
/*!40000 ALTER TABLE `wods` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-08  0:13:16
