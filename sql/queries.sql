CREATE DATABASE BarHealth;

USE BarHealth;
SELECT * FROM USERS;
SELECT * FROM USER_ALLERGENS;
SELECT * FROM allergens;
SELECT * FROM products;
SELECT * FROM nutrient;
SELECT * FROM nutritional_info;
SELECT * FROM nutritional_info_nutrient;
SELECT * FROM user_favorites;
SELECT * FROM recent_scans;

SELECT 
    p.product_id,
    p.product_name,
    p.barcode_num,
    p.price,
    ni.ingredients,
    ni.calories,
    GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
    GROUP_CONCAT(DISTINCT n.nutrient_name ORDER BY n.nutrient_name) AS nutrients,
    GROUP_CONCAT(DISTINCT nin.quantity ORDER BY nin.nutrient_id) AS nutrient_quantities,
    NOW() AS current_datetime -- Generates the current date and time
FROM 
    PRODUCTS p
INNER JOIN 
    NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
LEFT JOIN 
    NUTRITIONAL_INFO_NUTRIENT nin ON ni.nutritional_info_id = nin.nutritional_info_id
LEFT JOIN 
    NUTRIENT n ON nin.nutrient_id = n.nutrient_id
LEFT JOIN 
    ALLERGENS a ON ni.allergen_id = a.allergen_id
WHERE p.barcode_num = "1346201379644"
GROUP BY 
    p.product_id, p.product_name, p.barcode_num, p.price, ni.ingredients, ni.calories;

SELECT 
    p.product_name, 
    p.barcode_num, 
    rs.scan_date,
    p.price,
    DATE_FORMAT(CURDATE(), '%M %d, %Y') AS formatted_date
FROM 
    RECENT_SCANS rs
INNER JOIN 
    PRODUCTS p ON rs.product_id = p.product_id
WHERE 
    rs.user_id = 17  -- Replace ? with an actual user_id value
ORDER BY 
    rs.scan_date DESC;

-- 
SELECT 
    u.user_id, 
    u.firstname, 
    u.lastname, 
    a.allergen_name
FROM USERS u
JOIN USER_ALLERGENS ua ON u.user_id = ua.user_id
JOIN ALLERGENS a ON ua.allergen_id = a.allergen_id;

    
 SELECT 
  p.product_id, 
  p.product_name, 
  p.barcode_num, 
  p.price, 
  MAX(ni.ingredients) AS ingredients,  -- Use MAX() to avoid non-aggregated field error
  GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens
FROM scan_history sh
JOIN PRODUCTS p ON sh.product_id = p.product_id
LEFT JOIN nutritional_info ni ON p.product_id = ni.product_id
LEFT JOIN ALLERGENS a ON a.allergen_id = ni.allergen_id  -- Join allergen data
WHERE sh.user_id = 17
GROUP BY p.product_id;




CREATE TABLE SCAN_HISTORY (
    scan_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

SELECT * FROM SCAN_HISTORY;

        SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      rs.scan_date AS date,
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens
    FROM RECENT_SCANS rs
    JOIN PRODUCTS p ON rs.product_id = p.product_id
    LEFT JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE rs.user_id = 17
    GROUP BY 
      p.product_id, p.product_name, p.barcode_num, p.price, rs.scan_date, ni.ingredients;

-- INSERT INTO SCAN_HISTORY (user_id, product_id) VALUES (?, ?);
-- SELECT * FROM SCAN_HISTORY WHERE user_id = ? ORDER BY scan_date DESC;

-- QUERY FOR scanhistory

    SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      rs.scan_date AS date,
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM USER_ALLERGENS ua
          WHERE ua.user_id = rs.user_id
          AND ua.allergen_id IN (SELECT allergen_id FROM NUTRITIONAL_INFO ni2 WHERE ni2.product_id = p.product_id)
        ) THEN 'Detected'
        ELSE 'Safe'
      END AS allergen_status
    FROM RECENT_SCANS rs
    JOIN PRODUCTS p ON rs.product_id = p.product_id
    LEFT JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE rs.user_id = 2
    GROUP BY p.product_id, p.product_name, p.barcode_num, p.price, rs.scan_date, ni.ingredients
    ORDER BY 5;
  
  
  -- safe
  
      SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      rs.scan_date AS date,
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
      'Safe' AS allergen_status
    FROM RECENT_SCANS rs
    JOIN PRODUCTS p ON rs.product_id = p.product_id
    LEFT JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE rs.user_id = 14
    AND NOT EXISTS (
      SELECT 1
      FROM USER_ALLERGENS ua
      WHERE ua.user_id = rs.user_id
      AND ua.allergen_id IN (SELECT allergen_id FROM NUTRITIONAL_INFO ni2 WHERE ni2.product_id = p.product_id)
    )
    GROUP BY p.product_id, p.product_name, p.barcode_num, p.price, rs.scan_date, ni.ingredients;

-- detected

SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      rs.scan_date AS date,
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
      'Detected' AS allergen_status
    FROM RECENT_SCANS rs
    JOIN PRODUCTS p ON rs.product_id = p.product_id
    LEFT JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE rs.user_id = 14
    AND EXISTS (
      SELECT 1
      FROM USER_ALLERGENS ua
      WHERE ua.user_id = rs.user_id
      AND ua.allergen_id IN (SELECT allergen_id FROM NUTRITIONAL_INFO ni2 WHERE ni2.product_id = p.product_id)
    )
    GROUP BY p.product_id, p.product_name, p.barcode_num, p.price, rs.scan_date, ni.ingredients;


CREATE TABLE USER_FAVORITES (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

SELECT * FROM USER_FAVORITES;
DELETE FROM USER_FAVORITES;
TRUNCATE TABLE USER_FAVORITES;

INSERT INTO USER_FAVORITES (user_id, product_id)
VALUES 
	(19, 8),
	(19, 7),
	(19, 16),
	(19, 5),
	(19, 2),
	(19, 1);



    SELECT p.product_id, p.product_name
    FROM USER_FAVORITES uf
    JOIN PRODUCTS p ON uf.product_id = p.product_id
    WHERE uf.user_id = 3;

-- SELECT * FROM USER_FAVORITES WHERE user_id = ?;

CREATE TABLE RECENT_SCANS (
    recent_scan_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id)
);

      SELECT p.product_name, p.barcode_num, rs.scan_date
      FROM RECENT_SCANS rs
      INNER JOIN PRODUCTS p ON rs.product_id = p.product_id
	  WHERE user_id = 14
      ORDER BY rs.scan_date DESC;


    SELECT a.allergen_name
    FROM USER_ALLERGENS ua
    JOIN ALLERGENS a ON ua.allergen_id = a.allergen_id
    WHERE ua.user_id = 14;

DROP TABLE RECENT_SCANS;


SELECT * FROM RECENT_SCANS;
DELETE FROM RECENT_SCANS;
TRUNCATE TABLE RECENT_SCANS;

      SELECT p.product_name, p.barcode_num, rs.scan_date
      FROM RECENT_SCANS rs
      INNER JOIN PRODUCTS p ON rs.product_id = p.product_id
      ORDER BY rs.scan_date DESC;
     


SELECT DISTINCT p.product_name
FROM PRODUCTS p
JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
JOIN USER_ALLERGENS ua ON ua.user_id = 14
WHERE ni.allergen_id = ua.allergen_id;




INSERT INTO RECENT_SCANS (user_id, product_id, scan_date) 
VALUES (19, 4, '2024-12-07 12:00:00'),
 (19, 8, '2024-12-07 12:00:00'),
 (19, 5, '2024-12-07 12:00:00');



      SELECT p.product_name, p.barcode_num, rs.scan_date
      FROM RECENT_SCANS rs
      INNER JOIN PRODUCTS p ON rs.product_id = p.product_id
      ORDER BY rs.scan_date DESC; 

    
    DESCRIBE RECENT_SCANS;

-- SELECT * FROM RECENT_SCANS WHERE user_id = ? ORDER BY scan_date DESC LIMIT 10;

-- values will be inserted by the user
CREATE TABLE USERS(
 user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 firstname VARCHAR(250) NOT NULL,
 lastname VARCHAR(250) NOT NULL,
 email VARCHAR(250) NOT NULL UNIQUE,
 password VARCHAR(250) NOT NULL,
 midint CHAR(1),
 gender CHAR(1),
 username VARCHAR(50),
 CHECK (gender IN ('M', 'F')) 
);

    SELECT firstname, lastname, email 
    FROM USERS 
    WHERE user_id = 19;
    
DROP TABLE USER_ALLERGENS;
DROP TABLE USERS;
DROP TABLE USER_FAVORITES;
DROP TABLE SCAN_HISTORY;
DROP TABLE RECENT_SCANS;

SELECT * FROM USERS;
SELECT * FROM USER_ALLERGENS;
SELECT * FROM ALLERGENS;

INSERT INTO USERS (firstname, lastname, email, password, midint, gender) VALUES

('ab', 'Johnscdon', 'ee.johnson@example.com', '123', 'D', 'F');

SELECT * FROM USERS;

CREATE TABLE USER_ALLERGENS(
    user_id INT NOT NULL,
    allergen_id INT NOT NULL,
    PRIMARY KEY (user_id, allergen_id),
    FOREIGN KEY (allergen_id) REFERENCES ALLERGENS (allergen_id),
    FOREIGN KEY (user_id) REFERENCES USERS (user_id)
);

    SELECT a.allergen_name
    FROM USER_ALLERGENS ua
    JOIN ALLERGENS a ON ua.allergen_id = a.allergen_id
    WHERE ua.user_id = 13;
    
        DELETE FROM USER_ALLERGENS 
    WHERE user_id = 1 AND allergen_id = (
      SELECT allergen_id FROM ALLERGENS WHERE allergen_name = "milk" LIMIT 1
    );
    
SELECT * FROM USER_ALLERGENS;
SELECT * FROM ALLERGENS;
SELECT * FROM USERS;

CREATE TABLE USERS(
 user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 firstname VARCHAR(250) NOT NULL,
 lastname VARCHAR(250) NOT NULL,
 email VARCHAR(250) NOT NULL UNIQUE,
 password VARCHAR(250) NOT NULL,
 midint CHAR(1),
 gender CHAR(1),
 username VARCHAR(50),
 CHECK (gender IN ('M', 'F')) 
);

CREATE TABLE ALLERGENS (
    allergen_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    allergen_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO ALLERGENS (allergen_name)
VALUES 
 ('celery'),
 ('crustaceans'),
 ('fish'),
 ('milk'),
 ('mustard'),
 ('sesame'),
 ('soybeans'),
 ('gluten'),
 ('eggs'),
 ('lupin'),
 ('mollusks'),
 ('peanuts'),
 ('Sulphur dioxide and Sulphites'),
 ('tree nuts');
 
 -- values will be inserted by the user
 CREATE TABLE USER_ALLERGENS(
allergen_id INT NOT NULL Primary Key,
user_id INT NOT NULL Primary Key,
FOREIGN KEY (allergen_id) REFERENCES ALLERGENS (allergen_id),
FOREIGN KEY (user_id) REFERENCES USERS (user_id)
);

-- barcodes are in EAN-13 FORMAT
CREATE TABLE PRODUCTS(
product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
barcode_num VARCHAR (50) UNIQUE NOT NULL,
product_name VARCHAR(250) NOT NULL,
price DECIMAL(10,2) NOT NULL,
scanDateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- obviously this part has 
);

SELECT * FROM PRODUCTS;

    SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      rs.scan_date AS date,
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens
    FROM RECENT_SCANS rs
    JOIN PRODUCTS p ON rs.product_id = p.product_id
    LEFT JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE rs.user_id = 14
    GROUP BY 
      p.product_id, p.product_name, p.barcode_num, p.price, rs.scan_date, ni.ingredients;

UPDATE PRODUCTS
SET barcode_num = '9780201379600'
WHERE barcode_num = '1234567890123';

UPDATE PRODUCTS
SET barcode_num = '1346201379644'
WHERE barcode_num = '987654321098';

UPDATE PRODUCTS
SET barcode_num = '2857291437422'
WHERE barcode_num = '234567890123';

UPDATE PRODUCTS
SET barcode_num = '6294714805264'
WHERE barcode_num = '345678901234';

UPDATE PRODUCTS
SET barcode_num = '5138462047525'
WHERE barcode_num = '456789012345';

UPDATE PRODUCTS
SET barcode_num = '4082610402470'
WHERE barcode_num = '567890123456';

UPDATE PRODUCTS
SET barcode_num = '3074291483092'
WHERE barcode_num = '678901234567';

UPDATE PRODUCTS
SET barcode_num = '7092394074388'
WHERE barcode_num = '789012345678';

UPDATE PRODUCTS
SET barcode_num = '8128404758272'
WHERE barcode_num = '890123456789';

UPDATE PRODUCTS
SET barcode_num = '2903819405791'
WHERE barcode_num = '901234567890';



INSERT INTO PRODUCTS (barcode_num, product_name, price)
VALUES
('0123456789012', 'Canned Tuna in Olive Oil', 2.99),
('0987654321098', 'Instant Ramen Noodles', 1.49),
('0234567890123', 'Frozen Pizza Margherita', 5.99),
('0345678901234', 'Canned Baked Beans', 3.49),
('0456789012345', 'Ready-to-eat Grilled Chicken', 7.99),
('0567890123456', 'Packaged French Fries', 4.29),
('0678901234567', 'Instant Oatmeal Pouch', 2.59),
('0789012345678', 'Processed Cheese Slices', 3.89),
('0890123456789', 'Frozen Vegetable Mix', 4.49),
('0901234567890', 'Canned Sweet Corn', 2.19);

SELECT * FROM PRODUCTS;


CREATE TABLE NUTRITIONAL_INFO(
 nutritional_info_id INT PRIMARY KEY AUTO_INCREMENT,
 ingredients VARCHAR(250) NOT NULL,
 calories INT,
 saturated_fats DECIMAL(5,2),
 trans_fats DECIMAL(5,2),
 cholesterol INT,
 sodium INT,
 dietary_fiber DECIMAL(5,2),
 sugars DECIMAL(5,2),
 proteins DECIMAL(5,2),
 allergen_id INT NOT NULL,
 product_id INT NOT NULL,
 FOREIGN KEY (allergen_id) REFERENCES ALLERGENS(allergen_id), 
 FOREIGN KEY (product_id) REFERENCES PRODUCTS(product_id) 
);

-- Nutritional info for "Canned Tuna in Olive Oil" (Product ID = 1, Allergen ID 
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Tuna, olive oil, salt', -- ingredients
 200, -- calories
 2.5, -- saturated fats (g)
 0, -- trans fats (g)
 35, -- cholesterol (mg)
 500, -- sodium (mg)
 0, -- dietary fiber (g)
 0, -- sugars (g)
 40, -- proteins (g)
 3, -- allergen_id (Fish)
 1 -- product_id (Canned Tuna in Olive Oil)
);
-- Nutritional info for "Instant Ramen Noodles" (Product ID = 2, Allergen ID = 8
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Wheat flour, palm oil, seasoning', -- ingredients
 400, -- calories
 6.0, -- saturated fats (g)
 0.5, -- trans fats (g)
 0, -- cholesterol (mg)
 1500, -- sodium (mg)
 2, -- dietary fiber (g)
 2, -- sugars (g)
 10, -- proteins (g)
 8, -- allergen_id (Gluten)
 2 -- product_id (Instant Ramen Noodles)
);

-- Nutritional info for "Frozen Pizza Margherita" (Product ID = 3, Allergen ID =
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Wheat flour, tomato, cheese, olive oil', -- ingredients
 300, -- calories
 6.5, -- saturated fats (g)
 0.3, -- trans fats (g)
 20, -- cholesterol (mg)
 800, -- sodium (mg)
 2, -- dietary fiber (g)
 3, -- sugars (g)
 15, -- proteins (g)
 8, -- allergen_id (Gluten)
 3 -- product_id (Frozen Pizza Margh
);

-- Nutritional info for "Canned Baked Beans" (Product ID = 4, Allergen ID = 8 fo
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Baked beans, tomato sauce, sugar', -- ingredients
 180, -- calories
 0.5, -- saturated fats (g)
 0, -- trans fats (g)
 0, -- cholesterol (mg)
 500, -- sodium (mg)
 5, -- dietary fiber (g)
 8, -- sugars (g)
 6, -- proteins (g)
 8, -- allergen_id (Gluten)
 4 -- product_id (Canned Baked Beans)
);

-- Nutritional info for "Ready-to-eat Grilled Chicken" (Product ID = 5, Allergen
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Grilled chicken, seasoning', -- ingredients
 350, -- calories
 5.0, -- saturated fats (g)
 0, -- trans fats (g)
 70, -- cholesterol (mg)
 600, -- sodium (mg)
 0, -- dietary fiber (g)
 0, -- sugars (g)
 30, -- proteins (g)
 1, -- allergen_id (Celery)
 5 -- product_id (Ready-to-eat Grilled Chicken)
);

-- Nutritional info for "Packaged French Fries" (Product ID = 6, Allergen ID = 8
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Potatoes, oil, salt', -- ingredients
 200, -- calories
 3.5, -- saturated fats (g)
 0.1, -- trans fats (g)
 0, -- cholesterol (mg)
 300, -- sodium (mg)
 3, -- dietary fiber (g)
 1, -- sugars (g)
 2, -- proteins (g)
 8, -- allergen_id (Gluten)
 6 -- product_id (Packaged French Fries)
);

-- Nutritional info for "Instant Oatmeal Pouch" (Product ID = 7, Allergen ID = 8
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Oats, sugar, salt', -- ingredients
 150, -- calories
 1.0, -- saturated fats (g)
 0, -- trans fats (g)
 0, -- cholesterol (mg)
 120, -- sodium (mg)
 3, -- dietary fiber (g)
 5, -- sugars (g)
 4, -- proteins (g)
 8, -- allergen_id (Gluten)
 7 -- product_id (Instant Oatmeal Pouch)
);

-- Nutritional info for "Processed Cheese Slices" (Product ID = 8, Allergen ID =
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Cheese, salt, preservatives', -- ingredients
 150, -- calories
 9.0, -- saturated fats (g)
 0.5, -- trans fats (g)
 25, -- cholesterol (mg)
 350, -- sodium (mg)
 0, -- dietary fiber (g)
 1, -- sugars (g)
 10, -- proteins (g)
 4, -- allergen_id (Milk)
 8 -- product_id (Processed Cheese Slices)
);

-- Nutritional info for "Frozen Vegetable Mix" (Product ID = 9, Allergen ID = 1 
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Carrots, peas, corn', -- ingredients
 100, -- calories
 0.5, -- saturated fats (g)
 0, -- trans fats (g)
 0, -- cholesterol (mg)
 200, -- sodium (mg)
 3, -- dietary fiber (g)
 5, -- sugars (g)
 3, -- proteins (g)
 1, -- allergen_id (Celery)
 9 -- product_id (Frozen Vegetable Mix)
);

-- Nutritional info for "Canned Sweet Corn" (Product ID = 10, Allergen ID = 1 fo
INSERT INTO NUTRITIONAL_INFO (
 ingredients, calories, saturated_fats, trans_fats, cholesterol, sodium, 
 dietary_fiber, sugars, proteins, allergen_id, product_id
)
VALUES
(
 'Sweet corn, salt', -- ingredients
 120, -- calories
 0.5, -- saturated fats (g)
 0, -- trans fats (g)
 0, -- cholesterol (mg)
 300, -- sodium (mg)
 3, -- dietary fiber (g)
 6, -- sugars (g)
 4, -- proteins (g)
 1, -- allergen_id (Celery)
 10 -- product_id (Canned Sweet Corn)
);

CREATE TABLE NUTRIENT(
nutrient_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
nutrient_name VARCHAR(250),
unit CHAR(5)
);

-- auto_increment (nutrient_id)
INSERT INTO NUTRIENT(nutrient_name, unit)
VALUES
('Vitamin A', 'mg'),
('Vitamin B1', 'mg'),
('Vitamin B2', 'mg'),
('Vitamin B3', 'mg'),
('Vitamin B5', 'mg'),
('Vitamin B6', 'mg'),
('Vitamin B7', 'mcg'),
('Vitamin B9', 'mcg'),
('Vitamin B12', 'mcg'),
('Vitamin C', 'mg'),
('Vitamin D', 'mcg'),
('Vitamin E', 'mg'),
('Vitamin K', 'mcg'),
('Vitamin D2' , 'mcg'),
('Vitamin D3', 'mcg'),
('Calcium', 'mg'),
('Phosphorus', 'mg'),
('Sodium', 'mg'),
('Potassium', 'mg'),
('Chlorine', 'mg'),
('Magnesium', 'mg'),
('Sulfur', 'mg'),
('Iron', 'mg'),
('Zinc', 'mg'),
('Copper', 'mcg'),
('Fluorine', 'mcg'),
('Iodine', 'mcg'),
('Selenium', 'mcg'),
('Manganese', 'mg'),
('Chromium', 'mcg'),
('Cobalt', 'mcg'),
('Molybdenum', 'mcg'),
('Bromine', 'mcg'),
('Silicon', 'mg');


CREATE TABLE NUTRITIONAL_INFO_NUTRIENT(
    nutritional_info_id INT NOT NULL,
    nutrient_id INT NOT NULL,
    quantity DECIMAL(10, 2), -- Change to DECIMAL to allow for fractional quantities
    PRIMARY KEY (nutritional_info_id, nutrient_id),
    FOREIGN KEY (nutritional_info_id) REFERENCES NUTRITIONAL_INFO (nutritional_info_id),
    FOREIGN KEY (nutrient_id) REFERENCES NUTRIENT (nutrient_id)
);

-- insert values but only in quantity
-- For Ready-to-eat Grilled Chicken (nutritional_info_id = 5)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
(5, 1, 0), -- Vitamin A: 0 mg
(5, 2, 0.1), -- Vitamin B1: 0.1 mg
(5, 3, 0.1), -- Vitamin B2: 0.1 mg
(5, 4, 1), -- Vitamin B3: 1 mg
(5, 5, 0.5), -- Vitamin B5: 0.5 mg
(5, 6, 0.2), -- Vitamin B6: 0.2 mg
(5, 9, 0), -- Vitamin B12: 0 mcg
(5, 10, 10), -- Vitamin C: 10 mg
(5, 18, 600),-- Sodium: 600 mg
(5, 21, 30); -- Protein: 30 g
 
 -- For Instant Oatmeal Pouch (nutritional_info_id = 7)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
(7, 1, 0), -- Vitamin A: 0 mg
(7, 2, 0.1), -- Vitamin B1: 0.1 mg
(7, 3, 0.1), -- Vitamin B2: 0.1 mg
(7, 10, 1), -- Vitamin C: 1 mg
(7, 17, 0), -- Phosphorus: 0 mg
(7, 19, 120),-- Sodium: 120 mg
(7, 21, 4); -- Protein: 4 g

-- For Frozen Pizza Margherita (nutritional_info_id = 3)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
(3, 1, 0), -- Vitamin A: 0 mg
(3, 2, 0.1), -- Vitamin B1: 0.1 mg
(3, 3, 0.1), -- Vitamin B2: 0.1 mg
(3, 4, 1), -- Vitamin B3: 1 mg
(3, 6, 0.2), -- Vitamin B6: 0.2 mg
(3, 10, 5), -- Vitamin C: 5 mg
(3, 16, 400),-- Calcium: 400 mg
(3, 18, 800),-- Sodium: 800 mg
(3, 21, 15); -- Protein: 15 g

-- For Packaged French Fries (nutritional_info_id = 6)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
(6, 1, 0), -- Vitamin A: 0 mg
(6, 2, 0.1), -- Vitamin B1: 0.1 mg
(6, 3, 0.1), -- Vitamin B2: 0.1 mg
(6, 4, 1), -- Vitamin B3: 1 mg
(6, 6, 0.1), -- Vitamin B6: 0.1 mg
(6, 10, 0), -- Vitamin C: 0 mg
(6, 18, 300),-- Sodium: 300 mg
(6, 21, 2); -- Protein: 2 g

SELECT * FROM PRODUCTS;

-- For Canned Tuna in Olive oil (nutritional_info_id = 1)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
 (1, 1, 0), -- Vitamin A: 0 mg
 (1, 2, 0.1), -- Vitamin B1: 0.1 mg
 (1, 3, 0.1), -- Vitamin B2: 0.1 mg
 (1, 4, 1), -- Vitamin B3: 1 mg
 (1, 5, 0.5), -- Vitamin B5: 0.5 mg
 (1, 6, 0.2), -- Vitamin B6: 0.2 mg
 (1, 9, 0), -- Vitamin B12: 0 mcg
 (1, 10, 10), -- Vitamin C: 10 mg
 (1, 18, 600),-- Sodium: 600 mg
 (1, 21, 30); -- Protein: 30 g
 
 INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
 VALUES
 (2, 1, 0), -- Vitamin A: 0 mg
 (2, 2, 0.1), -- Vitamin B1: 0.1 mg
 (2, 3, 0.1), -- Vitamin B2: 0.1 mg
 (2, 4, 1), -- Vitamin B3: 1 mg
 (2, 6, 0.2), -- Vitamin B6: 0.2 mg
 (2, 10, 5), -- Vitamin C: 5 mg
 (2, 16, 100),-- Calcium: 100 mg
 (2, 18, 1500),-- Sodium: 1500 mg
 (2, 21, 10); -- Protein: 10 g
 
 -- Insert nutrient data for Canned Baked Beans (nutritional_info_id = 4)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
 (4, 1, 0), -- Vitamin A: 0 mg
 (4, 2, 0.1), -- Vitamin B1: 0.1 mg
 (4, 3, 0.1), -- Vitamin B2: 0.1 mg
 (4, 4, 1), -- Vitamin B3: 1 mg
 (4, 5, 0.5), -- Vitamin B5: 0.5 mg
 (4, 6, 0.2), -- Vitamin B6: 0.2 mg
 (4, 9, 0), -- Vitamin B12: 0 mcg
 (4, 10, 5), -- Vitamin C: 5 mg
 (4, 16, 50), -- Calcium: 50 mg
 (4, 18, 500),-- Sodium: 500 mg
 (4, 21, 6); -- Protein: 6 g
 
 use barhelth;
 
 -- Insert nutrient data for Processed Cheese Slices (nutritional_info_id = 8)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
 (8, 1, 0), -- Vitamin A: 0 mg
 (8, 2, 0.1), -- Vitamin B1: 0.1 mg
 (8, 3, 0.1), -- Vitamin B2: 0.1 mg
 (8, 4, 1), -- Vitamin B3: 1 mg
 (8, 5, 0.5), -- Vitamin B5: 0.5 mg
 (8, 6, 0.2), -- Vitamin B6: 0.2 mg
 (8, 9, 0), -- Vitamin B12: 0 mcg
 (8, 10, 5), -- Vitamin C: 5 mg
 (8, 16, 200),-- Calcium: 200 mg
 (8, 18, 350),-- Sodium: 350 mg
 (8, 21, 10); -- Protein: 10 g
 
-- Insert nutrient data for Frozen Vegetable Mix (nutritional_info_id = 9)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
 (9, 1, 0), -- Vitamin A: 0 mg
 (9, 2, 0.1), -- Vitamin B1: 0.1 mg
 (9, 3, 0.1), -- Vitamin B2: 0.1 mg
 (9, 4, 1), -- Vitamin B3: 1 mg
 (9, 5, 0.5), -- Vitamin B5: 0.5 mg
 (9, 6, 0.2), -- Vitamin B6: 0.2 mg
 (9, 9, 0), -- Vitamin B12: 0 mcg
 (9, 10, 15), -- Vitamin C: 15 mg
 (9, 16, 100),-- Calcium: 100 mg
 (9, 18, 200),-- Sodium: 200 mg
 (9, 21, 3); -- Protein: 3 g
 
 -- Insert nutrient data for Canned Sweet Corn (nutritional_info_id = 10)
INSERT INTO NUTRITIONAL_INFO_NUTRIENT (nutritional_info_id, nutrient_id, quantity)
VALUES
 (10, 1, 0), -- Vitamin A: 0 mg
 (10, 2, 0.1), -- Vitamin B1: 0.1 mg
 (10, 3, 0.1), -- Vitamin B2: 0.1 mg
 (10, 4, 1), -- Vitamin B3: 1 mg
 (10, 5, 0.5), -- Vitamin B5: 0.5 mg
 (10, 6, 0.2), -- Vitamin B6: 0.2 mg
 (10, 9, 0), -- Vitamin B12: 0 mcg
 (10, 10, 7), -- Vitamin C: 7 mg
 (10, 16, 50), -- Calcium: 50 mg
 (10, 18, 300),-- Sodium: 300 mg
 (10, 21, 4); -- Protein: 4 g
 
 
 
 -- QUERY
 
 SELECT 
    p.product_id,
    p.product_name,
    p.barcode_num,
    p.price,
    ni.ingredients,
    ni.calories,
    GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
    GROUP_CONCAT(DISTINCT n.nutrient_name ORDER BY n.nutrient_name) AS nutrients,
    GROUP_CONCAT(DISTINCT nin.quantity ORDER BY nin.nutrient_id) AS nutrient_quantities
FROM 
    PRODUCTS p
INNER JOIN 
    NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
LEFT JOIN 
    NUTRITIONAL_INFO_NUTRIENT nin ON ni.nutritional_info_id = nin.nutritional_info_id
LEFT JOIN 
    NUTRIENT n ON nin.nutrient_id = n.nutrient_id
LEFT JOIN 
    ALLERGENS a ON ni.allergen_id = a.allergen_id
WHERE barcode_num = "123456789012"
GROUP BY 
    p.product_id, p.product_name, p.barcode_num, p.price, ni.ingredients, ni.calories;
    
    
    
    
    INSERT INTO USER_FAVORITES (user_id, product_id)
    VALUES (19, 4)
    ON DUPLICATE KEY UPDATE product_id = product_id;  
    
    -- get favorites
        SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens 
    FROM 
    USER_FAVORITES uf
    JOIN 
      PRODUCTS p ON uf.product_id = p.product_id
    INNER JOIN 
      NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN 
      NUTRITIONAL_INFO_NUTRIENT nin ON ni.nutritional_info_id = nin.nutritional_info_id
    LEFT JOIN 
      NUTRIENT n ON nin.nutrient_id = n.nutrient_id
    LEFT JOIN 
      ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE user_id = 19
    GROUP BY 
    p.product_id, p.product_name, p.barcode_num, p.price, ni.ingredients, ni.calories;
 