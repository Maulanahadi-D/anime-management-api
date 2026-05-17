-- MySQL dump 10.13  Distrib 8.4.7, for Win64 (x86_64)
--
-- Host: localhost    Database: anime_management
-- ------------------------------------------------------
-- Server version	8.4.7

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
-- Table structure for table `anime`
--

DROP TABLE IF EXISTS `anime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `episodes` int DEFAULT NULL,
  `studio` varchar(100) DEFAULT NULL,
  `release_year` year DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anime`
--

LOCK TABLES `anime` WRITE;
/*!40000 ALTER TABLE `anime` DISABLE KEYS */;
INSERT INTO `anime` VALUES (1,'Demon Slayer',26,'Ufotable',2019),(2,'Jujutsu Kaisen',24,'MAPPA',2020),(3,'Attack on Titan',87,'MAPPA',2013),(4,'Spy x Family',25,'Wit Studio',2022),(5,'One Piece',1000,'Toei Animation',1999),(6,'My Hero Academia',113,'Bones',2016),(7,'Fullmetal Alchemist: Brotherhood',64,'Bones',2009),(8,'Chainsaw Man',12,'MAPPA',2022),(9,'Death Note',37,'Madhouse',2006),(10,'Naruto',720,'Pierrot',2002);
/*!40000 ALTER TABLE `anime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anime_genres`
--

DROP TABLE IF EXISTS `anime_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anime_genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `anime_id` int DEFAULT NULL,
  `genre_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `anime_id` (`anime_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `anime_genres_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`),
  CONSTRAINT `anime_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anime_genres`
--

LOCK TABLES `anime_genres` WRITE;
/*!40000 ALTER TABLE `anime_genres` DISABLE KEYS */;
INSERT INTO `anime_genres` VALUES (1,1,1),(2,1,2),(3,1,5),(4,1,11),(5,2,1),(6,2,5),(7,2,11),(8,3,1),(9,3,4),(10,3,5),(11,3,6),(12,4,1),(13,4,3),(14,4,10),(15,5,1),(16,5,2),(17,5,3),(18,5,5),(19,6,1),(20,6,3),(21,6,11),(22,7,1),(23,7,2),(24,7,4),(25,7,5),(26,8,1),(27,8,6),(28,8,11),(29,9,4),(30,9,11),(31,9,12),(32,10,1),(33,10,2),(34,10,3),(35,10,5);
/*!40000 ALTER TABLE `anime_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Action'),(2,'Adventure'),(3,'Comedy'),(4,'Drama'),(5,'Fantasy'),(6,'Horror'),(7,'Mecha'),(8,'Romance'),(9,'Sci-Fi'),(10,'Slice of Life'),(11,'Supernatural'),(12,'Thriller');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `anime_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `anime_id` (`anime_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,9,'Animasi yang luar biasa! Pertarungan sangat epik dan emosional. Salah satu anime terbaik yang pernah saya tonton.'),(2,1,2,9,'Sistem pertarungan yang unik dan karakter yang menarik. Gojo sensei adalah yang terbaik!'),(3,2,1,9,'Visual effects dan soundtrack-nya perfect! Tidak sabar menunggu season berikutnya.'),(4,2,3,10,'Masterpiece! Plot twist yang tidak terduga. Anime ini mengubah standar industri anime.'),(5,3,2,8,'Action scenes sangat memukau. Animasi MAPPA tidak pernah mengecewakan.'),(6,3,4,8,'Konsep cerita yang segar dan lucu. Anya sangat menggemaskan!'),(7,1,3,10,'Cerita yang gelap dan kompleks. Character development yang sangat baik.'),(8,2,4,9,'Kombinasi action dan comedy yang pas. Highly recommended!'),(9,3,5,9,'Walaupun panjang, One Piece adalah legenda. World building terbaik!'),(10,1,7,10,'Alkimia dan filosofi yang mendalam. Ending yang memuaskan!'),(11,2,6,8,'Konsep superhero yang fresh! Plus ultra!'),(12,3,8,9,'Chainsaw Man brutal dan unik. Denji adalah protagonist yang menarik.'),(13,1,9,10,'Death Note adalah thriller psikologis terbaik. L vs Light epic!');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'animefan1','animefan1@email.com','password123'),(2,'otaku_master','otaku@email.com','password123'),(3,'weeb_warrior','weeb@email.com','password123');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watchlists`
--

DROP TABLE IF EXISTS `watchlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watchlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `anime_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `anime_id` (`anime_id`),
  CONSTRAINT `watchlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `watchlists_ibfk_2` FOREIGN KEY (`anime_id`) REFERENCES `anime` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watchlists`
--

LOCK TABLES `watchlists` WRITE;
/*!40000 ALTER TABLE `watchlists` DISABLE KEYS */;
INSERT INTO `watchlists` VALUES (1,1,1,'Completed'),(2,1,2,'Completed'),(3,1,3,'Watching'),(4,1,4,'Watching'),(5,1,7,'Plan to Watch'),(6,1,8,'Plan to Watch'),(7,2,1,'Completed'),(8,2,3,'Completed'),(9,2,5,'Watching'),(10,2,6,'Watching'),(11,2,9,'Completed'),(12,3,2,'Watching'),(13,3,4,'Completed'),(14,3,6,'Plan to Watch'),(15,3,8,'Watching'),(16,3,10,'Plan to Watch');
/*!40000 ALTER TABLE `watchlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-07 15:01:37
