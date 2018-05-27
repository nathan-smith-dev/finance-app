USE [budget-space__test]; 

DECLARE @userID uniqueidentifier; 
DECLARE @cat1ID uniqueidentifier; 
DECLARE @cat2ID uniqueidentifier; 
DECLARE @cat3ID uniqueidentifier; 
DECLARE @cat4ID uniqueidentifier; 
DECLARE @cat5ID uniqueidentifier; 


-- Categories
INSERT INTO Categories (Name) 
VALUES ('Education'); 
Select @cat1ID = Categories.CategoryID 
FROM Categories 
WHERE Name = 'Education'; 

INSERT INTO Categories (Name) 
VALUES ('Entertainment'); 
Select @cat2ID = Categories.CategoryID 
FROM Categories 
WHERE Name = 'Entertainment'; 

INSERT INTO Categories (Name) 
VALUES ('Gas'); 
Select @cat3ID = Categories.CategoryID 
FROM Categories 
WHERE Name = 'Gas'; 

INSERT INTO Categories (Name) 
VALUES ('Rent'); 
Select @cat4ID = Categories.CategoryID 
FROM Categories 
WHERE Name = 'Rent'; 

INSERT INTO Categories (Name) 
VALUES ('Paycheck'); 
Select @cat5ID = Categories.CategoryID 
FROM Categories 
WHERE Name = 'Paycheck'; 


-- Users
INSERT INTO Users (FirstName, LastName, Email)
VALUES ('Nate', 'Smith', 'nis5294@gmail.com'); 
Select @userID = Users.UserID
FROM Users 
WHERE FirstName = 'Nate';


-- Incomes
INSERT INTO Incomes (Amount, UserID, CategoryID)
VALUES (1600.00, @userID, @cat5ID) 

-- Expenses
INSERT INTO Expenses (Amount, UserID, CategoryID)
VALUES (600.00, @userID, @cat4ID) 

INSERT INTO Expenses (Amount, UserID, CategoryID)
VALUES (52.10, @userID, @cat3ID) 

INSERT INTO Expenses (Amount, UserID, CategoryID)
VALUES (12.14, @userID, @cat2ID) 

INSERT INTO Expenses (Amount, UserID, CategoryID)
VALUES (10.00, @userID, @cat1ID) 


