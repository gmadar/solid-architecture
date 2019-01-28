USE `core`;

SET NAMES 'utf8';
SET CHARACTER SET 'utf8';


INSERT INTO `core`.`area` (`area_id`, `area_name`) VALUES ('1', 'כל הארץ');


INSERT INTO `core`.`city` (`city_id`, `city_name`, `display_name`, `area_id`) VALUES ('1', 'תל אביב יפו', 'גוש דן', '1');
INSERT INTO `core`.`city` (`city_id`, `city_name`, `display_name`, `area_id`) VALUES ('2', 'רמת גן', 'גוש דן', '1');
INSERT INTO `core`.`city` (`city_id`, `city_name`, `display_name`, `area_id`) VALUES ('3', 'גבעתיים', 'גוש דן', '1');
INSERT INTO `core`.`city` (`city_id`, `city_name`, `display_name`, `area_id`) VALUES ('4', 'ירושלים', 'ירושלים', '1');
INSERT INTO `core`.`city` (`city_id`, `city_name`, `display_name`, `area_id`) VALUES ('5', 'חיפה', 'חיפה', '1');
INSERT INTO `core`.`city` (`city_id`, `city_name`, `display_name`, `area_id`) VALUES ('6', 'עכו', 'עכו', '1');
INSERT INTO `core`.`city` (`city_id`, `city_name`, `display_name`, `area_id`) VALUES ('7', 'אילת', 'אילת', '1');
