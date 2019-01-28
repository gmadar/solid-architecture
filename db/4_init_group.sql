USE `core`;


CREATE TABLE `group`
(
 `group_id`             INT NOT NULL AUTO_INCREMENT,
 `name`       		    VARCHAR(45) ,
 `description`          TEXT ,
 `creator_user_id`      INT ,
 `end_date`             DATE NOT NULL ,
 `status`               ENUM('OPEN', 'CLOSE','CANCELED') NOT NULL ,
 `fake_amount`          INT ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`group_id`),
CONSTRAINT `fk__group__user` FOREIGN KEY (`creator_user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `group__area`
(
 `group_id`    INT NOT NULL ,
 `area_id` INT NOT NULL ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `fk__group_area__group` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE CASCADE,
CONSTRAINT `fk__group_area__area` FOREIGN KEY (`area_id`) REFERENCES `area` (`area_id`)
);

CREATE TABLE `group__city`
(
 `group_id` INT NOT NULL ,
 `city_id`  INT NOT NULL ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `fk__group_citie__group` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`) ON DELETE CASCADE,
CONSTRAINT `fk__group_citie__city` FOREIGN KEY  (`city_id`) REFERENCES `city` (`city_id`)
);
