USE [budget-space__test]; 


-- BASE TABLES
IF NOT EXISTS ( SELECT [name] FROM sys.tables WHERE [name] = 'Categories' ) 
CREATE TABLE Categories (
	CategoryID uniqueidentifier NOT NULL DEFAULT NEWID(), 
	Name varchar(50), 
	PRIMARY KEY (CategoryID)
);


-- ONE TO MANY TABLES
IF NOT EXISTS ( SELECT [name] FROM sys.tables WHERE [name] = 'Users' ) 
CREATE TABLE Users (
	UserID varchar(28) NOT NULL, 
	FirstName varchar(50) NOT NULL, 
	LastName varchar(50) NOT NULL, 
	Email varchar(50) NOT NULL, 
	PRIMARY KEY (UserID)
); 


-- ONE TO ONE TABLES
IF NOT EXISTS ( SELECT [name] FROM sys.tables WHERE [name] = 'Expenses' ) 
CREATE TABLE Expenses (
	ExpenseID uniqueidentifier NOT NULL DEFAULT NEWID(), 
	UserID varchar(28) NOT NULL, 
	Amount money NOT NULL, 
	CategoryID uniqueidentifier NOT NULL, 
	Description text, 
	Date date DEFAULT GETDATE(), 
	PRIMARY KEY (ExpenseID), 
	FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID), 
	FOREIGN KEY (UserID) REFERENCES Users(UserID), 
); 

IF NOT EXISTS ( SELECT [name] FROM sys.tables WHERE [name] = 'Incomes' ) 
CREATE TABLE Incomes (
	IncomeID uniqueidentifier NOT NULL DEFAULT NEWID(), 
	Amount money NOT NULL, 
	UserID varchar(28) NOT NULL, 
	CategoryID uniqueidentifier NOT NULL, 
	Date date DEFAULT GETDATE(),
	Description text, 
	PRIMARY KEY (IncomeID), 
	FOREIGN KEY (UserID) REFERENCES Users(UserID), 
); 

IF NOT EXISTS ( SELECT [name] FROM sys.tables WHERE [name] = 'RoommateExpenses' ) 
CREATE TABLE RoommateExpenses (
	RoommateExpenseID uniqueidentifier NOT NULL DEFAULT NEWID(), 
	ExpenseTo varchar(28) NOT NULL, 
	ExpenseFrom varchar(28) NOT NULL, 
	Amount money NOT NULL, 
	CategoryID uniqueidentifier NOT NULL, 
	Acknowledge bit DEFAULT 0, 
	Resolved bit DEFAULT 0, 
	Description text, 
	Date date DEFAULT GETDATE(), 
	PRIMARY KEY (RoommateExpenseID), 
	FOREIGN KEY (ExpenseTo) REFERENCES Users(UserID), 
	FOREIGN KEY (ExpenseFrom) REFERENCES Users(UserID), 
); 


-- JUNCTION TABLES
IF NOT EXISTS ( SELECT [name] FROM sys.tables WHERE [name] = 'UserCategories' ) 
CREATE TABLE UserCategories (
	UserID varchar(28) NOT NULL, 
	CategoryID uniqueidentifier NOT NULL, 
	PRIMARY KEY (UserID, CategoryID), 
	FOREIGN KEY (UserID) REFERENCES Users(UserID), 
	FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
); 

IF NOT EXISTS ( SELECT [name] FROM sys.tables WHERE [name] = 'Roommates' ) 
CREATE TABLE Roommates (
	Roommate1ID varchar(28) NOT NULL,
	Roommate2ID varchar(28) NOT NULL, 
	PRIMARY KEY (Roommate1ID, Roommate2ID), 
	FOREIGN KEY (Roommate1ID) REFERENCES Users(UserID), 
	FOREIGN KEY (Roommate2ID) REFERENCES Users(UserID), 
);

IF NOT EXISTS ( SELECT [name] FROM sys.tables WHERE [name] = 'RoommateRequests' ) 
CREATE TABLE RoommateRequests (
	RequestID uniqueidentifier NOT NULL DEFAULT NEWID(), 
	RequesterID varchar(28) NOT NULL,
	RecipientID varchar(28) NOT NULL, 
	DateSent Date DEFAULT GETDATE(), 
	Pending bit DEFAULT 1,
	PRIMARY KEY (RequestID), 
	FOREIGN KEY (RecipientID) REFERENCES Users(UserID), 
	FOREIGN KEY (RequesterID) REFERENCES Users(UserID), 
);