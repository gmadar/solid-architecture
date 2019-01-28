USE `core`;


CREATE TABLE `area` (
  `area_id`   int(11) NOT NULL,
  `area_name` varchar(300) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`area_id`)
) ENGINE=InnoDB;

CREATE TABLE `city` (
  `city_id` int(11) NOT NULL,
  `city_name` varchar(300) NOT NULL,
  `display_name` varchar(300) NOT NULL,
  `area_id` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`city_id`),
  CONSTRAINT `fk__city__area` FOREIGN KEY (`area_id`) REFERENCES `area` (`area_id`)
) ENGINE=InnoDB;

CREATE TABLE `contact` (
  `contact_id`  int(11) NOT NULL AUTO_INCREMENT,
  `email`       varchar(45) ,
  `name`        varchar(50) ,
  `city_id`     int(11) ,
  `phone_1`     varchar(45) ,
  `phone_2`     varchar(45) ,
  `fax`         varchar(45) ,
  `address`     TEXT ,
  `door_code`   varchar(45) ,
  `floor`       varchar(45) ,
  `is_leave_shipment_next_door` bit(1) ,
  `photo`       blob ,
  `is_agreed_to_commercial` bit(1) NOT NULL DEFAULT 0 ,
  `createdAt`   timestamp NULL DEFAULT NULL,
  `updatedAt`   timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`contact_id`),
  CONSTRAINT `fk__contact__city` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`)
) ENGINE=InnoDB;

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `role`    enum('CONSUMER', 'SUPPLIER', 'ADMIN') NOT NULL,
  `contact_id` int(11) NOT NULL,
  `last_login_utc` timestamp ,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk__user__contact` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`contact_id`)
) ENGINE=InnoDB;

DELIMITER $$
CREATE TRIGGER rev_cascade__user__contact
AFTER DELETE ON `user`
FOR EACH ROW
BEGIN
	DELETE FROM `contact` WHERE contact_id = old.contact_id;
END$$


CREATE TABLE `user_auth_provider` (
  `auth_provider_user_id` varchar(45) NOT NULL,
  `provider` enum('FACEBOOK', 'GOOGLE') NOT NULL,
  `user_id` int(11) NOT NULL,
  `display_name` varchar(300),
  `email` varchar(300),
  `email_2` varchar(300),
  `photo_url` text,
  `gender` varchar(45),
  `city_id` varchar(100),
  `city_name` varchar(300),
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`auth_provider_user_id`, `provider`),
  CONSTRAINT `fk__user_auth_provider__user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE `supplier`
(
 `supplier_id`          INT NOT NULL AUTO_INCREMENT ,
 `name`                 varchar(300) ,
 `phone`                TEXT ,
 `website`              TEXT ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB;
