-- POSTS
DROP FUNCTION IF EXISTS create_category(VARCHAR(50));
-- creates a category by name if it does not exist already
CREATE FUNCTION create_category(catName VARCHAR(50))
RETURNS categories AS
$BODY$
DECLARE cat categories;
BEGIN 
    INSERT INTO categories(name)
    SELECT catName
    WHERE 
        NOT EXISTS (
            SELECT name FROM categories WHERE name = catName
        )
    RETURNING * INTO cat;

    RETURN cat;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS create_user(VARCHAR(28), VARCHAR(50), VARCHAR(50), VARCHAR(50));
-- creates a user if they do not exist already. if they do exist it returns the user
CREATE FUNCTION create_user(
    userId VARCHAR(28), 
    fName VARCHAR(50), 
    lName VARCHAR(50), 
    eml VARCHAR(50)
)
RETURNS TABLE(
    uid VARCHAR(28),
    "name" VARCHAR(50),
    email VARCHAR(50)
) AS 
$BODY$
DECLARE usr users;
BEGIN
    WITH i AS (
        INSERT INTO users(id, first_name, last_name, email) 
        VALUES (userId, fName, lName, eml) 
        ON CONFLICT (id) DO NOTHING RETURNING *
    )
    SELECT * FROM i
    UNION ALL
    SELECT * FROM users u
    INTO usr
    WHERE 
        u.id = userId AND 
        u.first_name = fName AND
        u.last_name = lName AND 
        u.email = eml
    LIMIT 1;

    RETURN QUERY SELECT * FROM get_user(usr.id);
    END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS create_expense(VARCHAR(28), MONEY, TEXT, TIMESTAMPTZ, VARCHAR(50), UUID);
-- creates an expense using either the category name or category id
CREATE FUNCTION create_expense(
	userId VARCHAR(28), 
	amnt MONEY, 
	dsc TEXT, 
    dte TIMESTAMPTZ,
	catName VARCHAR(50) DEFAULT null, 
	catId UUID DEFAULT null
)
RETURNS TABLE(
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT
) AS 
$BODY$
DECLARE foundCatId UUID;
DECLARE expense expenses;
BEGIN
    IF catId IS NOT null THEN
    	foundCatId := catId;
	ELSE 
		SELECT c.id INTO foundCatId FROM categories c
		WHERE name = catName;
    END IF;
	
	INSERT INTO expenses(user_id, amount, category_id, description, date)
	VALUES (userId, amnt, foundCatId, dsc, dte)
	RETURNING * INTO expense;
	
	RETURN QUERY SELECT * FROM get_expense(expense.id);    
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS create_income(VARCHAR(28), MONEY, TEXT, TIMESTAMPTZ, VARCHAR(50), UUID);
-- creates an income using either the category name or category id
CREATE FUNCTION create_income(
	userId VARCHAR(28), 
	amnt MONEY, 
	dsc TEXT, 
    dte TIMESTAMPTZ,
	catName VARCHAR(50) DEFAULT null, 
	catId UUID DEFAULT null
)
RETURNS TABLE(
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT
) AS 
$BODY$
DECLARE foundCatId UUID;
DECLARE income incomes;
BEGIN
    IF catId IS NOT null THEN
    	foundCatId := catId;
	ELSE 
		SELECT c.id INTO foundCatId FROM categories c
		WHERE name = catName;
    END IF;
	
	INSERT INTO incomes(user_id, amount, category_id, description, date)
	VALUES (userId, amnt, foundCatId, dsc, dte)
	RETURNING * INTO income;
	
	RETURN QUERY SELECT * FROM get_income(income.id);    
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS create_roommate(VARCHAR(28), VARCHAR(28));
-- create a roommate from a set of two user ids
CREATE FUNCTION create_roommate(id1 VARCHAR(28), id2 VARCHAR(28))
RETURNS void AS 
$BODY$
BEGIN
    IF EXISTS (SELECT id FROM users WHERE id = id1) THEN
		IF EXISTS (SELECT id FROM users WHERE id = id2) THEN
			IF NOT EXISTS ( 
				SELECT * FROM roommates 
				WHERE 
					(roommate1_id = id1 OR roommate2_id = id1) 
					AND (roommate1_id = id2 OR roommate2_id = id2) 
			) THEN
				INSERT INTO roommates(roommate1_id, roommate2_id)
				VALUES (id1, id2);
			END IF;
		END IF;
	END IF;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS create_roommate_request(VARCHAR(28), VARCHAR(28));
-- creates a roommate request 
CREATE FUNCTION create_roommate_request(requesterId VARCHAR(28), recipientId VARCHAR(28))
RETURNS TABLE(
    id UUID,
    pending BOOLEAN,
    "roomateId" VARCHAR(28),
    "firstName" VARCHAR(50), 
    "lastName" VARCHAR(50), 
    email VARCHAR(50),
    "date" TIMESTAMPTZ
) AS 
$BODY$
DECLARE request roommate_requests;
BEGIN
    IF EXISTS (SELECT * FROM users u WHERE u.id = requesterId) THEN
        IF EXISTS (SELECT * FROM users uu WHERE uu.id = recipientId) THEN
            INSERT INTO roommate_requests(requester_id, recipient_id, date_sent, pending)
            VALUES (requesterId, recipientId, NOW(), true)
            RETURNING * INTO request;

            RETURN QUERY SELECT * FROM get_roommate_request(request.id);
        END IF;
    END IF;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS create_user_category(VARCHAR(50), VARCHAR(28));
CREATE FUNCTION create_user_category(categoryName VARCHAR(50), usrId VARCHAR(28))
RETURNS TABLE (
    category VARCHAR(50), 
    categoryId UUID,
    userId VARCHAR(50)
) AS 
$BODY$
DECLARE cat user_categories;
DECLARE catId UUID;
BEGIN
    IF EXISTS (SELECT id FROM categories WHERE name = categoryName) THEN
        SELECT id FROM categories INTO catId WHERE name = categoryName;
    ELSE
        SELECT id FROM create_category(categoryName) INTO catId WHERE name = categoryName;
    END IF;

    IF NOT EXISTS (SELECT * FROM user_categories WHERE user_id = usrId AND category_id = catId) THEN
        INSERT INTO user_categories(user_id, category_id)
        VALUES (usrId, catId)
        RETURNING * INTO cat;

        RETURN QUERY SELECT * FROM get_user_category(usrId, cat.category_id);
    END IF;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS create_roommate_expense(VARCHAR(28), VARCHAR(28), MONEY, TEXT, TIMESTAMPTZ, VARCHAR(50), UUID);
CREATE FUNCTION create_roommate_expense(
    expenseTo VARCHAR(28), 
	expenseFrom VARCHAR(28), 
	amnt MONEY, 
	dsc TEXT, 
	dte TIMESTAMPTZ,
	catName VARCHAR(50) DEFAULT null,
	catId UUID DEFAULT null
)
RETURNS TABLE(
    id UUID, 
    category VARCHAR(50),
    categoryId UUID,
    amount NUMERIC, 
    "date" TIMESTAMPTZ, 
    "desc" TEXT, 
    roommateId VARCHAR(28), 
    acknowledged BOOLEAN,
    resolved BOOLEAN
) AS
$BODY$
DECLARE expense roommate_expenses;
DECLARE cId UUID;
BEGIN
    IF catId IS NOT NULL THEN
        cId := catId;
    ELSE 
        SELECT c.id FROM categories c INTO cId
        WHERE name = catName;
    END IF;

    INSERT INTO roommate_expenses(expense_to, expense_from, amount, category_id, description, date)
    VALUES (expenseTo, expenseFrom, amnt, cId, dsc, dte)
    RETURNING * INTO expense;

    RETURN QUERY SELECT * FROM get_roommate_expense(expense.id);
END;
$BODY$
LANGUAGE PLPGSQL;

-- GETS
DROP FUNCTION IF EXISTS get_user_expenses(VARCHAR(28), DATE, VARCHAR(50));
CREATE FUNCTION get_user_expenses(
    userId VARCHAR(28), 
	dte DATE DEFAULT null, 
	categoryName VARCHAR(50) DEFAULT null
)
RETURNS TABLE(
	id UUID, 
	amount NUMERIC, 
	categoryId UUID, 
	category VARCHAR(50),
	"date" TIMESTAMPTZ,
	"desc" TEXT
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        e.id, 
        CAST(e.amount AS NUMERIC),
        ca.id as "categoryId", 
        ca.name as "category",
        e.date, 
        e.description as "desc"
    FROM expenses e
    JOIN categories ca
        ON e.category_id = ca.id
    WHERE
        e.user_id = userId AND
        (dte IS NULL OR (EXTRACT(year FROM dte) = EXTRACT(year FROM e.date) AND EXTRACT(month FROM dte) = EXTRACT(month FROM e.date))) AND
        (categoryName IS NULL OR (ca.name = categoryName))
    ORDER BY e.date DESC;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_expense(UUID);
CREATE FUNCTION get_expense(expId UUID)
RETURNS TABLE(
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        CAST(e.amount AS NUMERIC),
        e.category_id AS categoryId,
        ca.name AS category,
        e.date,
        e.description AS "desc"
    FROM expenses e
    JOIN categories ca ON ca.id = e.category_id
    WHERE e.id = expId;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_user_incomes(VARCHAR(28), DATE, VARCHAR(50));
CREATE FUNCTION get_user_incomes(
    userId VARCHAR(28), 
	dte DATE DEFAULT null, 
	categoryName VARCHAR(50) DEFAULT null
)
RETURNS TABLE(
	id UUID, 
	amount NUMERIC, 
	categoryId UUID, 
	category VARCHAR(50),
	"date" TIMESTAMPTZ,
	"desc" TEXT
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        e.id, 
        CAST(e.amount AS NUMERIC),
        ca.id as "categoryId", 
        ca.name as "category",
        e.date, 
        e.description as "desc"
    FROM incomes e
    JOIN categories ca
        ON e.category_id = ca.id
    WHERE
        e.user_id = userId AND
        (dte IS NULL OR (EXTRACT(year FROM dte) = EXTRACT(year FROM e.date) AND EXTRACT(month FROM dte) = EXTRACT(month FROM e.date))) AND
        (categoryName IS NULL OR (ca.name = categoryName))
    ORDER BY e.date DESC;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_income(UUID);
CREATE FUNCTION get_income(incId UUID)
RETURNS TABLE(
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        CAST(i.amount AS NUMERIC),
        i.category_id AS categoryId,
        ca.name AS category,
        i.date,
        i.description AS "desc"
    FROM incomes i
    JOIN categories ca ON ca.id = i.category_id
    WHERE i.id = incId;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_user_incomes_and_expenses(VARCHAR(28), DATE, VARCHAR(50));
CREATE FUNCTION get_user_incomes_and_expenses(
    userId VARCHAR(28), 
    dte DATE DEFAULT null, 
	categoryName VARCHAR(50) DEFAULT null
)
RETURNS TABLE(
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT,
    "type" VARCHAR(10)
) AS 
$BODY$
DECLARE incme VARCHAR(10) := 'Income';
DECLARE expnse VARCHAR(10) := 'Expense';
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        CAST(i.amount AS NUMERIC), 
        i.category_id AS "categoryId",
        ca.name AS "category",
        i.date, 
        i.description AS "desc",
        incme AS "type"
    FROM 
        incomes i 
    JOIN 
        categories ca ON i.category_id = ca.id
    WHERE 
        i.user_id = userId AND
        (dte IS NULL OR (EXTRACT(year FROM dte) = EXTRACT(year FROM i.date)) AND EXTRACT(month FROM dte) = EXTRACT(month FROM i.date)) AND 
        (categoryName IS NULL OR (ca.name = categoryName))

    UNION ALL 

    SELECT 
        e.id,
        CAST(e.amount AS NUMERIC), 
        e.category_id AS "categoryId",
        ca.name AS "category",
        e.date, 
        e.description AS "desc",
        expnse AS "type"
    FROM 
        expenses e 
    JOIN 
        categories ca ON e.category_id = ca.id
    WHERE 
        e.user_id = userId AND
        (dte IS NULL OR (EXTRACT(year FROM dte) = EXTRACT(year FROM e.date)) AND EXTRACT(month FROM dte) = EXTRACT(month FROM e.date)) AND 
        (categoryName IS NULL OR (ca.name = categoryName))

    ORDER BY date DESC;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_user_roommates(VARCHAR(28));
CREATE FUNCTION get_user_roommates(userId VARCHAR(28))
RETURNS TABLE(
    id VARCHAR(28),
    "firstName" VARCHAR(50), 
    "lastName" VARCHAR(50), 
    email VARCHAR(50)
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.first_name AS "firstName", 
        u.last_name AS "lastName", 
        u.email
    FROM roommates r
    JOIN 
        users as u ON r.roommate1_id = u.id OR 
        r.roommate2_id = u.id
    WHERE 
        (r.roommate1_id = userId OR r.roommate2_id = userId) AND 
        u.id != userId;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_roommate(VARCHAR(28), VARCHAR(28));
CREATE FUNCTION get_roommate(
    rid1 VARCHAR(28),
    rid2 VARCHAR(28)
)
RETURNS roommates AS 
$BODY$
DECLARE rmmate roommates;
BEGIN
    SELECT *
    INTO rmmate
    FROM roommates
    WHERE 
        (roommate1_id = rid1 OR roommate2_id = rid1) AND (roommate1_id = rid2 OR roommate2_id = rid2);

    RETURN rmmate;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_roommate_expenses(VARCHAR(28), VARCHAR(28), DATE);
CREATE FUNCTION get_roommate_expenses(
    expenseTo VARCHAR(28),
	expenseFrom VARCHAR(28), 
	dte DATE DEFAULT null
)
RETURNS TABLE(
    id UUID,
    roommateId VARCHAR(28), 
    category VARCHAR(50), 
    amount NUMERIC, 
    "desc" TEXT, 
    "date" TIMESTAMPTZ
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT
        re.id AS id,
        u.id AS roommateId, 
        c.name AS category, 
        CAST(re.amount AS NUMERIC), 
        re.description AS "desc", 
        re.date
    FROM roommate_expenses AS re
    JOIN categories AS c ON c.id = re.category_id
    JOIN users AS u ON u.id = re.expense_from
    WHERE 
        re.resolved = false AND
        re.expense_to = expenseTo AND
        re.expense_from = expenseFrom AND 
        (dte IS NULL OR (EXTRACT(month FROM re.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM re.date) = EXTRACT(year FROM dte)))
    ORDER BY re.date DESC;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_roommate_expense_notifications(VARCHAR(28), DATE);
CREATE FUNCTION get_roommate_expense_notifications(
    expenseTo VARCHAR(28),
	dte DATE DEFAULT null
)
RETURNS TABLE(
    "roomateId" VARCHAR(28),
    notifications BIGINT
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        re.expense_from AS "roomateId",
        COUNT(*) AS notifications
    FROM roommate_expenses re
    WHERE 
        re.acknowledge = false AND
        re.expense_to = expenseTo AND
        (dte IS NULL OR (EXTRACT(month FROM re.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM re.date) = EXTRACT(year FROM dte)))
    GROUP BY re.expense_from;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_roommate_incomes_and_expenses(VARCHAR(28), VARCHAR(28));
CREATE FUNCTION get_roommate_incomes_and_expenses(
    expenseTo VARCHAR(28), 
	expenseFrom VARCHAR(28)
)
RETURNS TABLE(
    id UUID, 
    category VARCHAR(50),
    "categoryId" UUID,
    amount NUMERIC, 
    "date" TIMESTAMPTZ, 
    "desc" TEXT, 
    "roommateId" VARCHAR(28), 
    acknowledged BOOLEAN, 
    direction VARCHAR(10), 
    type VARCHAR(20)
) AS 
$BODY$
DECLARE incme VARCHAR(10) := 'Income';
DECLARE expnse VARCHAR(10) := 'Expense';
DECLARE dirTo VARCHAR(10) := 'To';
DECLARE dirFrom VARCHAR(10) := 'From';
BEGIN
	RETURN QUERY
    SELECT
        re.id, 
        c.name AS category,
        c.id AS "categoryId",
        CAST(re.amount AS NUMERIC), 
        re.date, 
        re.description AS "desc", 
        re.expense_from AS "roommateId", 
        re.acknowledge AS acknowledged, 
        dirFrom AS direction, 
        expnse AS type
    FROM roommate_expenses AS re
    JOIN categories AS c ON re.category_id = c.id
    WHERE 
        re.expense_from = expenseFrom AND 
        re.expense_to = expenseTo AND 
        re.resolved = false

    UNION  ALL 

    SELECT
        re.id, 
        c.name AS category,
        c.id AS "categoryId",
        CAST(re.amount AS NUMERIC), 
        re.date, 
        re.description AS "desc", 
        re.expense_to AS "roommateId", 
        re.acknowledge AS acknowledged, 
        dirTo AS direction, 
        expnse AS type
    FROM roommate_expenses AS re
    JOIN categories AS c ON re.category_id = c.id
    WHERE 
        re.expense_from = expenseTo AND 
        re.expense_to = expenseFrom AND 
        re.resolved = false

    ORDER BY date DESC;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_user_categories(VARCHAR(28));
CREATE FUNCTION get_user_categories(userId VARCHAR(28))
RETURNS TABLE(
    id UUID, 
    category VARCHAR(50)
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        c.id, 
        c.name as category
    FROM user_categories as uc
    JOIN categories as c ON uc.category_id = c.id
    WHERE uc.user_id = userId
    ORDER BY c.name;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_user_category_totals(VARCHAR(28), DATE, BOOLEAN);
CREATE FUNCTION get_user_category_totals(
    userId VARCHAR(28), 
	dte Date DEFAULT null,
	forYear BOOLEAN DEFAULT false
)
RETURNS TABLE(
    total NUMERIC, 
    category VARCHAR(50)
) AS 
$BODY$
BEGIN
	RETURN QUERY
    SELECT 
        SUM(CAST(e.amount AS NUMERIC)) AS total, 
        c.name AS category
    FROM expenses e
    JOIN categories c ON c.id = e.category_id
    WHERE 
        (forYear = FALSE AND 
            e.user_id = userId AND
            (dte IS NULL OR (EXTRACT(month FROM e.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM e.date) = EXTRACT(year FROM dte)))
        ) OR
        (forYear = TRUE AND
            e.user_id = userId AND
            (EXTRACT(year FROM e.date) = EXTRACT(year FROM dte))
        )
    GROUP BY c.name
    ORDER BY total DESC;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_total_incomes_and_expenses(VARCHAR(28), DATE, BOOLEAN);
CREATE FUNCTION get_total_incomes_and_expenses(
    userId VARCHAR(28), 
	dte Date DEFAULT null,
	forYear BOOLEAN DEFAULT false
)
RETURNS TABLE(
    incomes NUMERIC, 
    expenses NUMERIC
) AS
$BODY$
BEGIN
    RETURN QUERY
    SELECT incmes AS "incomes", expnses AS "expenses"
    FROM
    (
        SELECT SUM(CAST(i.amount AS NUMERIC)) AS incmes
        FROM incomes i
        WHERE 
            (forYear = FALSE AND 
                i.user_id = userId AND
                (date IS NULL OR (EXTRACT(month FROM i.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM i.date) = EXTRACT(year FROM dte)))
            ) OR
            (forYear = TRUE AND 
                i.user_id = userId AND
                (EXTRACT(year FROM i.date) = EXTRACT(year FROM dte))
            )
    ) A
    CROSS JOIN
    (
        SELECT SUM(CAST(e.amount AS NUMERIC)) AS expnses
        FROM Expenses e
        WHERE 
            (forYear = FALSE AND 
                e.user_id = userId AND
                (date IS NULL OR (EXTRACT(month FROM e.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM e.date) = EXTRACT(year FROM dte)))
            ) OR
            (forYear = TRUE AND 
                e.user_id = userId AND
                (EXTRACT(year FROM e.date) = EXTRACT(year FROM dte))
            )
    ) B;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_count_of_transactions_by_date(VARCHAR(28), DATE);
CREATE FUNCTION get_count_of_transactions_by_date(
    userId VARCHAR(28),
    dte DATE
) 
RETURNS TABLE(
    "date" TIMESTAMPTZ, 
    total NUMERIC
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT date1, SUM(cnt) as total
    FROM
    (
        SELECT 
            date_trunc('day', i.date) AS date1,
            COUNT(*) AS cnt
        FROM incomes i
        WHERE 
            i.user_id = userId AND
            (dte IS NULL OR (EXTRACT(month FROM i.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM i.date) = EXTRACT(year FROM dte)))
        GROUP BY  date1

        UNION ALL

        SELECT 
            date_trunc('day', e.date) AS date1,
            COUNT(*) AS cnt
        FROM expenses e
        WHERE 
            e.user_id = userId AND
            (dte IS NULL OR (EXTRACT(month FROM e.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM e.date) = EXTRACT(year FROM dte)))
        GROUP BY date1
    ) as T
    GROUP BY date1;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_count_of_transaction_categories(VARCHAR(28), DATE);
CREATE FUNCTION get_count_of_transaction_categories(
    userId VARCHAR(28), 
	dte DATE DEFAULT null
)
RETURNS TABLE(
    category VARCHAR(50),
    count NUMERIC
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT T.category, SUM(cnt) as total
    FROM
    (
        SELECT categories.name as category, COUNT(*) as cnt
        FROM incomes
        JOIN categories ON incomes.category_id = categories.id
        WHERE 
            incomes.user_id = userId AND
            (dte IS NULL OR (EXTRACT(month FROM incomes.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM incomes.date) = EXTRACT(year FROM dte))) 
        GROUP BY categories.name

        UNION  ALL 

        SELECT categories.name as category, COUNT(*) as cnt
        FROM Expenses
        JOIN categories ON Expenses.category_id = categories.id
        WHERE 
            Expenses.user_id = userId AND
            (dte IS NULL OR (EXTRACT(month FROM Expenses.date) = EXTRACT(month FROM dte) AND EXTRACT(year FROM Expenses.date) = EXTRACT(year FROM dte))) 
        GROUP BY categories.name
    ) as T
    GROUP BY T.category;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_all_categories();
CREATE FUNCTION get_all_categories()
RETURNS TABLE(
    id UUID,
    category VARCHAR(50)
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT c.id, c.name as category
    FROM categories c
    ORDER BY category;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_all_users();
CREATE FUNCTION get_all_users()
RETURNS TABLE(
    uid VARCHAR(28),
    "name" VARCHAR(50),
    email VARCHAR(50)
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT
        u.id AS uid, 
        u.first_name AS name, 
        u.email AS email
    FROM users u;
END;
$BODY$
LANGUAGE PLPGSQL; 

DROP FUNCTION IF EXISTS get_user(VARCHAR(28));
CREATE FUNCTION get_user(userId VARCHAR(28))
RETURNS TABLE(
    uid VARCHAR(28),
    "name" VARCHAR(50),
    email VARCHAR(50)
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        u.id AS uid, 
        u.first_name AS "name",
        u.email
    FROM users u
    WHERE u.id = userId;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_user_category(VARCHAR(28), UUID);
CREATE FUNCTION get_user_category(
    usrId VARCHAR(28),
    catId UUID
)
RETURNS TABLE (
    category VARCHAR(50), 
    categoryId UUID,
    userId VARCHAR(50)
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        c.name AS category, 
        c.id AS "categoryId",
        uc.user_id AS "userId"
    FROM user_categories uc
    JOIN categories c ON 
        uc.category_id = c.id
    WHERE 
        uc.category_id = catId AND 
        uc.user_id = usrId;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_roommate_requests(VARCHAR(28));
CREATE FUNCTION get_roommate_requests(userId VARCHAR(28))
RETURNS TABLE(
    id UUID,
    pending BOOLEAN,
    "roomateId" VARCHAR(28),
    "firstName" VARCHAR(50), 
    "lastName" VARCHAR(50), 
    email VARCHAR(50),
    "date" TIMESTAMPTZ
) AS 
$BODY$
BEGIN
    RETURN QUERY 
    SELECT 
        rr.id,
        rr.pending,
        rr.requester_id AS "roomateId",
        u.first_name AS "firstName", 
        u.last_name AS "lastName", 
        u.email,
        rr.date_sent AS "date"
    FROM roommate_requests rr
    JOIN users u ON u.id = rr.requester_id
    WHERE rr.pending = true AND rr.recipient_id = userId;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_roommate_request(UUID);
CREATE FUNCTION get_roommate_request(reqId UUID)
RETURNS TABLE(
    id UUID,
    pending BOOLEAN,
    "roomateId" VARCHAR(28),
    "firstName" VARCHAR(50), 
    "lastName" VARCHAR(50), 
    email VARCHAR(50),
    "date" TIMESTAMPTZ
) AS 
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        rr.id,
        rr.pending,
        rr.requester_id AS "roomateId",
        u.first_name AS "firstName", 
        u.last_name AS "lastName", 
        u.email,
        rr.date_sent AS "date"
    FROM roommate_requests rr
    JOIN users u ON u.id = rr.requester_id
    WHERE rr.id = reqId;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS get_roommate_expense(UUID);
CREATE FUNCTION get_roommate_expense(expenseId UUID)
RETURNS TABLE(
    id UUID, 
    category VARCHAR(50),
    "categoryId" UUID,
    amount NUMERIC, 
    "date" TIMESTAMPTZ, 
    "desc" TEXT, 
    "roommateId" VARCHAR(28), 
    acknowledged BOOLEAN,
    resolved BOOLEAN
) AS
$BODY$
BEGIN
    RETURN QUERY
    SELECT 
        re.id, 
        c.name AS category,
        c.id AS categoryId,
        CAST(re.amount AS NUMERIC), 
        re.date, 
        re.description AS "desc", 
        re.expense_to AS "roommateId", 
        re.acknowledge AS acknowledged,
        re.resolved
    FROM roommate_expenses re
    JOIN categories AS c ON re.category_id = c.id
    WHERE re.id = expenseId;
END;
$BODY$
LANGUAGE PLPGSQL;

-- PUTS
DROP FUNCTION IF EXISTS update_expense(UUID, MONEY, TIMESTAMPTZ, TEXT, UUID);
CREATE FUNCTION update_expense(
    expnseId UUID, 
	amnt MONEY, 
	dte TIMESTAMPTZ, 
	descrip TEXT, 
	catId UUID
)
RETURNS TABLE(
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT
) AS 
$BODY$
BEGIN
    UPDATE expenses e
        SET 
            amount = amnt, 
            date = dte, 
            description = descrip, 
            category_id = catId
    WHERE e.id = expnseId;

    RETURN QUERY SELECT * FROM get_expense(expnseId);
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS update_income(UUID, MONEY, TIMESTAMPTZ, TEXT, UUID);
CREATE FUNCTION update_income(
    incomeId UUID, 
	amnt MONEY, 
	dte TIMESTAMPTZ, 
	descrip TEXT, 
	catId UUID
)
RETURNS TABLE(
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT
) AS 
$BODY$
BEGIN
    UPDATE incomes e
        SET 
            amount = amnt, 
            date = dte, 
            description = descrip, 
            category_id = catId
    WHERE e.id = incomeId;

    RETURN QUERY SELECT * FROM get_income(incomeId);
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS accept_roommate_request(UUID, BOOLEAN);
CREATE FUNCTION accept_roommate_request(
    requestId UUID,
	accept BOOLEAN DEFAULT true 
)
RETURNS TABLE(
    roommate1_id VARCHAR(28),
    roommate2_id VARCHAR(28)
) AS 
$BODY$
DECLARE userId VARCHAR(28);
DECLARE roomateId VARCHAR(28); 
BEGIN
    UPDATE roommate_requests rr
        SET pending = false
    WHERE rr.id = requestId;

    IF accept = true THEN
        SELECT 
            rrr.recipient_id, 
            rrr.requester_id
        INTO 
            userId,
            roomateId
        FROM roommate_requests rrr
        WHERE rrr.id = requestId;

        PERFORM create_roommate(userId, roomateId);

        RETURN QUERY SELECT * FROM get_roommate(userId, roomateId);
    ELSE
        RETURN QUERY SELECT * FROM get_roommate(null, null);
    END IF;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS update_roommate_expense(UUID, MONEY, TIMESTAMPTZ, TEXT, UUID, BOOLEAN, BOOLEAN );
CREATE FUNCTION update_roommate_expense(
    expenseId UUID, 
	amnt MONEY, 
	dte TIMESTAMPTZ, 
	descrip TEXT, 
	catId UUID, 
	rslved BOOLEAN, 
	acknw BOOLEAN
)
RETURNS TABLE(
    id UUID, 
    category VARCHAR(50),
    categoryId UUID,
    amount NUMERIC, 
    "date" TIMESTAMPTZ, 
    "desc" TEXT, 
    roommateId VARCHAR(28), 
    acknowledged BOOLEAN,
    resolved BOOLEAN
) AS
$BODY$
BEGIN
    UPDATE roommate_expenses re
        SET 
            amount = amnt, 
            date = dte, 
            description = descrip, 
            category_id = catId, 
            resolved = rslved, 
            acknowledge = acknw
    WHERE re.id = expenseId;
    
    RETURN QUERY SELECT * FROM get_roommate_expense(expenseId);
END;
$BODY$
LANGUAGE PLPGSQL;

-- DELETES
DROP TYPE IF EXISTS expense_type CASCADE;
CREATE TYPE expense_type AS (
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT
);
DROP FUNCTION IF EXISTS delete_expense(UUID);
CREATE FUNCTION delete_expense(expId UUID)
RETURNS expense_type AS
$BODY$
DECLARE expnse expense_type;
BEGIN
    SELECT * INTO expnse FROM get_expense(expId);

    DELETE
    FROM expenses
    WHERE id = expId;

    RETURN expnse;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP TYPE IF EXISTS income_type CASCADE;
CREATE TYPE income_type AS (
    id UUID, 
    amount NUMERIC, 
    categoryId UUID,
    category VARCHAR(50),
    "date" TIMESTAMPTZ, 
    "desc" TEXT
);
DROP FUNCTION IF EXISTS delete_income(UUID);
CREATE FUNCTION delete_income(incId UUID)
RETURNS income_type AS
$BODY$
DECLARE incm income_type;
BEGIN
    SELECT * INTO incm FROM get_income(incId);

    DELETE
    FROM incomes
    WHERE id = incId;

    RETURN incm;
END;
$BODY$
LANGUAGE PLPGSQL;


DROP FUNCTION IF EXISTS delete_roommate(VARCHAR(28), VARCHAR(28));
CREATE FUNCTION delete_roommate(
    id1 VARCHAR(28), 
    id2 VARCHAR(28)
) 
RETURNS roommates AS 
$BODY$
DECLARE rmmate roommates;
BEGIN
    SELECT *
    INTO rmmate
    FROM roommates
    WHERE 
    (roommate1_id = id1 OR roommate2_id = id1) AND 
    (roommate1_id = id2 OR roommate2_id = id2);

    DELETE
    FROM roommates
    WHERE 
    (roommate1_id = id1 OR roommate2_id = id1) AND 
    (roommate1_id = id2 OR roommate2_id = id2);

    RETURN rmmate;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP TYPE IF EXISTS user_category_type CASCADE;
CREATE TYPE user_category_type AS (
    category VARCHAR(50), 
    categoryId UUID,
    userId VARCHAR(50)
);
DROP FUNCTION IF EXISTS delete_user_category(VARCHAR(28), UUID);
CREATE FUNCTION delete_user_category(userId VARCHAR(28), catId UUID)
RETURNS user_category_type AS
$BODY$
DECLARE usrCat user_category_type;
BEGIN
    SELECT * 
    INTO usrCat 
    FROM get_user_category(userId, catId);

    DELETE
    FROM user_categories
    WHERE category_id = catId AND user_id = userId;

    RETURN usrCat;
END;
$BODY$
LANGUAGE PLPGSQL;
