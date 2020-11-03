insert into users (username, email, password)
values ('aherriot', 'agherriot@gmail.com', 'password');
\
set userId 1
insert into accounts (id, parent_id, type, user_id, name)
values (1, null, 'ASSET', :userId, 'Accounts');
insert into accounts (parent_id, type, user_id, name)
values (1, 'INCOME', :userId, 'Income');
insert into accounts (parent_id, type, user_id, name)
values (2, 'INCOME', :userId, 'Maryam');
insert into accounts (parent_id, type, user_id, name)
values (2, 'INCOME', :userId, 'Andrew');
insert into accounts (parent_id, type, user_id, name)
values (1, 'EXPENSE', :userId, 'Expenses');
insert into accounts (parent_id, type, user_id, name)
values (5, 'EXPENSE', :userId, 'Transit');
insert into accounts (parent_id, type, user_id, name)
values (6, 'EXPENSE', :userId, 'Car');
insert into accounts (parent_id, type, user_id, name)
values (7, 'EXPENSE', :userId, 'Gas');
insert into accounts (parent_id, type, user_id, name)
values (7, 'EXPENSE', :userId, 'Maintenance');
insert into accounts (parent_id, type, user_id, name)
values (5, 'EXPENSE', :userId, 'Vacation');
insert into accounts (parent_id, type, user_id, name)
values (5, 'EXPENSE', :userId, 'Entertainment');
insert into accounts (parent_id, type, user_id, name)
values (5, 'EXPENSE', :userId, 'Restaurants');
insert into accounts (parent_id, type, user_id, name)
values (5, 'EXPENSE', :userId, 'Kian');
insert into accounts (parent_id, type, user_id, name)
values (5, 'EXPENSE', :userId, 'Groceries');
insert into accounts (parent_id, type, user_id, name)
values (11, 'EXPENSE', :userId, 'Toys');
insert into accounts (parent_id, type, user_id, name)
values (1, 'ASSET', 1, 'Chequeing');
insert into accounts (parent_id, type, user_id, name)
values (1, 'ASSET', 1, 'Savings');
insert into transactions (
        amount,
        description,
        in_date,
        out_date,
        in_account,
        out_account
    )
values (
        100000,
        'Nokia Pay',
        '2020-03-01',
        '2020-03-01',
        3,
        1
    );