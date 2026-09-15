CREATE TABLE `wod_favorites` (
  `user_id` int NOT NULL,
  `wod_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`wod_id`),
  KEY `wod_favorites_wod_idx` (`wod_id`),
  KEY `wod_favorites_user_created_wod_idx` (`user_id`,`created_at`,`wod_id`),
  CONSTRAINT `wod_favorites_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wod_favorites_wod_fk` FOREIGN KEY (`wod_id`) REFERENCES `wods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
