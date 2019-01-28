USE `core`;


CREATE TABLE `desired_product`
(
 `desired_product_id`      INT NOT NULL AUTO_INCREMENT ,
 `base_desired_product_id` INT ,
 `user_id`                 INT NOT NULL ,
 `existing_product_id`     INT ,
 `exact_existing_product`  BIT(1) ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`desired_product_id`),
CONSTRAINT `fk__desired_product__user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
CONSTRAINT `fk__desired_product__product` FOREIGN KEY (`existing_product_id`) REFERENCES `product` (`product_id`),
CONSTRAINT `fk__desired_product__desired_product` FOREIGN KEY (`base_desired_product_id`) REFERENCES `desired_product` (`desired_product_id`) ON DELETE CASCADE
) COMMENT='desired product with specific properties a consumer is looking for';


CREATE TABLE `desired_product__property_value`
(
 `desired_product_id`        INT NOT NULL ,
 `property_value_id` INT NOT NULL ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `fk__desired_property_value__desired_product` FOREIGN KEY (`desired_product_id`) REFERENCES `desired_product` (`desired_product_id`) ON DELETE CASCADE,
CONSTRAINT `fk__desired_property_value__property_value` FOREIGN KEY (`property_value_id`) REFERENCES `property_value` (`property_value_id`) ON DELETE CASCADE
);


CREATE TABLE `order`
(
 `order_id`                     INT NOT NULL AUTO_INCREMENT ,
 `base_order_id`                INT ,
 `group_id`                     INT NOT NULL ,
 `user_id`                      INT NOT NULL ,
 `pet_id`                       INT ,
 `desired_product_id`           INT ,
 `chosen_product_id`            INT ,
 `chosen_supplier_id`           INT ,
 `status`                       ENUM('PENDING-FOR-JOINERS', 'CHOOSING-SUPPLIER', 'PENDING-FOR-PAYMENT', 'PENDING-FOR-SHIPMENT-DETAILS', 'SUPPLIER-HANDLING', 'SHIPPED', 'RECEIVED', 'REFUNDED', 'CANCELED', 'LEFT-GROUP') NOT NULL ,
 `quantity`                     INT ,
 `single_unit_price`            FLOAT ,
 `estimated_price_best`         INT ,
 `estimated_price_worst`        INT ,
 `notes`                        TEXT ,
 `cancellation_reason`          TEXT ,
 `shipment_date`                DATE ,
 `shipment_receiver`            TEXT ,
 `shipment_phone` 	            TEXT ,
 `shipment_address`             TEXT ,
 `shipment_city_id`             INT(11) ,
 `shipment_door_code`           VARCHAR(45) ,
 `shipment_floor`               VARCHAR(45) ,
 `shipment_leave_next_door`     BIT(1) ,
 `payment_payment_id`           VARCHAR(45) ,
 `payment_is_valid`             BIT(1) ,
 `payment_invalid_reason`       TEXT ,
 `payment_customer_id`          VARCHAR(45) ,
 `payment_document_number`      VARCHAR(45) ,
 `payment_date`                 VARCHAR(45) ,
 `payment_amount`               INT ,
 `payment_status`               VARCHAR(45) ,
 `payment_status_description`   VARCHAR(45) ,
 `payment_last_digits`          VARCHAR(10) ,
 `payment_token`                VARCHAR(45) ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`order_id`),
CONSTRAINT `fk__order__order` FOREIGN KEY (`base_order_id`) REFERENCES `order` (`order_id`),
CONSTRAINT `fk__order__group` FOREIGN KEY (`group_id`) REFERENCES `group` (`group_id`),
CONSTRAINT `fk__order__user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
CONSTRAINT `fk__order__pet` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`),
CONSTRAINT `fk__order__desired_product` FOREIGN KEY (`desired_product_id`) REFERENCES `desired_product` (`desired_product_id`),
CONSTRAINT `fk__order__product` FOREIGN KEY (`chosen_product_id`) REFERENCES `product` (`product_id`),
CONSTRAINT `fk__order__supplier` FOREIGN KEY (`chosen_supplier_id`) REFERENCES `supplier` (`supplier_id`)
);

CREATE TABLE `order__potential_product`
(
 `order_id`                 INT NOT NULL ,
 `product_id`               INT NOT NULL ,
 `createdAt`                timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updatedAt`                timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`order_id`, `product_id`),
CONSTRAINT `fk__order_potential_product__order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
CONSTRAINT `fk__order_potential_product__product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
);
