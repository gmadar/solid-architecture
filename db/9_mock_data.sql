SET NAMES 'utf8';
SET CHARACTER SET 'utf8';

INSERT INTO `core`.`contact` (`contact_id`, `email`, `name`, `city_id`) VALUES ('1', 'liran@gmail.com', 'Liran Brimer', 1);
INSERT INTO `core`.`user` (`user_id`, `role`, `contact_id`) VALUES ('1', 'CONSUMER', '1');
INSERT INTO `core`.`user_auth_provider`(`auth_provider_user_id`,`provider`,`user_id`,`display_name`,`email`) VALUES ('10215574000515914', 'FACEBOOK', '1', 'Liran Brimer', 'liranbri@gmail.com');

INSERT INTO `core`.`supplier` (`supplier_id`, `name`, `phone`, `website`) VALUES ('1', 'Any Pet', '050-123-456', 'http://anypet.co.il');

INSERT INTO `core`.`group` (`group_id`, `name`,`description`,`creator_user_id`,`end_date`,`status`) VALUES (1, 'group from mock data', 'desc', NULL, '2020-01-01', 'OPEN');
INSERT INTO `core`.`group__area`(`group_id`,`area_id`) VALUES (1, 1);

/*
INSERT INTO `core`.`pet` (`pet_id`, `animal`, `name`, `owner_user_id`, `race_id`) VALUES ('1', 'DOG', 'willy', '1', '1');
INSERT INTO `core`.`pet` (`pet_id`, `animal`, `name`, `owner_user_id`, `race_id`) VALUES ('2', 'DOG', 'johny', '1', '2');

INSERT INTO `core`.`desired_product` (`desired_product_id`, `user_id`, `max_price`, `is_template`) VALUES ('1', '1', '300', 1);
INSERT INTO `core`.`desired_product__property_value` (`desired_product_id`, `property_value_id`) VALUES ('1', '1');
INSERT INTO `core`.`desired_product__property_value` (`desired_product_id`, `property_value_id`) VALUES ('1', '2');

INSERT INTO `core`.`pet__desired_product` (`pet_id`, `desired_product_id`) VALUES ('1', '1');


INSERT INTO `core`.`group` (`group_id`, `name`, `status`, `end_date`) VALUES ('1', 'קבוצת גוש דן', 'OPEN', '2019-01-01');
INSERT INTO `core`.`group__area` (`group_id`, `area_id`) VALUES ('1', '1');
INSERT INTO `core`.`group__area` (`group_id`, `area_id`) VALUES ('1', '2');
INSERT INTO `core`.`group__city` (`group_id`, `city_id`) VALUES ('1', '1');
INSERT INTO `core`.`group__desired_product` (`group_id`, `desired_product_id`) VALUES ('1', '1');
*/
