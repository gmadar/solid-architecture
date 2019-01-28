SET NAMES 'utf8';
SET CHARACTER SET 'utf8';

INSERT INTO `core`.`product_category` (`product_category_id`, `category_name`) VALUES ('DOG_FOOD', 'Dog Food');


INSERT INTO `core`.`property_type` (`property_type_id`, `type_name`, `unit`, `data_type`) VALUES ('PET_WEIGHT', 'Dog Weight', 'KG', 'NUMBER');

INSERT INTO `core`.`property_type` (`property_type_id`, `type_name`, `data_type`) VALUES ('SPECIAL_DIET', 'Dog Diet', 'STRING');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('SPECIAL_DIET', 'NO_SPECIAL_DIET', 'No Special Diet', 'ללא תזונה מיוחדת');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('SPECIAL_DIET', 'NO_CEREAL', 'No Cereal', 'ללא דגנים');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('SPECIAL_DIET', 'NO_CHICKEN', 'No Chicken', 'ללא עוף / רגישות לעוף');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('SPECIAL_DIET', 'HYPOALLERGENIC', 'Hypoallergenic', 'היפואלרגני');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('SPECIAL_DIET', 'LOW_FAT', 'Low Fat', 'שמירה על משקל / דיאטטי');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('SPECIAL_DIET', 'ENERGY', 'Energy / Active Dog', 'אנרגיה / כלבים פעילים');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('SPECIAL_DIET', 'TEST', 'Test', 'בדיקה');

INSERT INTO `core`.`property_type` (`property_type_id`, `type_name`, `data_type`) VALUES ('FLAVOR', 'Flavor', 'STRING');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('FLAVOR', 'DUCK', 'Duck', 'ברווז');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('FLAVOR', 'CHICKEN', 'Chicken', 'עוף');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('FLAVOR', 'LAMB', 'Lamb', 'כבש');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('FLAVOR', 'SALMON', 'Salom', 'סלמון');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('FLAVOR', 'VENISON', 'Venison', 'צבי');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('FLAVOR', 'FISH', 'Fish', 'דגים');
INSERT INTO `core`.`property_value_option` (`property_type_id`, `value_option_id`, `label_eng`, `label_heb`) VALUES ('FLAVOR', 'BEEF', 'Beef', 'בקר');

INSERT INTO `core`.`property_type` (`property_type_id`, `type_name`, `unit`, `data_type`) VALUES ('SACK_SIZE', 'Sack Size', 'KG', 'NUMBER');

INSERT INTO `core`.`product_manufacturer` (`manufacturer_id`, `manufacturer_name`, `website`) VALUES ('1', 'Natural Balance', 'http://www.naturalbalance.co.il/');


INSERT INTO `core`.`product` (`product_id`, `product_name_eng`, `product_name_heb`, `brand`, `product_category_id`, `description`, `photo_url`, `manufacturer_id`, `price_unit`, `dog_advisor_rating`) VALUES ('1', 'Natural Balance duck and potato dogs food', 'נטורל באלנס ברווז ותפוח אדמה', 'Natural Balance', 'DOG_FOOD', 'מזון לכלב סופר איכותי ללא דגנים על בסיס בשר ברווז.\nהמזון מכיל מספר מצומצם של מרכיבים כך שהוא מותאם לכלבים בעלי קיבה רגישה.\nנטורל באלנס מתאים לכל סוגי הכלבים בכל שלבי החיים של שלהם, מגורים ועד כלבים מבוגרים.\nהמזון מכיל שמן סלמון ושמן קנולה שעשירים באומגה 3 ובאומגה 6 לשמירה על עור בריא ופרווה מבריקה.\n \n\nכל מרכיבי מזון לכלבים של נטורל באנלס לא עובדו והם מופיעים בצורתם הטבעית.\nהמזון לא מכיל חומרי שימור, צבע או טעם מלאכותיים.\nהמזון לא מכיל תוצרי לוואי של תעשיית הבשר.\nהמזון לא מכיל הורמונים.\nהמזון לא מכיל דגנים\n\nנטורל באלנס נבחר למזון כלבים הטוב בעולם על ידי המגזין הנחשב ביותר בארה\"ב לכלביםWhole Dog Journal\'s  .', 'https://www.anipet.co.il/components/img.aspx?img=images\\Natural_Balance_Potato_Duck_2.27(1).jpg&width=1000&height=700', '1', 'KG', 5);
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`) VALUES (1, 'SACK_SIZE', '10', 'SINGLE');
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`)  VALUES (2,'PET_WEIGHT','5','RANGE-FROM');
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`)  VALUES (3,'PET_WEIGHT','10','RANGE-TO');
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`) VALUES (4, 'FLAVOR', 'DUCK', 'SINGLE');
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (1, 1);
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (1, 2);
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (1, 3);
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (1, 4);
INSERT INTO `core`.`product_price` (`product_price_id`, `product_id`, `price`, `size`, `source_url`) VALUES ('1', '1', '34.74', '5.44', 'https://www.anipet.co.il/product-20-%D7%9E%D7%96%D7%95%D7%9F_%D7%9C%D7%9B%D7%9C%D7%91%D7%99%D7%9D_%D7%A0%D7%98%D7%95%D7%A8%D7%9C_%D7%91%D7%90%D7%9C%D7%A0%D7%A1_%D7%91%D7%A8%D7%95%D7%95%D7%96_%D7%95%D7%AA%D7%A4%D7%95%D7%97_%D7%90%D7%93%D7%9E%D7%94_.aspx');
INSERT INTO `core`.`product_price` (`product_price_id`, `product_id`, `price`, `size`, `source_url`) VALUES ('2', '1', '25.34', '11.8', 'https://www.anipet.co.il/product-20-%D7%9E%D7%96%D7%95%D7%9F_%D7%9C%D7%9B%D7%9C%D7%91%D7%99%D7%9D_%D7%A0%D7%98%D7%95%D7%A8%D7%9C_%D7%91%D7%90%D7%9C%D7%A0%D7%A1_%D7%91%D7%A8%D7%95%D7%95%D7%96_%D7%95%D7%AA%D7%A4%D7%95%D7%97_%D7%90%D7%93%D7%9E%D7%94_.aspx');
INSERT INTO `core`.`product_price` (`product_price_id`, `product_id`, `price`, `size`, `source_url`) VALUES ('3', '1', '23.56', '23.6', 'https://www.megapet.co.il/shop/%D7%9B%D7%9C%D7%91%D7%99%D7%9D/%D7%9E%D7%96%D7%95%D7%9F-%D7%9C%D7%9B%D7%9C%D7%91%D7%99%D7%9D/%D7%A0%D7%98%D7%95%D7%A8%D7%9C-%D7%91%D7%90%D7%9C%D7%A0%D7%A1-%D7%9E%D7%96%D7%95%D7%9F-%D7%9C%D7%9B%D7%9C%D7%91-%D7%AA%D7%A4%D7%95%D7%97-%D7%90%D7%93%D7%9E%D7%94-%D7%95%D7%91%D7%A8%D7%95%D7%95%D7%96-1/');

INSERT INTO `core`.`product` (`product_id`, `product_name_eng`, `product_name_heb`, `brand`, `product_category_id`, `description`, `photo_url`, `manufacturer_id`, `price_unit`, `dog_advisor_rating`) VALUES ('2', 'Natural Balance chicken and potato dogs food', 'נטורל באלנס עוף ותפוח אדמה', 'Natural Balance', 'DOG_FOOD', 'מזון לכלב סופר איכותי ללא דגנים על בסיס בשר ברווז.\nהמזון מכיל מספר מצומצם של מרכיבים כך שהוא מותאם לכלבים בעלי קיבה רגישה.\nנטורל באלנס מתאים לכל סוגי הכלבים בכל שלבי החיים של שלהם, מגורים ועד כלבים מבוגרים.\nהמזון מכיל שמן סלמון ושמן קנולה שעשירים באומגה 3 ובאומגה 6 לשמירה על עור בריא ופרווה מבריקה.\n \n\nכל מרכיבי מזון לכלבים של נטורל באנלס לא עובדו והם מופיעים בצורתם הטבעית.\nהמזון לא מכיל חומרי שימור, צבע או טעם מלאכותיים.\nהמזון לא מכיל תוצרי לוואי של תעשיית הבשר.\nהמזון לא מכיל הורמונים.\nהמזון לא מכיל דגנים\n\nנטורל באלנס נבחר למזון כלבים הטוב בעולם על ידי המגזין הנחשב ביותר בארה\"ב לכלביםWhole Dog Journal\'s .', 'https://www.anipet.co.il/components/img.aspx?img=images\\Natural_Balance_Potato_Duck_2.27(1).jpg&width=1000&height=700', '1', 'KG', 4);
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`) VALUES (5, 'SACK_SIZE', '13.5', 'SINGLE');
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`)  VALUES (6,'PET_WEIGHT','10','RANGE-FROM');
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`)  VALUES (7,'PET_WEIGHT','20','RANGE-TO');
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`)  VALUES (8,'SPECIAL_DIET','NO_CEREAL', 'SINGLE');
INSERT INTO `core`.`property_value` (`property_value_id`, `property_type_id`, `value`, `values_relation`) VALUES (9, 'FLAVOR', 'CHICKEN', 'SINGLE');
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (2, 5);
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (2, 6);
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (2, 7);
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (2, 8);
INSERT INTO `core`.`product__property_value` (`product_id`, `property_value_id`) VALUES (2, 9);
INSERT INTO `core`.`product_price` (`product_price_id`, `product_id`, `price`, `size`, `source_url`) VALUES ('4', '2', '34.74', '5.44', 'https://www.anipet.co.il/product-20-%D7%9E%D7%96%D7%95%D7%9F_%D7%9C%D7%9B%D7%9C%D7%91%D7%99%D7%9D_%D7%A0%D7%98%D7%95%D7%A8%D7%9C_%D7%91%D7%90%D7%9C%D7%A0%D7%A1_%D7%91%D7%A8%D7%95%D7%95%D7%96_%D7%95%D7%AA%D7%A4%D7%95%D7%97_%D7%90%D7%93%D7%9E%D7%94_.aspx');
INSERT INTO `core`.`product_price` (`product_price_id`, `product_id`, `price`, `size`, `source_url`) VALUES ('5', '2', '25.34', '11.8', 'https://www.anipet.co.il/product-20-%D7%9E%D7%96%D7%95%D7%9F_%D7%9C%D7%9B%D7%9C%D7%91%D7%99%D7%9D_%D7%A0%D7%98%D7%95%D7%A8%D7%9C_%D7%91%D7%90%D7%9C%D7%A0%D7%A1_%D7%91%D7%A8%D7%95%D7%95%D7%96_%D7%95%D7%AA%D7%A4%D7%95%D7%97_%D7%90%D7%93%D7%9E%D7%94_.aspx');
INSERT INTO `core`.`product_price` (`product_price_id`, `product_id`, `price`, `size`, `source_url`) VALUES ('6', '2', '23.56', '23.6', 'https://www.megapet.co.il/shop/%D7%9B%D7%9C%D7%91%D7%99%D7%9D/%D7%9E%D7%96%D7%95%D7%9F-%D7%9C%D7%9B%D7%9C%D7%91%D7%99%D7%9D/%D7%A0%D7%98%D7%95%D7%A8%D7%9C-%D7%91%D7%90%D7%9C%D7%A0%D7%A1-%D7%9E%D7%96%D7%95%D7%9F-%D7%9C%D7%9B%D7%9C%D7%91-%D7%AA%D7%A4%D7%95%D7%97-%D7%90%D7%93%D7%9E%D7%94-%D7%95%D7%91%D7%A8%D7%95%D7%95%D7%96-1/');
