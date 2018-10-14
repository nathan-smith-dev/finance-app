CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- BASE TABLES
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
	name UNIQUE VARCHAR(50)
);


-- ONE TO MANY TABLES
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
	id VARCHAR(28) NOT NULL PRIMARY KEY, 
	first_name VARCHAR(50) NOT NULL, 
	last_name VARCHAR(50) NOT NULL, 
	email VARCHAR(50) NOT NULL
); 


-- ONE TO ONE TABLES
DROP TABLE IF EXISTS expenses CASCADE;
CREATE TABLE expenses (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
	user_id VARCHAR(28) NOT NULL, 
	amount MONEY NOT NULL, 
	category_id UUID NOT NULL, 
	description TEXT, 
	date TIMESTAMPTZ DEFAULT current_timestamp, 
	FOREIGN KEY (category_id) REFERENCES categories(id), 
	FOREIGN KEY (user_id) REFERENCES users(id)
); 

DROP TABLE IF EXISTS incomes CASCADE;
CREATE TABLE incomes (
	id UUID NOT NULL DEFAULT uuid_generate_v4(), 
	amount money NOT NULL, 
	user_id VARCHAR(28) NOT NULL, 
	category_id UUID NOT NULL, 
	date TIMESTAMPTZ DEFAULT current_timestamp,
	description text, 
	PRIMARY KEY (id), 
	FOREIGN KEY (category_id) REFERENCES categories(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
); 

DROP TABLE IF EXISTS roommate_expenses CASCADE;
CREATE TABLE roommate_expenses (
	id UUID NOT NULL DEFAULT uuid_generate_v4(), 
	expense_to VARCHAR(28) NOT NULL, 
	expense_from VARCHAR(28) NOT NULL, 
	amount money NOT NULL, 
	category_id UUID NOT NULL, 
	acknowledge BOOLEAN DEFAULT false, 
	resolved BOOLEAN DEFAULT false, 
	description text, 
	date TIMESTAMPTZ DEFAULT current_timestamp, 
	PRIMARY KEY (id), 
	FOREIGN KEY (expense_to) REFERENCES users(id), 
	FOREIGN KEY (expense_from) REFERENCES users(id)
); 


-- JUNCTION TABLES
DROP TABLE IF EXISTS user_categories CASCADE;
CREATE TABLE user_categories (
	user_id VARCHAR(28) NOT NULL, 
	category_id UUID NOT NULL, 
	PRIMARY KEY (user_id, category_id), 
	FOREIGN KEY (user_id) REFERENCES users(id), 
	FOREIGN KEY (category_id) REFERENCES categories(id)
); 

DROP TABLE IF EXISTS roommates CASCADE;
CREATE TABLE roommates (
	roommate1_id VARCHAR(28) NOT NULL,
	roommate2_id VARCHAR(28) NOT NULL, 
	PRIMARY KEY (roommate1_id, roommate2_id), 
	FOREIGN KEY (roommate1_id) REFERENCES users(id), 
	FOREIGN KEY (roommate2_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS roommate_requests CASCADE;
CREATE TABLE roommate_requests (
	id UUID NOT NULL DEFAULT uuid_generate_v4(), 
	requester_id VARCHAR(28) NOT NULL,
	recipient_id VARCHAR(28) NOT NULL, 
	date_sent TIMESTAMPTZ DEFAULT current_timestamp, 
	pending BOOLEAN DEFAULT true,
	PRIMARY KEY (id), 
	FOREIGN KEY (recipient_id) REFERENCES users(id), 
	FOREIGN KEY (requester_id) REFERENCES users(id)
);