USE `core`;


CREATE TABLE `product_manufacturer`
(
 `manufacturer_id`   INT NOT NULL AUTO_INCREMENT ,
 `manufacturer_name` VARCHAR(300) NOT NULL ,
 `website`           TEXT ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`manufacturer_id`)
) ENGINE=InnoDB;


CREATE TABLE `product_category`
(
 `product_category_id` VARCHAR(45) NOT NULL ,
 `category_name`       VARCHAR(150) NOT NULL ,
 `description`         TEXT ,
 `parent_category_id`  VARCHAR(45) ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`product_category_id`),
CONSTRAINT `fk__product_category__product_category` FOREIGN KEY (`parent_category_id`) REFERENCES `product_category` (`product_category_id`)
) ENGINE=InnoDB;


CREATE TABLE `property_type`
(
 `property_type_id` VARCHAR(45) NOT NULL ,
 `type_name`                VARCHAR(150) NOT NULL ,
 `unit`                     ENUM('KG', 'YEAR', 'LITTER'),
 `data_type`                ENUM('NUMBER', 'BOOLEAN', 'STRING') NOT NULL ,
 `metadata`                 JSON ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`property_type_id`)
) ENGINE=InnoDB COMMENT='Dog Size, Dog Weight, Dog Diet';


CREATE TABLE `property_value_option`
 (
  `property_type_id` VARCHAR(45) NOT NULL,
  `value_option_id` VARCHAR(45) NOT NULL,
  `label_eng` VARCHAR(150) NOT NULL,
  `label_heb` VARCHAR(150) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`property_type_id`, `value_option_id`),
  CONSTRAINT `fk__property_value_option__property_type` FOREIGN KEY (`property_type_id`) REFERENCES `property_type` (`property_type_id`)
) ENGINE=InnoDB COMMENT='available value options of each property type';


CREATE TABLE `property_value`
(
 `property_value_id`          INT NOT NULL AUTO_INCREMENT ,
 `property_type_id`           VARCHAR(45) NOT NULL ,
 `value`                      VARCHAR(150) NOT NULL ,
 `values_relation`            ENUM('SINGLE', 'MULTIPLE-AND', 'MULTIPLE-OR', 'RANGE-FROM', 'RANGE-TO') NOT NULL,
  `createdAt`                 timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`                 timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`property_value_id`),
CONSTRAINT `fk__property_value__property_type` FOREIGN KEY (`property_type_id`) REFERENCES `property_type` (`property_type_id`)
) ENGINE=InnoDB COMMENT='value of specific property.e.g: for \'dog weight\' it might be value \'12\', unit \'kg\', data type \'NUMBER\'';


CREATE TABLE `product`
(
 `product_id`          INT NOT NULL AUTO_INCREMENT ,
 `product_name_eng`    VARCHAR(300) ,
 `product_name_heb`    VARCHAR(300) ,
 `brand`               VARCHAR(300) ,
 `product_category_id` VARCHAR(45) NOT NULL ,
 `description`         TEXT ,
 `photo_url`           TEXT ,
 `manufacturer_id`     INT NOT NULL ,
 `price_unit`          ENUM('KG', 'LITTER') NOT NULL ,
 `dog_advisor_rating`  DECIMAL(10, 2) ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`product_id`),
CONSTRAINT `fk__product__product_category` FOREIGN KEY (`product_category_id`) REFERENCES `product_category` (`product_category_id`),
CONSTRAINT `fk__product__product_manufacturer` FOREIGN KEY (`manufacturer_id`) REFERENCES `product_manufacturer` (`manufacturer_id`)
) ENGINE=InnoDB;


CREATE TABLE `product_price`
(
 `product_price_id` INT             NOT NULL AUTO_INCREMENT ,
 `product_id`       INT             NOT NULL ,
 `price`            DECIMAL(10, 2)  NOT NULL ,
 `size`             DECIMAL(10, 2) ,
 `source_url`       TEXT            NOT NULL ,
 `comment`          TEXT ,
 `filled_by`        VARCHAR(300) ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`product_price_id`),
CONSTRAINT `fk__product_price__price` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE `product__property_value`
(
 `product_id`                INT NOT NULL ,
 `property_value_id` INT NOT NULL ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`product_id`, `property_value_id`),
CONSTRAINT `fk__product_property_value__property_value` FOREIGN KEY (`property_value_id`) REFERENCES `property_value` (`property_value_id`) ON DELETE CASCADE,
CONSTRAINT `fk__product_property_value__product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='each product has his own unique prop values. each prop value cant be shared with another product.';
