ALTER TABLE [dbo].[Expenses] DROP CONSTRAINT [FK__Expenses__Catego__2645B050];
ALTER TABLE [dbo].[Expenses] DROP CONSTRAINT [FK__Expenses__UserID__2739D489];
ALTER TABLE [dbo].[Incomes] DROP CONSTRAINT [FK__Incomes__UserID__2BFE89A6];
ALTER TABLE [dbo].[RoommateExpenses] DROP CONSTRAINT [FK__RoommateE__Expen__31B762FC];
ALTER TABLE [dbo].[RoommateExpenses] DROP CONSTRAINT [FK__RoommateE__Expen__32AB8735];
ALTER TABLE [dbo].[UserCategories] DROP CONSTRAINT [FK__UserCateg__UserI__3587F3E0];
ALTER TABLE [dbo].[UserCategories] DROP CONSTRAINT [FK__UserCateg__Categ__367C1819];
ALTER TABLE [dbo].[Roommates] DROP CONSTRAINT [FK__Roommates__Roomm__395884C4];
ALTER TABLE [dbo].[Roommates] DROP CONSTRAINT [FK__Roommates__Roomm__3A4CA8FD];

DROP TABLE [Categories];
DROP TABLE [Users];
DROP TABLE [Expenses];
DROP TABLE [Incomes];
DROP TABLE [RoommateExpenses];
DROP TABLE [UserCategories];
DROP TABLE [Roommates];