USE [budget-space__test]; 

--POSTS
IF EXISTS ( SELECT [name] FROM sys.procedures WHERE [name] = 'CreateCategory' )
DROP PROC CreateCategory
GO

CREATE PROC CreateCategory @catName varchar(50)
AS 
	IF NOT EXISTS ( SELECT Name FROM Categories WHERE Name = @catName ) 
	INSERT INTO Categories(Name) 
	VALUES(@catName)
GO

IF EXISTS ( SELECT [name] FROM sys.procedures WHERE [name] = 'CreateUser' )
DROP PROC CreateUser
GO

CREATE PROC CreateUser @id varchar(28), @fName varchar(50), @lName varchar(50), @email varchar(50)
AS 
	IF NOT EXISTS ( SELECT UserID FROM Users WHERE UserID = @id ) 
	INSERT INTO Users(UserID, FirstName, LastName, Email) 
	VALUES(@id, @fName, @lName, @email)
GO

IF EXISTS ( SELECT [name] FROM sys.procedures WHERE [name] = 'CreateExpense' )
DROP PROC CreateExpense
GO

CREATE PROC CreateExpense @catName varchar(50), @userId varchar(28), @amount money, @desc text, @date Date
AS 
	DECLARE @catId uniqueidentifier; 
	SELECT @catId = CategoryID FROM Categories WHERE Name = @catName; 
	PRINT @catId; 
	IF EXISTS ( SELECT CategoryID FROM Categories WHERE Name = @catName ) 
	INSERT INTO Expenses(UserID, Amount, CategoryID, Description, Date) 
	VALUES(@userId, @amount, @catId, @desc, @date)
GO

IF EXISTS ( SELECT [name] FROM sys.procedures WHERE [name] = 'CreateIncome' )
DROP PROC CreateIncome
GO

CREATE PROC CreateIncome @catName varchar(50), @userId varchar(28), @amount money, @desc text, @date Date
AS 
	DECLARE @catId uniqueidentifier; 
	SELECT @catId = CategoryID FROM Categories WHERE Name = @catName; 
	PRINT @catId; 
	IF EXISTS ( SELECT CategoryID FROM Categories WHERE Name = @catName ) 
	INSERT INTO Incomes(UserID, Amount, CategoryID, Description, Date) 
	VALUES(@userId, @amount, @catId, @desc, @date)
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'CreateRoommate' )
DROP PROC CreateRoommate
GO

CREATE PROC CreateRoommate @id1 varchar(28), @id2 varchar(28)
AS 
IF EXISTS ( SELECT * FROM Users WHERE UserID = @id1 ) 
IF EXISTS ( SELECT * FROM Users WHERE UserID = @id2 )
IF NOT EXISTS ( SELECT * FROM Roommates WHERE (Roommate1ID = @id1 OR Roommate2ID = @id1) AND (Roommate1ID = @id2 OR Roommate2ID = @id2) )
INSERT INTO Roommates (Roommate1ID, Roommate2ID)
VALUES (@id1, @id2)
GO 

IF EXISTS ( SELECT [name] FROM sys.procedures WHERE [name] = 'CreateUserCategory' )
DROP PROC CreateUserCategory
GO 

CREATE PROC CreateUserCategory
	@categoryName varchar(50),
	@userId varchar(28)
AS 
	DECLARE @catId uniqueidentifier;
	IF EXISTS ( SELECT CategoryID FROM Categories WHERE Name = @categoryName  ) 
		SELECT @catId =  CategoryID FROM Categories WHERE Name = @categoryName; 
	ELSE 
	BEGIN 
		EXEC CreateCategory @catName = @categoryName ; 
		SELECT @catId =  CategoryID FROM Categories WHERE Name = @categoryName; 
	END
	IF NOT EXISTS ( SELECT * FROM UserCategories WHERE UserID = @userId AND CategoryID = @catId )
	INSERT INTO UserCategories (UserID, CategoryID)
	VALUES (@userId, @catId)
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'CreateRoomateExpense' )
DROP PROC CreateRoomateExpense
GO 

CREATE PROC CreateRoomateExpense 
	@expenseTo varchar(28), 
	@expenseFrom varchar(28), 
	@amount money, 
	@catName varchar(50), 
	@desc text, 
	@date Date
AS
	DECLARE @categoryId uniqueidentifier; 
	IF EXISTS ( SELECT CategoryID FROM Categories WHERE Name = @catName ) 
	BEGIN 
		SELECT @categoryId = CategoryID FROM Categories WHERE Name = @catName
		INSERT INTO RoommateExpenses (ExpenseTo, ExpenseFrom, Amount, CategoryID, Description, Date)
		VALUES (@expenseTo, @expenseFrom, @amount, @categoryId, @desc, @date)
	END 
GO


-- GETS
IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserExpenses' )
DROP PROC GetUserExpenses
GO 

CREATE PROC GetUserExpenses 
	@userId varchar(28), 
	@date Date = null, 
	@categoryName varchar(50) = null
AS
	BEGIN
		SELECT 
			Expenses.ExpenseID as id,
			Expenses.Amount as amount, 
			Categories.CategoryID as categoryId, 
			Categories.Name as category, 
			Expenses.Date as [date], 
			Expenses.Description as [desc]
		FROM Expenses
		JOIN Categories ON Expenses.CategoryID = Categories.CategoryID
		WHERE 
			Expenses.UserID = @userId AND
			(@date IS NULL OR (MONTH(Expenses.Date) = MONTH(@date) AND YEAR(Expenses.Date) = YEAR(@date))) AND
			(@categoryName IS NULL OR (Categories.Name = @categoryName))
		ORDER BY Expenses.Date DESC
		OPTION (RECOMPILE)
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserExpense' )
DROP PROC GetUserExpense
GO 

CREATE PROC GetUserExpense 
	@expenseId uniqueidentifier
AS
	BEGIN
		SELECT 
			e.ExpenseID as id, 
			e.Amount as amount, 
			c.CategoryID as categoryId,
			c.Name as category,
			e.Date as [date], 
			e.Description as [desc]
		FROM Expenses as e
		JOIN Categories as c ON e.CategoryID = c.CategoryID
		WHERE e.ExpenseID = @expenseId 
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserIncomes' )
DROP PROC GetUserIncomes
GO 

CREATE PROC GetUserIncomes 
	@userId varchar(28), 
	@date Date = null, 
	@categoryName varchar(50) = null
AS
	BEGIN
		SELECT 
			Incomes.IncomeID as id,
			Incomes.Amount as amount, 
			Categories.CategoryID as categoryId, 
			Categories.Name as category, 
			Incomes.Date as [date], 
			Incomes.Description as [desc]
		FROM Incomes
		JOIN Categories ON Incomes.CategoryID = Categories.CategoryID
		WHERE 
			Incomes.UserID = @userId AND
			(@date IS NULL OR (MONTH(Incomes.Date) = MONTH(@date) AND YEAR(Incomes.Date) = YEAR(@date))) AND
			(@categoryName IS NULL OR (Categories.Name = @categoryName))
		ORDER BY Incomes.Date DESC
		OPTION (RECOMPILE)
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserIncome' )
DROP PROC GetUserIncome
GO 

CREATE PROC GetUserIncome 
	@incomeId uniqueidentifier
AS
	BEGIN
		SELECT 
			i.IncomeID as id, 
			i.Amount as amount, 
			c.CategoryID as categoryId,
			c.Name as category,
			i.Date as [date], 
			i.Description as [desc]
		FROM Incomes as i
		JOIN Categories as c ON i.CategoryID = c.CategoryID
		WHERE i.IncomeID= @incomeId 
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserIncomesAndExpenses' )
DROP PROC GetUserIncomesAndExpenses
GO 

CREATE PROC GetUserIncomesAndExpenses 
	@userId varchar(28), 
	@date Date = null, 
	@categoryName varchar(50) = null
AS
	BEGIN
		SELECT 
			Incomes.IncomeID as id,
			Incomes.Amount as amount, 
			Categories.CategoryID as categoryId, 
			Categories.Name as category, 
			Incomes.Date as [date], 
			Incomes.Description as [desc], 
			'Income' as [type]
		FROM Incomes
		JOIN Categories ON Incomes.CategoryID = Categories.CategoryID
		WHERE 
			Incomes.UserID = @userId AND
			(@date IS NULL OR (MONTH(Incomes.Date) = MONTH(@date) AND YEAR(Incomes.Date) = YEAR(@date))) AND
			(@categoryName IS NULL OR (Categories.Name = @categoryName))

		UNION  ALL 

		SELECT 
			Expenses.ExpenseID as id,
			Expenses.Amount as amount, 
			Categories.CategoryID as categoryId, 
			Categories.Name as category, 
			Expenses.Date as [date], 
			Expenses.Description as [desc], 
			'Expense' as [type]
		FROM Expenses
		JOIN Categories ON Expenses.CategoryID = Categories.CategoryID
		WHERE 
			Expenses.UserID = @userId AND
			(@date IS NULL OR (MONTH(Expenses.Date) = MONTH(@date) AND YEAR(Expenses.Date) = YEAR(@date))) AND
			(@categoryName IS NULL OR (Categories.Name = @categoryName))

		ORDER BY [Date] DESC


    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserRoommates' )
DROP PROC GetUserRoommates
GO 

CREATE PROC GetUserRoommates 
	@userId varchar(28)
AS
	BEGIN
		SELECT 
			u.UserID as id,
			u.FirstName as firstName, 
			u.LastName as lastName, 
			u.Email as email
		FROM Roommates as r
		JOIN 
			Users as u ON r.Roommate1ID = u.UserID OR 
			r.Roommate2ID = u.UserID
		WHERE 
			(r.Roommate1ID = @userId OR r.Roommate2ID = @userId) AND 
			u.UserID != @userId
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetRoommateExpenses' )
DROP PROC GetRoommateExpenses
GO 

CREATE PROC GetRoommateExpenses 
	@expenseTo varchar(28),
	@expenseFrom varchar(28), 
	@date Date = null
AS
	BEGIN
		SELECT 
			re.RoommateExpenseID as id,
			u.UserID as roommateId, 
			c.Name as category, 
			re.Amount as amount, 
			re.Description as [desc], 
			re.Date as [date]
		FROM RoommateExpenses as re
		JOIN Categories as c ON c.CategoryID = re.CategoryID
		JOIN Users as u ON u.UserID = re.ExpenseFrom
		WHERE 
			re.ExpenseTo = @expenseTo AND
			re.ExpenseFrom = @expenseFrom AND 
			(@date IS NULL OR (MONTH(re.Date) = MONTH(@date) AND YEAR(re.Date) = YEAR(@date)))
		ORDER BY re.Date DESC
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserCategories' )
DROP PROC GetUserCategories
GO 

CREATE PROC GetUserCategories 
	@userId varchar(28)
AS
	BEGIN
		SELECT 
			c.CategoryID as id, 
			c.Name as category
		FROM UserCategories as uc
		JOIN Categories as c ON uc.CategoryID = c.CategoryID
		WHERE uc.UserID = @userId
		ORDER BY c.[Name]
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserCategoryTotals ' )
DROP PROC GetUserCategoryTotals 
GO 

CREATE PROC GetUserCategoryTotals 
	@userId varchar(28), 
	@date Date = null,
	@forYear bit = 0
AS
	BEGIN
		SELECT 
			SUM(e.Amount) as total, 
			c.Name as category
		FROM Expenses as e
		JOIN Categories as c ON c.CategoryID = e.CategoryID
		WHERE 
			(@forYear = 0 AND 
				e.UserID = @userId AND
				(@date IS NULL OR (MONTH(e.Date) = MONTH(@date) AND YEAR(e.Date) = YEAR(@date)))
			) OR
			(@forYear = 1 AND
				e.UserID = @userId AND
				(YEAR(e.Date) = YEAR(@date))
			)
		GROUP BY c.Name
		ORDER BY total DESC
		OPTION (RECOMPILE)
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetTotalIncomesAndExpenses ' )
DROP PROC GetTotalIncomesAndExpenses 
GO 

CREATE PROC GetTotalIncomesAndExpenses 
	@userId varchar(28), 
	@date Date = null,
	@forYear bit = 0
AS
	BEGIN
		SELECT incomes, expenses
			FROM
				(
					SELECT SUM(i.Amount) as incomes
					FROM Incomes as i
					WHERE 
						(@forYear = 0 AND 
							i.UserID = @userId AND
							(@date IS NULL OR (MONTH(i.Date) = MONTH(@date) AND YEAR(i.Date) = YEAR(@date)))
						) OR
						(@forYear = 1 AND 
							i.UserID = @userId AND
							(YEAR(i.Date) = YEAR(@date))
						)
				) A
				CROSS JOIN
				(
					SELECT SUM(e.Amount) as expenses
					FROM Expenses as e
					WHERE 
						(@forYear = 0 AND 
							e.UserID = @userId AND
							(@date IS NULL OR (MONTH(e.Date) = MONTH(@date) AND YEAR(e.Date) = YEAR(@date)))
						) OR
						(@forYear = 1 AND 
							e.UserID = @userId AND
							(YEAR(e.Date) = YEAR(@date))
						)
				) B
		OPTION (RECOMPILE)
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetCountOfTransactionsByDate ' )
DROP PROC GetCountOfTransactionsByDate 
GO 

CREATE PROC GetCountOfTransactionsByDate 
	@userId varchar(28), 
	@date Date = null
AS
	BEGIN
		SELECT date, SUM(cnt) as total
		FROM
			(
				SELECT 
					CAST(YEAR(Incomes.[Date]) AS VARCHAR(4)) + '-' + right('00' + CAST(MONTH([date]) AS VARCHAR(2)), 2) + '-' + right('00' + CAST(DAY([date]) AS VARCHAR(2)), 2) as date, 
					COUNT(*) as cnt
				FROM Incomes
				WHERE 
					Incomes.UserID = @userId AND
					(@date IS NULL OR (MONTH(Incomes.Date) = MONTH(@date) AND YEAR(Incomes.Date) = YEAR(@date)))
				GROUP BY  CAST(YEAR(Incomes.[Date]) AS VARCHAR(4)) + '-' + right('00' + CAST(MONTH([date]) AS VARCHAR(2)), 2) + '-' + right('00' + CAST(DAY([date]) AS VARCHAR(2)), 2)

				UNION ALL

				SELECT 
					CAST(YEAR(Expenses.[Date]) AS VARCHAR(4)) + '-' + right('00' + CAST(MONTH([date]) AS VARCHAR(2)), 2) + '-' + right('00' + CAST(DAY([date]) AS VARCHAR(2)), 2) as date, 
					COUNT(*) as cnt
				FROM Expenses
				WHERE 
					Expenses.UserID = @userId AND
					(@date IS NULL OR (MONTH(Expenses.Date) = MONTH(@date) AND YEAR(Expenses.Date) = YEAR(@date)))
				GROUP BY CAST(YEAR(Expenses.[Date]) AS VARCHAR(4)) + '-' + right('00' + CAST(MONTH([date]) AS VARCHAR(2)), 2) + '-' + right('00' + CAST(DAY([date]) AS VARCHAR(2)), 2)
			) as T
			GROUP BY date
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetCountOfTransactionCategories' )
DROP PROC GetCountOfTransactionCategories 
GO 

CREATE PROC GetCountOfTransactionCategories 
	@userId varchar(28), 
	@date Date = null
AS
	BEGIN
		SELECT category, SUM(cnt) as total
		FROM
		(
			SELECT Categories.[Name] as category, COUNT(*) as cnt
			FROM Incomes
			JOIN Categories ON Incomes.CategoryID = Categories.CategoryID
			WHERE 
				Incomes.UserID = @userId AND
				(@date IS NULL OR (MONTH(Incomes.Date) = MONTH(@date) AND YEAR(Incomes.Date) = YEAR(@date))) 
			GROUP BY Categories.[Name]

			UNION  ALL 

			SELECT Categories.[Name] as category, COUNT(*) as cnt
			FROM Expenses
			JOIN Categories ON Expenses.CategoryID = Categories.CategoryID
			WHERE 
				Expenses.UserID = @userId AND
				(@date IS NULL OR (MONTH(Expenses.Date) = MONTH(@date) AND YEAR(Expenses.Date) = YEAR(@date))) 
			GROUP BY Categories.[Name]
		) as T
		GROUP BY category
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetAllCategories' )
DROP PROC GetAllCategories 
GO 

CREATE PROC GetAllCategories 
AS
	BEGIN
		SELECT [Name] as category, CategoryID as id
		FROM Categories
		ORDER BY [Name]
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'GetUserCategory' )
DROP PROC GetUserCategory 
GO 

CREATE PROC GetUserCategory 
	@userId varchar(28), 
	@categoryID uniqueidentifier
AS
	BEGIN
		SELECT c.[Name] as category, c.CategoryID as categoryId, uc.UserID as userId
		FROM UserCategories as uc
		JOIN Categories as c ON c.CategoryID = uc.CategoryID
		WHERE uc.CategoryID = @categoryId AND uc.UserID = @userId
		ORDER BY c.[Name]
    END
GO


--PUTS
IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'UpdateExpense' )
DROP PROC UpdateExpense 
GO 

CREATE PROC UpdateExpense 
	@expenseId uniqueidentifier, 
	@amount money, 
	@date date, 
	@desc text, 
	@categoryId uniqueidentifier
AS
	BEGIN
		UPDATE Expenses
			SET 
				Amount = @amount, 
				[Date] = @date, 
				[Description] = @desc, 
				CategoryID = @categoryId
		WHERE ExpenseID = @expenseId
		
		EXEC GetUserExpense @expenseId = @expenseId
    END
GO

--DELETES
IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'DeleteExpense' )
DROP PROC DeleteExpense 
GO 

CREATE PROC DeleteExpense 
	@expenseId uniqueidentifier
AS
	BEGIN
		EXEC GetUserExpense @expenseId = @expenseId

		DELETE
		FROM Expenses
		WHERE ExpenseID = @expenseId
    END
GO

IF EXISTS ( SELECT [name] from sys.procedures WHERE [name] = 'DeleteUserCategory' )
DROP PROC DeleteUserCategory 
GO 

CREATE PROC DeleteUserCategory 
	@userId varchar(28),
	@categoryId uniqueidentifier 
AS
	BEGIN
		EXEC GetUserCategory @categoryId = @categoryId, @userId = @userId

		DELETE
		FROM UserCategories
		WHERE CategoryID = @categoryId AND UserID = @userId
    END
GO
