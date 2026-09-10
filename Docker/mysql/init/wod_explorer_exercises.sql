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
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` VALUES (1,'Back Squat','WEIGHTLIFTING','WEIGHT'),(2,'Bench Press','WEIGHTLIFTING','WEIGHT'),(3,'Squat Clean','WEIGHTLIFTING','WEIGHT'),(4,'Clean & Jerk','WEIGHTLIFTING','WEIGHT'),(5,'Deadlift','WEIGHTLIFTING','WEIGHT'),(6,'Front Squat','WEIGHTLIFTING','WEIGHT'),(7,'Push Jerk','WEIGHTLIFTING','WEIGHT'),(8,'One-handed Snatch','WEIGHTLIFTING','WEIGHT'),(9,'Overhead Squat','WEIGHTLIFTING','WEIGHT'),(10,'Power Clean','WEIGHTLIFTING','WEIGHT'),(11,'Power Snatch','WEIGHTLIFTING','WEIGHT'),(12,'Push Press','WEIGHTLIFTING','WEIGHT'),(13,'Shoulder Press','WEIGHTLIFTING','WEIGHT'),(14,'Squat Snatch','WEIGHTLIFTING','WEIGHT'),(15,'Thruster','WEIGHTLIFTING','WEIGHT'),(16,'Turkish Get-up','GYMNASTICS','WEIGHT'),(17,'Weighted Pull-up','GYMNASTICS','WEIGHT'),(18,'Weighted Ring Dip','GYMNASTICS','WEIGHT'),(19,'Pistol Squat','GYMNASTICS','REPS'),(20,'Hang Squat Clean','WEIGHTLIFTING','WEIGHT'),(21,'Hang Power Clean','WEIGHTLIFTING','WEIGHT'),(22,'Hang Squat Snatch','WEIGHTLIFTING','WEIGHT'),(23,'Hang Power Snatch','WEIGHTLIFTING','WEIGHT'),(24,'Cluster','WEIGHTLIFTING','WEIGHT'),(25,'Floor Press','WEIGHTLIFTING','WEIGHT'),(26,'Sumo Deadlift','WEIGHTLIFTING','WEIGHT'),(27,'Split Jerk','WEIGHTLIFTING','WEIGHT'),(28,'Bent Row','WEIGHTLIFTING','WEIGHT'),(29,'Box Squat Below Parallel','WEIGHTLIFTING','WEIGHT'),(30,'Box Squat Above Parallel','WEIGHTLIFTING','WEIGHT'),(31,'Hip Thrust','WEIGHTLIFTING','WEIGHT'),(32,'Barbell Lunges','WEIGHTLIFTING','WEIGHT'),(33,'Push Up','GYMNASTICS','REPS'),(34,'Good Morning','WEIGHTLIFTING','WEIGHT'),(35,'Good Morning Halterofilia','WEIGHTLIFTING','WEIGHT'),(36,'High Power Snatch','WEIGHTLIFTING','WEIGHT'),(37,'High Squat Snatch','WEIGHTLIFTING','WEIGHT'),(38,'Snatch Deadlift','WEIGHTLIFTING','WEIGHT'),(39,'Sumo Deadlift High Pull','WEIGHTLIFTING','WEIGHT'),(40,'Muscle Snatch','WEIGHTLIFTING','WEIGHT'),(41,'Hang Muscle Snatch','WEIGHTLIFTING','WEIGHT'),(42,'Overhead Lunges','WEIGHTLIFTING','WEIGHT'),(43,'Muscle Clean','WEIGHTLIFTING','WEIGHT'),(44,'Snatch Balance','WEIGHTLIFTING','WEIGHT'),(45,'Weighted Chest to Bar','GYMNASTICS','WEIGHT'),(46,'Bench Row','WEIGHTLIFTING','WEIGHT'),(47,'Seal Row','WEIGHTLIFTING','WEIGHT'),(48,'Pendlay Row','WEIGHTLIFTING','WEIGHT'),(49,'Power Cluster','WEIGHTLIFTING','WEIGHT'),(50,'Snatch Push Press','WEIGHTLIFTING','WEIGHT'),(51,'Back Squat Barra Baja','WEIGHTLIFTING','WEIGHT'),(52,'Semi Sumo Deadlift','WEIGHTLIFTING','WEIGHT'),(53,'Safety Bar Squat','WEIGHTLIFTING','WEIGHT'),(54,'Trap Bar Deadlift','WEIGHTLIFTING','WEIGHT'),(55,'Rack Pull','WEIGHTLIFTING','WEIGHT'),(56,'Weighted Pull-Up Supina','GYMNASTICS','WEIGHT'),(57,'Narrow Grip Bench Press','WEIGHTLIFTING','WEIGHT'),(58,'Inclined Bench Press','WEIGHTLIFTING','WEIGHT'),(59,'Biceps Curl Barbell','OTHER','WEIGHT'),(60,'Slightly Inclined Shoulder Press Mancuernas','OTHER','WEIGHT'),(61,'Straight Seated Shoulder Press','OTHER','WEIGHT'),(62,'Slightly Inclined Shoulder Press Barra','OTHER','WEIGHT'),(63,'Kettlebell Lunge','OTHER','WEIGHT'),(64,'Dumbbell Lunges','OTHER','WEIGHT'),(65,'Glute Bridge Bar','OTHER','WEIGHT'),(66,'Romanian Deadlift','WEIGHTLIFTING','WEIGHT'),(67,'Strict Press','WEIGHTLIFTING','WEIGHT'),(68,'High Hang Power Snatch','WEIGHTLIFTING','WEIGHT'),(69,'High Hang Squat Snatch','WEIGHTLIFTING','WEIGHT'),(70,'Low Hang Power Snatch','WEIGHTLIFTING','WEIGHT'),(71,'Low Hang Squat Snatch','WEIGHTLIFTING','WEIGHT'),(72,'High Hang Power Clean','WEIGHTLIFTING','WEIGHT'),(73,'High Hang Squat Clean','WEIGHTLIFTING','WEIGHT'),(74,'Low Hang Power Clean','WEIGHTLIFTING','WEIGHT'),(75,'Low Hang Squat Clean','WEIGHTLIFTING','WEIGHT'),(76,'Zercher Squat','WEIGHTLIFTING','WEIGHT'),(77,'Front Rack Lunges','WEIGHTLIFTING','WEIGHT'),(78,'Bulgarian Squat','WEIGHTLIFTING','WEIGHT'),(79,'Farmer Carry 15m','STRONGMAN','WEIGHT_DISTANCE'),(80,'Yoke Carry 15m','STRONGMAN','WEIGHT_DISTANCE'),(81,'Sandbag Clean','STRONGMAN','WEIGHT'),(82,'Back Rack Reverse Lunge','WEIGHTLIFTING','WEIGHT'),(83,'Grip Strength','STRONGMAN','WEIGHT'),(84,'Trap Bar Squat','WEIGHTLIFTING','WEIGHT'),(85,'Weighted Push Up','GYMNASTICS','WEIGHT'),(86,'Weighted Chin Up','GYMNASTICS','WEIGHT'),(87,'Pulldown Polea','OTHER','WEIGHT'),(88,'Sled Push','STRONGMAN','WEIGHT_DISTANCE'),(89,'Sled Pull','STRONGMAN','WEIGHT_DISTANCE'),(90,'Weighted Ring Push Up','GYMNASTICS','WEIGHT'),(91,'Weighted Dips','GYMNASTICS','WEIGHT'),(92,'Bench Press Dumbbells','WEIGHTLIFTING','WEIGHT'),(93,'Low Row','OTHER','WEIGHT'),(94,'Landmine Press','WEIGHTLIFTING','WEIGHT'),(95,'Renegade Row','WEIGHTLIFTING','WEIGHT'),(96,'Sled Drag','STRONGMAN','WEIGHT_DISTANCE'),(97,'Pendulum Press','WEIGHTLIFTING','WEIGHT'),(98,'Dumbbell Thruster','WEIGHTLIFTING','WEIGHT'),(99,'Curl Bíceps 45°','OTHER','WEIGHT'),(100,'Extensión de Tríceps Katana','OTHER','WEIGHT'),(101,'Cruces Invertidas','OTHER','WEIGHT'),(102,'Cruces en Polea Pectoral Sentado','OTHER','WEIGHT'),(103,'Cruces en Polea Pectoral de Pie','OTHER','WEIGHT'),(104,'Sissy Squat','OTHER','REPS'),(105,'Split Squat','OTHER','REPS'),(106,'Crunch Invertido','GYMNASTICS','REPS'),(107,'Leg Curl Tumbado','OTHER','WEIGHT'),(108,'Leg Curl de Pie','OTHER','WEIGHT'),(109,'40m DB Farmer Carry','STRONGMAN','WEIGHT_DISTANCE'),(110,'GHD Sit-Ups','GYMNASTICS','REPS'),(111,'Javelin Press','WEIGHTLIFTING','WEIGHT'),(112,'Clean Pull','WEIGHTLIFTING','WEIGHT'),(113,'Run','CARDIO','DISTANCE'),(114,'Row','CARDIO','DISTANCE'),(115,'Swim','CARDIO','DISTANCE'),(116,'Double Under','CARDIO','REPS'),(117,'Single Under','CARDIO','REPS'),(118,'Pull-up','GYMNASTICS','REPS'),(119,'Chest to Bar Pull-up','GYMNASTICS','REPS'),(120,'Muscle-up','GYMNASTICS','REPS'),(121,'Ring Muscle-up','GYMNASTICS','REPS'),(122,'Handstand Push-up','GYMNASTICS','REPS'),(123,'Handstand Walk','GYMNASTICS','DISTANCE'),(124,'Parallel Handstand Push-up','GYMNASTICS','REPS'),(125,'Burpee','GYMNASTICS','REPS'),(126,'Bar-facing Burpee','GYMNASTICS','REPS'),(127,'Burpee Pull-up','GYMNASTICS','REPS'),(128,'Burpee Box Jump','GYMNASTICS','REPS'),(129,'Box Jump','GYMNASTICS','REPS'),(130,'Box Jump Over','GYMNASTICS','REPS'),(131,'Broad Jump','GYMNASTICS','REPS'),(132,'Standing Broad Jump','GYMNASTICS','REPS'),(133,'Air Squat','GYMNASTICS','REPS'),(134,'Squat','GYMNASTICS','REPS'),(135,'Sit-up','GYMNASTICS','REPS'),(136,'AbMat Sit-up','GYMNASTICS','REPS'),(137,'Knees to Elbows','GYMNASTICS','REPS'),(138,'Toes to Bar','GYMNASTICS','REPS'),(139,'Rope Climb','GYMNASTICS','REPS'),(140,'Legless Rope Climb','GYMNASTICS','REPS'),(141,'Ring Push-up','GYMNASTICS','REPS'),(142,'Ring Row','GYMNASTICS','REPS'),(143,'Bear Crawl','GYMNASTICS','DISTANCE'),(144,'Wall Ball','WEIGHTLIFTING','REPS'),(145,'Medicine Ball Clean','WEIGHTLIFTING','WEIGHT'),(146,'Medicine Ball Run','WEIGHTLIFTING','WEIGHT_DISTANCE'),(147,'Kettlebell Swing','WEIGHTLIFTING','WEIGHT'),(148,'Kettlebell Clean and Jerk','WEIGHTLIFTING','WEIGHT'),(149,'Kettlebell Front Squat','WEIGHTLIFTING','WEIGHT'),(150,'Dumbbell Snatch','WEIGHTLIFTING','WEIGHT'),(151,'Dumbbell Hang Squat Clean','WEIGHTLIFTING','WEIGHT'),(152,'Dumbbell Hang Split Snatch','WEIGHTLIFTING','WEIGHT'),(153,'Dumbbell Split Clean','WEIGHTLIFTING','WEIGHT'),(154,'Dumbbell Deadlift','WEIGHTLIFTING','WEIGHT'),(155,'Walking Lunge','GYMNASTICS','REPS'),(156,'Walking Lunge Weighted','WEIGHTLIFTING','WEIGHT'),(157,'Sandbag Carry','STRONGMAN','WEIGHT_DISTANCE'),(158,'Box Extension','OTHER','REPS'),(159,'Bar Muscle-up','GYMNASTICS','REPS'),(160,'Strict Pull-up','GYMNASTICS','REPS'),(161,'Strict Chest-to-Bar Pull-up','GYMNASTICS','REPS'),(162,'Strict Ring Dip','GYMNASTICS','REPS'),(163,'Ring Dip','GYMNASTICS','REPS'),(164,'Deficit Handstand Push-up','GYMNASTICS','REPS'),(165,'Hand-release Push-up','GYMNASTICS','REPS'),(166,'Shuttle Run','CARDIO','DISTANCE'),(167,'Shuttle Sprint','CARDIO','DISTANCE'),(168,'Back Extension','GYMNASTICS','REPS'),(169,'Mountain Climber','GYMNASTICS','REPS'),(170,'Shoulder-to-Overhead','WEIGHTLIFTING','WEIGHT'),(171,'Waiter Walk','STRONGMAN','WEIGHT_DISTANCE'),(172,'Waiter Carry','STRONGMAN','WEIGHT_DISTANCE'),(173,'Buddy Carry','STRONGMAN','DISTANCE'),(174,'Single-arm Barbell Farmer Carry','STRONGMAN','WEIGHT_DISTANCE'),(175,'Running Farmer Carry','STRONGMAN','WEIGHT_DISTANCE'),(176,'Farmer Walk','STRONGMAN','WEIGHT_DISTANCE'),(177,'Barbell Hack Squat','WEIGHTLIFTING','WEIGHT'),(178,'Clean','WEIGHTLIFTING','WEIGHT'),(179,'Forward Roll','GYMNASTICS','REPS'),(180,'Wall Climb','GYMNASTICS','REPS');
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
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
