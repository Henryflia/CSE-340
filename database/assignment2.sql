INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

UPDATE account SET account_type = 'Admin' WHERE account_firstname = 'Tony';

DELETE FROM account WHERE account.account_firstname = 'Tony';

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM';

Select inv_make, inv_model, classification.classification_name FROM inventory
INNER JOIN classification ON inv_id = classification.classification_id 
WHERE classification.classification_name = 'Sport' 

UPDATE inventory 
SET inv_image = REPLACE (inv_image, 'image', 'images/vehicles'), inv_thumbnail = REPLACE (inv_thumbnail, 'image', 'images/vehicles')